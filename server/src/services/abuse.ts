// Counters, rate-limit storage and automatic IP bans, shared by every serverless
// instance through MongoDB (Mentis keeps the same things in Redis; this app stays on
// free tiers, so Mongo it is). Ported from Mentis middlewares/botProtection.ts and
// the Redis store under rateLimiter.ts. The middleware that uses it is
// server/src/bot-protection.ts; the limiters are in server/src/security.ts.
//
// Everything here FAILS OPEN: if the database is down or slow to answer, a request is
// allowed and one structured line is logged. Protection is a layer, never a reason to
// turn a family away with a 500.
import mongoose from 'mongoose';
import type { ClientRateLimitInfo, IncrementResponse, Options, Store } from 'express-rate-limit';
import { AbuseCounter, IpBan, type BAN_REASONS } from '../models-account.js';
import { sha256 } from '../tokens.js';

type BanReason = (typeof BAN_REASONS)[number];

const warn = (msg: string, extra: Record<string, unknown>) => console.warn(JSON.stringify({ level: 'warn', msg, ...extra }));

/**
 * Run a database step; on any failure (or no connection yet, which would otherwise
 * wait out Mongoose's 10s command buffer) log one line and answer `fallback`.
 */
const failOpen = async <T>(what: string, fn: () => Promise<T>, fallback: T): Promise<T> => {
  if (mongoose.connection.readyState !== 1) {
    warn('abuse store unavailable, allowing', { what, error: 'not connected' });
    return fallback;
  }
  try {
    return await fn();
  } catch (err) {
    warn('abuse store unavailable, allowing', { what, error: (err as Error)?.message ?? String(err) });
    return fallback;
  }
};

/* ---------- The one counter primitive ---------- */

const isDuplicateKey = (err: unknown) => (err as { code?: number })?.code === 11000;

/**
 * Add `by` to a fixed-window counter and return the new total. One atomic upsert: a
 * live window is incremented, an ended one (or a missing row) restarts at `by`. Two
 * first hits can race to insert the same _id; the loser gets a duplicate-key error
 * and its retry finds the row. Throws on a database error (callers go through failOpen).
 */
export const countHit = async (key: string, windowMs: number, by = 1): Promise<{ hits: number; resetAt: Date }> => {
  const now = new Date();
  const live = { $gt: ['$resetAt', now] };
  const update = [
    {
      $set: {
        hits: { $cond: [live, { $add: ['$hits', by] }, by] },
        resetAt: { $cond: [live, '$resetAt', new Date(now.getTime() + windowMs)] },
      },
    },
  ];
  for (let attempt = 0; ; attempt++) {
    try {
      const row = await AbuseCounter.findOneAndUpdate({ _id: key }, update, { upsert: true, new: true, lean: true });
      return { hits: row!.hits, resetAt: row!.resetAt };
    } catch (err) {
      if (attempt < 2 && isDuplicateKey(err)) continue;
      throw err;
    }
  }
};

const readCount = async (key: string) => {
  const row = await AbuseCounter.findOne({ _id: key, resetAt: { $gt: new Date() } }).lean();
  return row ? { hits: row.hits, resetAt: row.resetAt } : null;
};

const clearCount = (key: string) => AbuseCounter.deleteOne({ _id: key });

/* ---------- Rate limits ---------- */

/**
 * The express-rate-limit store every limiter uses (security.ts `limiter()` builds one
 * per limiter, named, so two limiters with the same key never share a count). An
 * in-memory store would give each Vercel instance its own private count, so the
 * advertised limit would really be limit x instances.
 */
export class MongoRateLimitStore implements Store {
  /** Counts live in the database: one store's hits are seen by every instance. */
  localKeys = false;
  prefix: string;
  private windowMs = 60_000;

  constructor(name: string) {
    this.prefix = `rl:${name}:`;
  }

  /** Some keys hold an email, a kid id or a family code, so the stored id is a hash of it. */
  private id(key: string) {
    return this.prefix + sha256(key);
  }

  init(options: Options) {
    this.windowMs = options.windowMs;
  }

  async increment(key: string): Promise<IncrementResponse> {
    // Fail open as the first hit of a fresh window (express-rate-limit needs a positive count).
    const hit = await failOpen('rate limit', () => countHit(this.id(key), this.windowMs), null);
    return hit ? { totalHits: hit.hits, resetTime: hit.resetAt } : { totalHits: 1, resetTime: new Date(Date.now() + this.windowMs) };
  }

  async decrement(key: string) {
    await failOpen(
      'rate limit decrement',
      () => AbuseCounter.updateOne({ _id: this.id(key), resetAt: { $gt: new Date() }, hits: { $gt: 0 } }, { $inc: { hits: -1 } }),
      null,
    );
  }

  async resetKey(key: string) {
    await failOpen('rate limit reset', () => clearCount(this.id(key)), null);
  }

  async get(key: string): Promise<ClientRateLimitInfo | undefined> {
    const row = await failOpen('rate limit read', () => readCount(this.id(key)), null);
    return row ? { totalHits: row.hits, resetTime: row.resetAt } : undefined;
  }
}

