import 'dotenv/config';

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var ${name}`);
  return value;
};
/** Optional settings: an empty string counts as missing, so the feature stays off. */
const optional = (name: string): string | undefined => process.env[name]?.trim() || undefined;

/**
 * Where this process runs. Only the four names below are known; anything else
 * (a typo, an unset NODE_ENV on a fresh host) counts as HOSTED, so a misnamed
 * environment gets the strict settings, never the relaxed local ones. `npm run dev`
 * sets NODE_ENV=development explicitly (server/package.json).
 */
const APP_ENVS = ['production', 'staging', 'development', 'test'] as const;
export type AppEnv = (typeof APP_ENVS)[number] | 'unknown';
const appEnv: AppEnv = (APP_ENVS as readonly string[]).includes(process.env.NODE_ENV ?? '') ? (process.env.NODE_ENV as AppEnv) : 'unknown';
const isLocal = appEnv === 'development' || appEnv === 'test';
/** Reachable from the internet: secure cookies, HSTS, strong secrets, no dev doors. */
const isHosted = !isLocal;

/**
 * Refuse to boot on a hosted environment with a guessable signing key (Mentis does
 * the same in config/secrets). Anyone who knows JWT_SECRET can mint a session for any user.
 */
const WEAK_SECRETS = new Set(['change-me-to-a-long-random-string', 'secret', 'changeme', 'dev', 'test']);
const jwtSecret = required('JWT_SECRET');
if (isHosted && (jwtSecret.length < 32 || WEAK_SECRETS.has(jwtSecret))) {
  throw new Error(`JWT_SECRET is missing or too weak for ${appEnv}. Use at least 32 random characters.`);
}

const clientOrigins = (process.env.CLIENT_ORIGINS ?? 'http://localhost:5173').split(',').map((s) => s.trim()).filter(Boolean);
if (isHosted && clientOrigins.includes('*')) throw new Error(`CLIENT_ORIGINS may not be * in ${appEnv}`);
// Grown-ups must confirm their email before adding a kid (COPPA), and password resets and
// invites are emailed. A hosted server that cannot send mail would sign people up into a
// dead end, so it refuses to start instead.
// The one exception is a STAGING preview with PREVIEW_WITHOUT_EMAIL=true (Mentis
// AUTO_VERIFY_EMAIL): new grown-ups count as verified and no mail is sent, so a test
// deploy works before a mail domain exists. Production can never turn it on.
if (process.env.PREVIEW_WITHOUT_EMAIL === 'true' && appEnv !== 'staging') throw new Error(`PREVIEW_WITHOUT_EMAIL is only allowed in staging, not ${appEnv}`);
const previewWithoutEmail = appEnv === 'staging' && process.env.PREVIEW_WITHOUT_EMAIL === 'true';
if (isHosted && !previewWithoutEmail && !optional('SMTP_URL')) throw new Error(`SMTP_URL is required in ${appEnv}: sign-up, password reset and invites send email.`);

export const config = {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://127.0.0.1:27017/kid-kapital',
  jwtSecret,
  port: Number(process.env.PORT ?? 8787),
  clientOrigins,
  /** Where links in emails and Stripe redirects point. Defaults to the first client origin. */
  appUrl: (optional('APP_URL') ?? clientOrigins[0] ?? 'http://localhost:5173').replace(/\/$/, ''),
  appEnv,
  /** Drives cookie flags, HSTS and secret checks. True for production, staging and any unknown name. */
  isHosted,
  isTest: appEnv === 'test',
  /**
   * The demo-family quick login (routes.ts). Needs local development AND an explicit
   * opt-in (`npm run dev` sets ENABLE_DEV_ENDPOINTS=true), plus a loopback caller
   * (security.ts requireLocalDev). A staging box with NODE_ENV=development stays shut.
   */
  devEndpoints: appEnv === 'development' && process.env.ENABLE_DEV_ENDPOINTS === 'true',
  accessTokenTtl: '15m',
  refreshTokenDays: 30,

  /** Outgoing mail. Without SMTP_URL, dev logs the message to the console instead. */
  mail: { smtpUrl: optional('SMTP_URL'), from: optional('MAIL_FROM') ?? 'Kid Kapital <hello@kidkapital.app>' },

  /** Social sign-in for grown-ups. Each provider is off until its ids are set. */
  google: {
    // The web client id is also what the client's Google button uses.
    webClientId: optional('GOOGLE_CLIENT_ID'),
    audiences: [optional('GOOGLE_CLIENT_ID'), optional('GOOGLE_IOS_CLIENT_ID'), optional('GOOGLE_ANDROID_CLIENT_ID')].filter(Boolean) as string[],
  },
  apple: {
    // Native iOS tokens carry the bundle id; web tokens carry the Services ID.
    bundleId: optional('APPLE_CLIENT_ID'),
    servicesId: optional('APPLE_SERVICES_ID'),
    webRedirectUri: optional('APPLE_WEB_REDIRECT_URI'),
    get audiences() {
      return [this.bundleId, this.servicesId].filter(Boolean) as string[];
    },
  },

  /** See the SMTP check above: a staging preview where grown-ups start verified and no mail goes out. */
  previewWithoutEmail,
  /**
   * In that preview there is no parental consent step, so only these grown-ups may add a kid
   * (email-verification.ts assertKidCreationOpen). Comma-separated, case-insensitive.
   */
  previewAllowedEmails: (process.env.PREVIEW_ALLOWED_EMAILS ?? '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean),
  /** Running as a Vercel function: no long-lived process for interval jobs, a smaller pool. */
  serverless: !!process.env.VERCEL,
  /** Vercel Cron sends it as a bearer token to the scheduled-job door (app.ts). Unset: the door is not mounted. */
  cronSecret: optional('CRON_SECRET'),
  logRequests: optional('LOG_REQUESTS') !== 'false' && appEnv !== 'test',
  /**
   * FORM_GUARD_MODE=monitor keeps every form-guard detection and log line but drops
   * nothing (Mentis): the safe way to watch real traffic before trusting the thresholds.
   */
  formGuardMonitor: optional('FORM_GUARD_MODE') === 'monitor',
  /** Built web app to serve from this origin (the production container sets it). Unset in dev: Vite serves it. */
  serveClientDir: optional('SERVE_CLIENT_DIR'),
};
