// Request hardening for the API, ported from Mentis middlewares/security.ts,
// requestShapeGuard.ts, csrf.ts and the rate limiters in rateLimiter.ts. The global
// pieces are mounted once in app.ts; the per-route limiters are named in the route files.
import crypto from 'crypto';
import type { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import rateLimit, { type Options } from 'express-rate-limit';
import { config } from './config.js';

/* ---------- Headers ---------- */

/**
 * Helmet tuned for a JSON API: it never serves HTML, so the CSP forbids
 * everything, and the API can never be framed.
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: { useDefaults: false, directives: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] } },
  hsts: config.isHosted ? { maxAge: 31_536_000, includeSubDomains: true, preload: true } : false,
  referrerPolicy: { policy: 'no-referrer' },
  crossOriginResourcePolicy: { policy: 'same-site' },
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginEmbedderPolicy: false,
});

/**
 * Headers for the web app's own pages (index.html and its built assets), which the API
 * policy above (default-src 'none') would block. Only our own scripts run; the two
 * outside origins are Google's and Apple's sign-in scripts, used only when configured.
 */
export const webAppHeaders = helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://accounts.google.com/gsi/client', 'https://appleid.cdn-apple.com'],
      // Motion sets inline style attributes; Google's button brings its own stylesheet.
      styleSrc: ["'self'", "'unsafe-inline'", 'https://accounts.google.com/gsi/style'],
      imgSrc: ["'self'", 'data:', 'blob:'],
      fontSrc: ["'self'"],
      connectSrc: ["'self'", 'https://accounts.google.com/gsi/'],
      frameSrc: ['https://accounts.google.com/gsi/', 'https://appleid.apple.com'],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
    },
  },
  hsts: config.isHosted ? { maxAge: 31_536_000, includeSubDomains: true, preload: true } : false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  // Google/Apple sign-in open a popup that must be able to report back.
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  crossOriginEmbedderPolicy: false,
});

/** Responses carry sessions and family data: no browser or proxy may cache them. */
export const noStore = (_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  next();
};

/** Exact-match origin list from config. Unknown origins get no CORS headers at all. */
export const corsOptions = {
  origin: (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) =>
    cb(null, !origin || config.clientOrigins.includes(origin)),
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Client-Platform', 'X-Request-Id', 'X-Requested-With'],
  exposedHeaders: ['X-Request-Id'],
  maxAge: 600,
};

/* ---------- Request ids and logs ---------- */

declare module 'express-serve-static-core' {
  interface Request {
    id: string;
  }
}

const SAFE_ID = /^[A-Za-z0-9._-]{8,64}$/;

/** Every request gets an id, echoed back so a bug report can name the exact request. */
export const requestId = (req: Request, res: Response, next: NextFunction) => {
  const incoming = req.get('X-Request-Id');
  req.id = incoming && SAFE_ID.test(incoming) ? incoming : crypto.randomBytes(9).toString('base64url');
  res.setHeader('X-Request-Id', req.id);
  next();
};

/**
 * A path as it may be logged. Secrets belong in bodies or URL fragments, never in a
 * path, but as a backstop any segment that looks like a token (32+ token characters)
 * is masked, and so is the family code in the public kid picker lookup.
 */
export const loggablePath = (url: string) =>
  url
    .split('?')[0]
    .replace(/\/auth\/family\/[^/]+/, '/auth/family/:code')
    .split('/')
    .map((seg) => (/^[A-Za-z0-9_-]{32,}$/.test(seg) ? ':token' : seg))
    .join('/');

/**
 * One JSON line per request. Only the masked path (never the query string, which can
 * hold tokens), the status, the time, and the user id. Never bodies, headers or emails.
 */
export const requestLog = (req: Request, res: Response, next: NextFunction) => {
  if (!config.logRequests) return next();
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    const line = {
      level: res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info',
      msg: 'request',
      id: req.id,
      method: req.method,
      path: loggablePath(req.originalUrl),
      status: res.statusCode,
      ms: Math.round(ms),
      user: req.auth?.userId,
    };
    console.log(JSON.stringify(line));
  });
  next();
};

/* ---------- Request shape (Mentis requestShapeGuard + mongo sanitize) ---------- */

/** Deepest nesting a body may carry. Real payloads are 3 deep. Checked iteratively so it cannot overflow. */
export const MAX_BODY_DEPTH = 32;

const exceedsDepth = (value: unknown, maxDepth: number) => {
  const stack: { node: unknown; depth: number }[] = [{ node: value, depth: 0 }];
  while (stack.length) {
    const { node, depth } = stack.pop()!;
    if (node === null || typeof node !== 'object') continue;
    if (depth >= maxDepth) return true;
    for (const child of Object.values(node as object)) {
      if (child !== null && typeof child === 'object') stack.push({ node: child, depth: depth + 1 });
    }
  }
  return false;
};

