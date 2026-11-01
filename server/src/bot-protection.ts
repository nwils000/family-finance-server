// Bot protection, ported from Mentis middlewares/botProtection.ts and formGuard.ts.
// Three layers, all keyed by ipKey() (an IPv6 /64 counts as one address):
//
//   botProtection      banned addresses, honeypot paths, scanner and empty user agents
//   watchFailedSignIns wrong passwords and PINs from one address feed the ban ladder
//   formGuard          hidden fields and fill signals on the public sign-in forms
//
// The counters, scores and bans live in MongoDB through services/abuse.ts, so every
// Vercel instance sees the same ones, and every step fails open.
//
// No CAPTCHA: it would load a third-party script into a kids' app. If one is ever
// needed, it belongs in formGuard below, as one more signal checked before `respond`.
import type { ErrorRequestHandler, NextFunction, Request, RequestHandler, Response } from 'express';
import { FORM_MIN_FILL_MS, FORM_SIGNALS_KEY, HONEYPOT_FIELDS, MAX_PLAUSIBLE_FILL_MS, type ClientFormSignals, type FormGuardSurface } from '@kk/shared';
import { decoySession } from './auth.js';
import { config } from './config.js';
import { HttpError, parse } from './http.js';
import { ipKey, loggablePath, protection } from './security.js';
import * as S from './schemas.js';
import { forgotBody } from './schemas-account.js';
import { decoyKidLogin, decoyLogin, decoyParent } from './services/accounts.js';
import { RESET_REQUESTED } from './services/account-security.js';
import { isBanned, recordBotSignal, recordFailedSignIn, type BotSignalKind } from './services/abuse.js';

const warn = (msg: string, req: Request, extra: Record<string, unknown> = {}) =>
  console.warn(JSON.stringify({ level: 'warn', msg, id: req.id, ip: ipKey(req.ip), path: loggablePath(req.originalUrl), ...extra }));

/** A refusal that says nothing about why. */
const deny = (res: Response) => res.status(403).json({ error: 'Access denied' });

/* ---------- Requests: bans, honeypot paths, user agents ---------- */

/**
 * Attack tools. A hit scores against the address, so a scanner's run ends in a ban.
 * Like every user-agent list this is a NOISE FILTER, not security (Mentis audit M8):
 * anyone can send a browser's user agent. It keeps the logs readable and the cheap
 * scanners out.
 */
const SCANNER_AGENTS = [
  /nikto/i, /sqlmap/i, /nmap/i, /masscan/i, /nessus/i, /openvas/i, /acunetix/i, /burpsuite/i, /w3af/i, /arachni/i,
  /skipfish/i, /wpscan/i, /dirbuster/i, /gobuster/i, /ffuf/i, /nuclei/i, /\bzap\b/i, /havij/i, /appscan/i, /webinspect/i,
  /metasploit/i, /cobalt\s*strike/i, /hydra/i, /medusa/i, /hashcat/i,
];

/**
 * Generic HTTP clients and bulk scrapers: refused on the API, but not scored, since a
 * person poking at the API with curl is not an attack. The app is a browser or a
 * Capacitor web view, which never sends these.
 */
const BLOCKED_AGENTS = [
  /curl\/\d/i, /wget\//i, /python-requests/i, /python-urllib/i, /aiohttp/i, /go-http-client/i, /java\//i, /libwww-perl/i,
  /lwp-trivial/i, /php\//i, /scrapy/i, /mj12bot/i, /ahrefsbot/i, /semrushbot/i, /dotbot/i, /blexbot/i, /megaindex/i,
  /petalbot/i, /bytespider/i,
];

/**
 * Callers that are not browsers and prove themselves another way, so their user agent
 * is never judged: Vercel Cron (it proves itself with its secret).
 */
const AGENT_EXEMPT_PREFIXES = ['/api/cron/'];