/* ---------- Bans (Mentis AUTOMATED_BAN_LADDER_SECONDS) ---------- */

/**
 * An automatic ban never jumps to days: one address is often a whole school, a phone
 * carrier's NAT or a VPN exit, so the first ban is short and only a repeat offender
 * climbs. 15 minutes ends a scanner's run (they move on in seconds) and costs a
 * misidentified family almost nothing.
 */
export const BAN_LADDER_MS = [15 * 60_000, 60 * 60_000, 6 * 60 * 60_000, 24 * 60 * 60_000] as const;
/** How long an address's past bans count toward the next rung. */
const OFFENSE_MEMORY_MS = 7 * 24 * 60 * 60_000;

/** Is this address (an ipKey) banned right now? Fails open. */
export const isBanned = (ip: string) => failOpen('ban check', async () => !!(await IpBan.exists({ _id: ip, until: { $gt: new Date() } })), false);

/**
 * Ban an address for its next rung. Claimed with one conditional upsert (only when no
 * ban is live), so two requests crossing a threshold together issue ONE ban and climb
 * ONE rung; the loser's insert hits the duplicate key and stops.
 */
const applyBan = async (ip: string, reason: BanReason): Promise<number | null> => {
  const now = Date.now();
  try {
    await IpBan.updateOne({ _id: ip, until: { $lte: new Date(now) } }, { $set: { reason, until: new Date(now + BAN_LADDER_MS[0]), offense: 1 } }, { upsert: true });
  } catch (err) {
    if (isDuplicateKey(err)) return null;
    throw err;
  }
  const { hits: offense } = await countHit(`offense:${ip}`, OFFENSE_MEMORY_MS);
  const ms = BAN_LADDER_MS[Math.min(offense, BAN_LADDER_MS.length) - 1];
  if (offense > 1) await IpBan.updateOne({ _id: ip }, { $set: { until: new Date(now + ms), offense } });
  warn('automatic ip ban', { ip, reason, offense, minutes: ms / 60_000 });
  return ms;
};

/* ---------- Bot risk score (Mentis recordBotSignal) ---------- */

/**
 * What each signal adds to an address's score; reaching RISK_BAN_THRESHOLD inside
 * the window bans it. One weak signal never bans: three honeypot probes or scanner
 * requests do (a scanner sends hundreds), and so does a honeypot form plus a little more.
 */
export const BOT_SIGNAL_WEIGHTS = {
  /** A path no person or part of this app ever asks for (/wp-admin, /.env, ...). */
  honeypotPath: 5,
  /** A known attack tool's user agent (sqlmap, nikto, ...). */
  scannerAgent: 5,
  /** `..` in a path. */
  pathTraversal: 5,
  /** A hidden form field came back filled. */
  honeypotField: 5,
  /** Submitted faster than a person could AND with no pointer, key or touch at all. */
  timingAndInteraction: 5,
  noInteraction: 3,
  tooFast: 2,
} as const;
export type BotSignalKind = keyof typeof BOT_SIGNAL_WEIGHTS;
export const RISK_BAN_THRESHOLD = 15;
const RISK_WINDOW_MS = 6 * 60 * 60_000;

/**
 * Add a signal to an address's score, and ban it on the ladder once the score
 * reaches the threshold. The score is not cleared by a ban, so a signal right after
 * a ban ends earns the next, longer rung. Fails open. Returns the new score.
 */
export const recordBotSignal = (ip: string, kind: BotSignalKind, detail?: string) =>
  failOpen(
    'bot signal',
    async () => {
      const { hits: score } = await countHit(`risk:${ip}`, RISK_WINDOW_MS, BOT_SIGNAL_WEIGHTS[kind]);
      warn('bot signal', { ip, kind, score, detail: detail?.slice(0, 120) });
      if (score >= RISK_BAN_THRESHOLD) await applyBan(ip, 'bot_risk_threshold');
      return score;
    },
    0,
  );

/* ---------- Failed sign-ins from one address (Mentis recordFailedAuth) ---------- */

/**
 * Wrong passwords and PINs from one address before it is banned. Higher than Mentis's
 * 20: one home can hold a family of kids, each allowed 5 wrong PINs before their own
 * lock, and the family-wide PIN limiter stops at 30. A credential-stuffing run across
 * many emails reaches it in seconds.
 */
export const FAILED_SIGNIN_THRESHOLD = 40;
const FAILED_SIGNIN_WINDOW_MS = 15 * 60_000;

/** Count one failed sign-in; at the threshold the address is banned and its count starts over. */
export const recordFailedSignIn = (ip: string) =>
  failOpen(
    'failed sign-in',
    async () => {
      const { hits } = await countHit(`fail:${ip}`, FAILED_SIGNIN_WINDOW_MS);
      if (hits >= FAILED_SIGNIN_THRESHOLD) {
        await applyBan(ip, 'excessive_auth_failures');
        await clearCount(`fail:${ip}`);
      }
      return hits;
    },
    0,
  );