/** Remove `$operator` and dotted keys so no input can become a Mongo operator or path. Mutates in place. */
const stripOperatorKeys = (value: unknown) => {
  const stack = [value];
  while (stack.length) {
    const node = stack.pop();
    if (node === null || typeof node !== 'object' || Buffer.isBuffer(node)) continue;
    for (const key of Object.keys(node as object)) {
      if (key.startsWith('$') || key.includes('.') || key === '__proto__' || key === 'constructor' || key === 'prototype') {
        delete (node as Record<string, unknown>)[key];
      } else {
        stack.push((node as Record<string, unknown>)[key]);
      }
    }
  }
};

/**
 * Refuse hostile shapes before anything walks them: a body nested past the limit,
 * or a query parameter that arrived as an object (`?kidId[$ne]=`). Then strip any
 * operator keys that remain. zod still validates every shape afterwards.
 */
export const requestShapeGuard = (req: Request, res: Response, next: NextFunction) => {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    if (exceedsDepth(req.body, MAX_BODY_DEPTH)) return res.status(400).json({ error: 'Invalid request body', code: 'INVALID_BODY' });
    stripOperatorKeys(req.body);
  }
  for (const value of Object.values(req.query ?? {})) {
    const scalar = typeof value === 'string' || (Array.isArray(value) && value.every((v) => typeof v === 'string'));
    if (value !== undefined && !scalar) return res.status(400).json({ error: 'Invalid query parameters', code: 'INVALID_QUERY' });
  }
  next();
};

/* ---------- CSRF (Mentis middlewares/csrf.ts) ---------- */

/**
 * Endpoints a browser reaches before it has any session, plus provider webhooks
 * (signature-checked inside the handler). Everything else that changes state must
 * prove it came from our own code: an Authorization header, or X-Requested-With,
 * which a cross-site form or `text/plain` fetch cannot set without a CORS preflight
 * our exact-match origin list refuses. Sign out is NOT exempt: it acts on the
 * refresh cookie, which a forged request would carry.
 */
const CSRF_EXEMPT = new Set([
  '/api/auth/signup',
  '/api/auth/join',
  '/api/auth/login',
  '/api/auth/kid-login',
  '/api/auth/refresh',
  '/api/auth/password/forgot',
  '/api/auth/password/reset',
  '/api/auth/password/reset/check',
  '/api/auth/email/verify',
  '/api/auth/invite/check',
  '/api/auth/google',
  '/api/auth/apple',
]);
const CSRF_EXEMPT_PREFIXES = ['/api/billing/webhooks/'];
const STATE_CHANGING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export const csrfGuard = (req: Request, res: Response, next: NextFunction) => {
  if (!STATE_CHANGING.has(req.method)) return next();
  if (CSRF_EXEMPT.has(req.path) || CSRF_EXEMPT_PREFIXES.some((p) => req.path.startsWith(p))) return next();
  if (req.get('Authorization') || req.get('X-Requested-With')) return next();
  console.warn(JSON.stringify({ level: 'warn', msg: 'csrf guard refused a request', id: req.id, method: req.method, path: loggablePath(req.originalUrl) }));
  res.status(403).json({ error: 'Missing required security headers', code: 'CSRF_REFUSED' });
};

/* ---------- Dev-only doors (Mentis routes/auth.ts requireLocalDev) ---------- */

/**
 * Second lock on the demo quick login, behind config.devEndpoints. Only a caller on
 * this machine: the raw socket address, NOT req.ip, which trusts X-Forwarded-For.
 */
export const requireLocalDev = (req: Request, res: Response, next: NextFunction) => {
  const remote = req.socket.remoteAddress ?? '';
  const loopback = remote === '127.0.0.1' || remote === '::1' || remote.startsWith('::ffff:127.');
  if (!config.devEndpoints || !loopback) return res.status(404).json({ error: 'Not found' });
  next();
};

/* ---------- Rate limits ---------- */

/**
 * The client part of every limiter key (Mentis mentisIpKey). IPv4-mapped IPv6 folds
 * to bare IPv4, and IPv6 folds to its /64: one home or phone gets a whole /64, so
 * keying the full address would hand an attacker billions of fresh buckets.
 */