/**
 * Paths no person and no part of this app ever asks for. Matched as a prefix of the
 * lowercased path, so each entry must never be the start of a real page or API route
 * (the app's pages are /, /login, /kid..., /parent..., /privacy, /terms, /assets/...).
 * A hit answers 404 and scores against the address; three probes ban it.
 */
const HONEYPOT_PATHS = [
  '/wp-admin', '/wp-login', '/wp-content', '/wp-includes', '/wp-json', '/wordpress', '/xmlrpc.php',
  '/.env', '/.git', '/.svn', '/.hg', '/.aws', '/.docker', '/.ssh', '/.npmrc', '/.htpasswd', '/.ds_store',
  '/config.php', '/configuration.php', '/settings.py', '/id_rsa',
  '/admin.php', '/administrator', '/phpmyadmin', '/pma', '/adminer', '/phpinfo', '/cpanel', '/webmail',
  '/cgi-bin', '/shell', '/actuator', '/debug/pprof', '/server-status', '/server-info', '/telescope', '/_profiler',
  '/solr', '/jenkins', '/vendor/', '/node_modules', '/composer.json', '/composer.lock',
  '/backup', '/db.sql', '/dump.sql', '/database.sql', '/www.zip', '/latest/meta-data',
];
export const isHoneypotPath = (path: string) => {
  const lower = path.toLowerCase();
  return HONEYPOT_PATHS.some((p) => lower.startsWith(p));
};

/**
 * Mounted first in app.ts (after the request id and log), before the web app's
 * pages, so a banned address is refused everywhere. Bans and agent checks are live
 * only where `protection.bans` is (hosted servers); honeypot paths always answer 404.
 */
export const botProtection: RequestHandler = (req, res, next) => {
  const run = async () => {
    const ip = ipKey(req.ip);
    const path = req.path;
    if (protection.bans && (await isBanned(ip))) {
      warn('banned address refused', req);
      return deny(res);
    }
    if (isHoneypotPath(path)) {
      if (protection.bans) await recordBotSignal(ip, 'honeypotPath', loggablePath(path));
      return res.status(404).json({ error: 'Not found' });
    }
    if (path.includes('..') || /%2e%2e|%252e/i.test(req.originalUrl)) {
      if (protection.bans) await recordBotSignal(ip, 'pathTraversal');
      return res.status(400).json({ error: 'That request could not be read', code: 'BAD_REQUEST' });
    }
    if (protection.bans && path.startsWith('/api/') && !AGENT_EXEMPT_PREFIXES.some((p) => path.startsWith(p))) {
      const agent = req.get('User-Agent')?.trim() ?? '';
      if (!agent) return deny(res);
      if (SCANNER_AGENTS.some((re) => re.test(agent))) {
        await recordBotSignal(ip, 'scannerAgent', agent);
        return deny(res);
      }
      if (BLOCKED_AGENTS.some((re) => re.test(agent))) return deny(res);
    }
    next();
  };
  // Fail open: a bug or outage here must never turn a request into a 500.
  run().catch((err) => {
    warn('bot protection failed, allowing', req, { error: (err as Error)?.message });
    if (!res.headersSent) next();
  });
};

/* ---------- Failed sign-ins (Mentis recordFailedAuth) ---------- */

/** Where a 401 means someone typed a wrong password, PIN or sign-in token. */
const CREDENTIAL_PATHS = new Set(['/api/auth/login', '/api/auth/kid-login', '/api/auth/google', '/api/auth/apple', '/api/auth/password/change', '/api/account/delete']);

/**
 * An error handler mounted just before errorHandler in app.ts: a 401 from a
 * credential endpoint counts against the address before the reply goes out (counted
 * after the reply, a Vercel function may already be frozen). The refresh endpoint is
 * deliberately not here: an expired session 401s in bulk and is no one guessing.
 */
