// Session handling, ported from Mentis: a short-lived JWT access token plus a
// long-lived opaque refresh token that is stored hashed and rotated on every use.
// Web clients get the refresh token as an httpOnly cookie; native (Capacitor)
// clients send `X-Client-Platform: native` and get it in the body instead.
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction, CookieOptions } from 'express';
import { config } from './config.js';
import { HttpError } from './http.js';
import { RefreshToken, User, type UserDoc } from './models.js';
import { RevokedJti, SessionCutoff, SpentRefreshToken } from './models-account.js';
import { newToken, sha256 } from './tokens.js';

export interface AuthedUser {
  userId: string;
  familyId: string;
  role: 'parent' | 'kid';
}

declare module 'express-serve-static-core' {
  interface Request {
    auth: AuthedUser;
  }
}

const REFRESH_COOKIE = 'kk_refresh';
const cookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: config.isHosted,
  sameSite: config.isHosted ? 'none' : 'lax',
  path: '/api/auth',
  maxAge: config.refreshTokenDays * 24 * 60 * 60 * 1000,
});

const isNative = (req: Request) => req.get('X-Client-Platform') === 'native';

/**
 * The one place an access token is minted. `t` is the mint time in milliseconds:
 * `iat` is whole seconds, so a token minted in the same second as a revocation
 * would otherwise survive it (Mentis isTokenBehindRevocationCutoff). `jti` names
 * this one token, so signing out can end it before it expires (RevokedJti).
 */
const signAccessToken = (user: UserDoc) =>
  jwt.sign(
    { userId: String(user._id), familyId: String(user.familyId), role: user.role, t: Date.now() } satisfies AuthedUser & { t: number },
    config.jwtSecret,
    { expiresIn: config.accessTokenTtl, algorithm: 'HS256', jwtid: crypto.randomUUID() } as jwt.SignOptions,
  );

type AccessClaims = AuthedUser & { t?: number; iat?: number; exp?: number; jti?: string };
const verifyAccessToken = (token: string) => jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] }) as AccessClaims;

export const publicUser = (u: UserDoc) => ({
  id: String(u._id),
  familyId: String(u.familyId),
  role: u.role,
  name: u.name,
  avatar: u.avatar,
  email: u.email ?? null,
  balanceCents: u.balanceCents,
  // Grown-ups only. Kids have no email; their answer is always true so no banner shows.
  emailVerified: u.role !== 'parent' || !!u.emailVerifiedAt,
  // Whether "change password" needs the current one, or a reset link must set the first one.
  hasPassword: !!u.passwordHash,
});

/** Start a session: mint both tokens and hand them to the client the right way. */
export const issueSession = async (req: Request, res: Response, user: UserDoc) => {
  const refreshToken = newToken(48);
  await RefreshToken.create({
    userId: user._id,
    tokenHash: sha256(refreshToken),
    expiresAt: new Date(Date.now() + config.refreshTokenDays * 86_400_000),
  });
  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions());
  return {
    accessToken: signAccessToken(user),
    user: publicUser(user),
    ...(isNative(req) ? { refreshToken } : {}),
  };
};

const readRefreshToken = (req: Request): string | undefined =>
  req.cookies?.[REFRESH_COOKIE] || (typeof req.body?.refreshToken === 'string' ? req.body.refreshToken : undefined);

/**
 * Two tabs, a reload, React StrictMode or a phone resuming mid-request can send
 * the same refresh token twice a moment apart. Mentis lets the loser of that race
 * 401; here a token rotated within this window is treated as that benign race and
 * gets ONE fresh session of its own (graceUsed is claimed once), so nobody is signed
 * out and a burst of replays cannot mint a session each. Only a rotated token that
 * comes back AFTER the window is treated as stolen.
 */
export const REUSE_GRACE_MS = 10_000;

export const rotateSession = async (req: Request, res: Response): Promise<Awaited<ReturnType<typeof issueSession>>> => {
  const token = readRefreshToken(req);
  if (!token) throw new HttpError(401, 'No session');
  const tokenHash = sha256(token);
  // Mark the token spent BEFORE consuming it, so the loser of a concurrent refresh
  // always finds the marker (marking after the delete left a gap where it saw neither).
  const live = await RefreshToken.findOne({ tokenHash, expiresAt: { $gt: new Date() } }).select('userId expiresAt').lean();
  if (live) {
    await SpentRefreshToken.updateOne(
      { tokenHash },
      { $setOnInsert: { userId: live.userId, expiresAt: live.expiresAt } },
      { upsert: true, timestamps: true },
    );
  }
  // findOneAndDelete makes the token single-use: of two concurrent calls exactly one wins.
  const stored = live && (await RefreshToken.findOneAndDelete({ tokenHash, expiresAt: { $gt: new Date() } }));
  if (!stored) {
    const spent = await SpentRefreshToken.findOne({ tokenHash, expiresAt: { $gt: new Date() } });
    if (spent && Date.now() - spent.createdAt!.getTime() <= REUSE_GRACE_MS) {
      // Inside the window: one grace session per spent token, never more.
      const grace = await SpentRefreshToken.findOneAndUpdate({ _id: spent._id, graceUsed: false }, { $set: { graceUsed: true } });
      const user = grace && (await User.findById(spent.userId));
      if (user) return issueSession(req, res, user);
      // Grace already used: refuse this caller but do not revoke; the race is still benign.
      throw new HttpError(401, 'Session expired');
    }
    res.clearCookie(REFRESH_COOKIE, { ...cookieOptions(), maxAge: undefined });
    // Reuse detection: a token we rotated a while ago came back, so someone copied it.
    // End every session that user has, the thief's and the owner's alike.
    if (spent) {
      await revokeAllSessions(String(spent.userId));
      console.warn(JSON.stringify({ level: 'warn', msg: 'refresh token reuse detected, all sessions revoked', userId: String(spent.userId) }));
      throw new HttpError(401, 'Please sign in again', 'SESSION_REVOKED');
    }
    throw new HttpError(401, 'Session expired');
  }
  const user = await User.findById(stored.userId);
  if (!user) throw new HttpError(401, 'Session expired');
  return issueSession(req, res, user);
};