export const ipKey = (ip: string | undefined | null) => {
  if (!ip) return 'unknown';
  const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/i.exec(ip);
  if (mapped) return mapped[1];
  if (/^\d+\.\d+\.\d+\.\d+$/.test(ip)) return ip;
  if (ip.includes(':')) {
    // Expand "::" so the first four hextets are really the first four.
    const [head, tail = ''] = ip.toLowerCase().split('::');
    const left = head ? head.split(':') : [];
    const right = ip.includes('::') ? (tail ? tail.split(':') : []) : [];
    const full = ip.includes('::') ? [...left, ...Array(Math.max(0, 8 - left.length - right.length)).fill('0'), ...right] : left;
    if (full.length >= 4) return `${full.slice(0, 4).map((h) => h.replace(/^0+(?=.)/, '')).join(':')}::/64`;
  }
  return ip;
};

/** Lowercased and trimmed, so `Pat@x.com` and `pat@x.com` share one bucket. */
const bodyField = (req: Request, field: string) => String((req.body as Record<string, unknown> | undefined)?.[field] ?? '').trim().toLowerCase().slice(0, 254);
const userOrIp = (req: Request) => (req.auth?.userId ? `user:${req.auth.userId}` : ipKey(req.ip));

const limiter = (windowMs: number, limit: number, extra: Partial<Options> = {}) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => config.isTest,
    keyGenerator: (req) => ipKey(req.ip),
    message: { error: 'Too many tries. Take a breather and try again in a few minutes.', code: 'RATE_LIMITED' },
    ...extra,
  });

/** Social sign-in and other public auth calls: 30 per 15 minutes per IP. */
export const authLimiter = limiter(15 * 60_000, 30);
/** Signed-in credential changes (change password, sign out everywhere): tight. */
export const strictLimiter = limiter(60 * 60_000, 10);
/** Provider webhooks: generous, but bounded (Mentis uses 120 per minute). */
export const webhookLimiter = limiter(60_000, 120);
/** Every write on the API, per IP. Generous for a busy family, hostile for a script. */
export const writeLimiter = limiter(15 * 60_000, 600, { skip: (req) => config.isTest || req.method === 'GET' || req.method === 'OPTIONS' });

/** New accounts (signup, join by invite): 5 per hour per IP. */
export const signupLimiter = limiter(60 * 60_000, 5);
/** Grown-up login, per IP + email, failures only (Mentis loginLimiter). */
export const loginLimiter = limiter(15 * 60_000, 10, { skipSuccessfulRequests: true, keyGenerator: (req) => `${ipKey(req.ip)}|${bodyField(req, 'email')}` });
/** Grown-up login, per email from anywhere, failures only: stops a proxy farm guessing one account (Mentis loginEmailOnlyLimiter). */
export const loginEmailLimiter = limiter(60 * 60_000, 20, { skipSuccessfulRequests: true, keyGenerator: (req) => `email:${bodyField(req, 'email')}` });
/** Kid PIN tries per kid, from anywhere, failures only. The account lockout in accounts.ts is the hard stop. */
export const kidPinLimiter = limiter(15 * 60_000, 10, { skipSuccessfulRequests: true, keyGenerator: (req) => `kid:${bodyField(req, 'kidId')}` });
/** Kid PIN tries across one family, failures only, so guessing every sibling in turn is bounded too. */
export const familyPinLimiter = limiter(15 * 60_000, 30, { skipSuccessfulRequests: true, keyGenerator: (req) => `family:${bodyField(req, 'code')}` });
/** Session refresh: failures only, so busy tabs never trip it. */
export const refreshLimiter = limiter(15 * 60_000, 100, { skipSuccessfulRequests: true });
/** Password reset emails: per IP across all emails, then per IP + email (Mentis passwordResetIpLimiter + passwordResetLimiter). */
export const resetRequestIpLimiter = limiter(60 * 60_000, 10);
export const resetRequestLimiter = limiter(60 * 60_000, 3, { keyGenerator: (req) => `${ipKey(req.ip)}|${bodyField(req, 'email')}` });
/** Using a reset link: failures only. */
export const resetExecuteLimiter = limiter(60 * 60_000, 10, { skipSuccessfulRequests: true });
/** Checking a link (reset, email verification, invite): counts every call, since a miss still answers 200. */
export const linkCheckLimiter = limiter(60 * 60_000, 30);
/** Resending the verification email: per signed-in grown-up. */
export const resendVerificationLimiter = limiter(60 * 60_000, 5, { keyGenerator: userOrIp });
/** Making invite links and changing the family code: per signed-in grown-up. */
export const familyAccessLimiter = limiter(60 * 60_000, 20, { keyGenerator: userOrIp });

/** Downloading the family's data: a few times a day per grown-up (Mentis: 1 per day). */
export const dataExportLimiter = limiter(24 * 60 * 60_000, 3, { keyGenerator: userOrIp });
/** Deleting an account re-checks the password, so it is also a password guess: keep it tight. */
export const accountDeleteLimiter = limiter(60 * 60_000, 5, { keyGenerator: userOrIp });