export const watchFailedSignIns: ErrorRequestHandler = (err, req, _res, next) => {
  if (!protection.bans || !(err instanceof HttpError) || err.status !== 401 || !CREDENTIAL_PATHS.has(req.path)) return next(err);
  recordFailedSignIn(ipKey(req.ip)).then(() => next(err), () => next(err));
};

/* ---------- Public forms (Mentis formGuard) ---------- */

/**
 * How each guarded form answers a caught submission: its NORMAL reply, never "bot
 * detected", which would be free tuning feedback. Each still runs the endpoint's own
 * input checks first (a malformed body gets the real 400) and spends the same
 * password-hashing cost, so neither the shape nor the timing gives the trap away.
 */
const RESPOND: Record<FormGuardSurface, (req: Request, res: Response) => Promise<unknown>> = {
  signup: async (req, res) => decoySession(req, res, await decoyParent(parse(S.signupBody, req.body))),
  join: async (req, res) => {
    const body = parse(S.joinBody, req.body);
    return decoySession(req, res, await decoyParent(body, body.invite));
  },
  login: (req) => decoyLogin(parse(S.loginBody, req.body)),
  kidLogin: (req) => decoyKidLogin(parse(S.kidLoginBody, req.body)),
  passwordReset: async (req) => {
    parse(forgotBody, req.body);
    return RESET_REQUESTED;
  },
};

/** Read the client's signals without trusting them: anything malformed is dropped, never punished. */
const readSignals = (body: Record<string, unknown>): ClientFormSignals => {
  const raw = body[FORM_SIGNALS_KEY];
  if (!raw || typeof raw !== 'object') return {};
  const { elapsedMs, interacted } = raw as Record<string, unknown>;
  return {
    elapsedMs: typeof elapsedMs === 'number' && Number.isFinite(elapsedMs) && elapsedMs >= 0 && elapsedMs <= MAX_PLAUSIBLE_FILL_MS ? elapsedMs : undefined,
    interacted: typeof interacted === 'boolean' ? interacted : undefined,
  };
};

/**
 * Guard one public form. Mount after its rate limiters, before the handler:
 *
 *   - a hidden honeypot field arriving non-blank drops the submission on its own;
 *   - too fast AND no pointer, key or touch at all drops it; either alone only scores;
 *   - NO signals at all (an old app build) passes exactly like a clean submission.
 *
 * The signals and honeypot keys are removed from the body before the handler runs.
 */
export const formGuard =
  (surface: FormGuardSurface): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, unknown>;
    const signals = readSignals(body);
    const tripped = HONEYPOT_FIELDS.filter((f) => typeof body[f] === 'string' && (body[f] as string).trim().length > 0);
    for (const key of [FORM_SIGNALS_KEY, ...HONEYPOT_FIELDS]) delete body[key];

    const tooFast = signals.elapsedMs !== undefined && signals.elapsedMs < FORM_MIN_FILL_MS[surface];
    const noInteraction = signals.interacted === false;
    const kinds: BotSignalKind[] = [];
    if (tripped.length) kinds.push('honeypotField');
    if (tooFast && noInteraction) kinds.push('timingAndInteraction');
    else if (noInteraction) kinds.push('noInteraction');
    else if (tooFast) kinds.push('tooFast');
    if (!kinds.length) return next();

    const drop = tripped.length > 0 || (tooFast && noInteraction);
    const run = async () => {
      if (protection.bans) for (const kind of kinds) await recordBotSignal(ipKey(req.ip), kind, surface);
      if (!drop) return next();
      warn(config.formGuardMonitor ? 'form guard would drop (monitor mode)' : 'form guard dropped a submission', req, { surface, kinds, elapsedMs: signals.elapsedMs });
      if (config.formGuardMonitor) return next();
      const reply = await RESPOND[surface](req, res);
      if (!res.headersSent) res.json(reply);
    };
    // Decoy errors (the real 400, 401, 404 or 409) go to the error handler like the real path's.
    run().catch(next);
  };