/**
 * Sign out this device: delete its refresh token AND end the access token it sent,
 * which would otherwise keep working until it expires (up to 15 minutes).
 */
export const endSession = async (req: Request, res: Response) => {
  const token = readRefreshToken(req);
  const bearer = req.get('Authorization')?.startsWith('Bearer ') ? req.get('Authorization')!.slice(7) : null;
  let claims: AccessClaims | null = null;
  try {
    claims = bearer ? verifyAccessToken(bearer) : null;
  } catch {
    // Expired or forged: nothing left to end.
  }
  await Promise.all([
    token ? RefreshToken.deleteOne({ tokenHash: sha256(token) }) : null,
    claims?.jti && claims.exp
      ? RevokedJti.updateOne({ jti: claims.jti }, { $setOnInsert: { expiresAt: new Date(claims.exp * 1000) } }, { upsert: true })
      : null,
  ]);
  if (claims?.jti) revokedCache.set(claims.jti, true);
  res.clearCookie(REFRESH_COOKIE, { ...cookieOptions(), maxAge: undefined });
};

/* ---------- Revocation (ported from Mentis invalidateUserTokens) ---------- */

/**
 * Cutoffs and revoked token ids are read on every request, so each process keeps a
 * short cache. The process that revokes updates its own cache at once; others
 * catch up within the TTL.
 */
const shortCache = <V>(ttlMs = 30_000, max = 10_000) => {
  const map = new Map<string, { value: V; cachedAt: number }>();
  return {
    get: (key: string) => {
      const hit = map.get(key);
      return hit && Date.now() - hit.cachedAt < ttlMs ? hit : undefined;
    },
    set: (key: string, value: V) => {
      if (map.size >= max) map.delete(map.keys().next().value!);
      map.set(key, { value, cachedAt: Date.now() });
    },
  };
};
const cutoffCache = shortCache<number | null>();
const revokedCache = shortCache<boolean>();
const remember = (userId: string, at: number | null) => cutoffCache.set(userId, at);
const cutoffFor = async (userId: string) => {
  const hit = cutoffCache.get(userId);
  if (hit) return hit.value;
  const row = await SessionCutoff.findOne({ userId }).lean();
  const at = row?.at ? row.at.getTime() : null;
  remember(userId, at);
  return at;
};
const isRevoked = async (jti: string | undefined) => {
  if (!jti) return false;
  const hit = revokedCache.get(jti);
  if (hit) return hit.value;
  const revoked = !!(await RevokedJti.exists({ jti }));
  revokedCache.set(jti, revoked);
  return revoked;
};

/**
 * End every session a user has: delete their refresh tokens and refuse every
 * access token minted up to now. Used by sign out everywhere, password change and
 * reset, and refresh token reuse. Callers that keep the current device signed in
 * start a fresh session with issueSession() afterwards.
 */
export const revokeAllSessions = async (userId: string) => {
  const at = new Date();
  await Promise.all([
    RefreshToken.deleteMany({ userId }),
    SpentRefreshToken.deleteMany({ userId }),
    SessionCutoff.updateOne({ userId }, { $set: { at } }, { upsert: true }),
  ]);
  remember(userId, at.getTime());
};

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.get('Authorization');
  if (!header?.startsWith('Bearer ')) return next(new HttpError(401, 'Not signed in'));
  let payload: AccessClaims;
  try {
    payload = verifyAccessToken(header.slice(7));
  } catch {
    return next(new HttpError(401, 'Session expired', 'TOKEN_EXPIRED'));
  }
  const mintedAt = payload.t ?? (payload.iat ?? 0) * 1000;
  Promise.all([cutoffFor(payload.userId), isRevoked(payload.jti)]).then(([cutoff, revoked]) => {
    if (revoked || (cutoff !== null && mintedAt <= cutoff)) return next(new HttpError(401, 'Session expired', 'TOKEN_EXPIRED'));
    req.auth = { userId: payload.userId, familyId: payload.familyId, role: payload.role };
    next();
  }, next);
};

export const requireParent = (req: Request, _res: Response, next: NextFunction) => {
  if (req.auth?.role !== 'parent') return next(new HttpError(403, 'Only grown-ups can do that'));
  next();
};
