// Google and Apple sign-in for grown-ups. Token checks are ported from Mentis
// authController verifyGoogleIdToken and services/oauthService.ts verifyAppleToken.
// Kids never use these: they keep the family code + PIN.
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import type { z } from 'zod';
import { revokeAllSessions } from '../auth.js';
import { config } from '../config.js';
import { HttpError } from '../http.js';
import { User } from '../models.js';
import { AppleNonce, SocialIdentity } from '../models-account.js';
import type { appleBody, googleBody } from '../schemas-account.js';
import { joinWithInvite, startFamily } from './accounts.js';

type Provider = 'google' | 'apple';
interface VerifiedIdentity {
  provider: Provider;
  subject: string;
  email: string;
  emailVerified: boolean;
  name: string;
}

const OUTBOUND_TIMEOUT_MS = 8000;
const notConfigured = (what: string) => new HttpError(501, `${what} sign-in is not set up on this server`, 'NOT_CONFIGURED');
const badToken = () => new HttpError(401, 'We could not verify that sign-in. Try again.', 'SOCIAL_INVALID');
const warn = (msg: string, extra: object = {}) => console.warn(JSON.stringify({ level: 'warn', msg, ...extra }));

/** What the client may show. Ids here are public client ids, never secrets. */
export const socialProviders = () => ({
  google: config.google.webClientId ? { clientId: config.google.webClientId } : null,
  apple: config.apple.servicesId ? { clientId: config.apple.servicesId, redirectUri: config.apple.webRedirectUri ?? `${config.appUrl}/login` } : null,
  appleNative: !!config.apple.bundleId,
});

/* ---------- Google ---------- */

let googleClient: OAuth2Client | null = null;

/** Verify a Google ID token with a deadline: the library has no timeout knob of its own. */
const verifyGoogle = async (idToken: string): Promise<VerifiedIdentity> => {
  if (!config.google.audiences.length) throw notConfigured('Google');
  googleClient ??= new OAuth2Client();
  let timer: NodeJS.Timeout | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Google token verification timed out')), OUTBOUND_TIMEOUT_MS);
  });
  try {
    const ticket = await Promise.race([googleClient.verifyIdToken({ idToken, audience: config.google.audiences }), deadline]);
    const p = ticket.getPayload();
    if (!p?.sub || !p.email) throw badToken();
    return { provider: 'google', subject: p.sub, email: p.email.toLowerCase(), emailVerified: p.email_verified === true, name: p.given_name || p.name || p.email.split('@')[0] };
  } catch (err) {
    if (err instanceof HttpError) throw err;
    warn('google token verification failed', { error: (err as Error).message });
    throw badToken();
  } finally {
    clearTimeout(timer);
  }
};

/* ---------- Apple ---------- */

const APPLE_ISSUER = 'https://appleid.apple.com';
const APPLE_JWKS_URL = 'https://appleid.apple.com/auth/keys';
const NONCE_TTL_MS = 10 * 60_000;
let appleKeys: { kid: string }[] | null = null;
let appleKeysExpiry = 0;

/** Apple's signing keys, cached for a day, with stale keys as a fallback if Apple is slow. */
const applePublicKey = async (kid: string) => {
  if (!appleKeys || Date.now() > appleKeysExpiry) {
    try {
      const res = await fetch(APPLE_JWKS_URL, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        appleKeys = ((await res.json()) as { keys: { kid: string }[] }).keys;
        appleKeysExpiry = Date.now() + 86_400_000;
      }
    } catch (err) {
      warn('apple jwks fetch failed', { error: (err as Error).message });
    }
  }
  const jwk = appleKeys?.find((k) => k.kid === kid);
  return jwk ? crypto.createPublicKey({ key: jwk as crypto.JsonWebKey, format: 'jwk' }).export({ type: 'spki', format: 'pem' }).toString() : null;
};

/** Step 1 of Apple sign-in: a single-use nonce whose SHA-256 the client hands to Apple. */
export const issueAppleNonce = async () => {
  if (!config.apple.audiences.length) throw notConfigured('Apple');
  const nonce = crypto.randomBytes(32).toString('hex');
  await AppleNonce.create({ nonce, expiresAt: new Date(Date.now() + NONCE_TTL_MS) });
  return { nonce };
};

const verifyApple = async (identityToken: string, rawNonce: string): Promise<VerifiedIdentity> => {
  if (!config.apple.audiences.length) throw notConfigured('Apple');
  const decoded = jwt.decode(identityToken, { complete: true });
  const kid = decoded?.header?.kid;
  const key = kid ? await applePublicKey(kid) : null;
  if (!key) throw badToken();
  let p: jwt.JwtPayload;
  try {
    const aud = config.apple.audiences as [string, ...string[]];
    p = jwt.verify(identityToken, key, { issuer: APPLE_ISSUER, audience: aud, algorithms: ['RS256'] }) as jwt.JwtPayload;
  } catch (err) {
    warn('apple token verification failed', { error: (err as Error).message });
    throw badToken();
  }
  // jwt.verify does not require claims to exist; Apple always sends both.
  if (typeof p.sub !== 'string' || typeof p.email !== 'string') throw badToken();
  // Apple puts SHA-256(nonce) in the token, hex or base64url. It must match AND be one we issued and have not used.
  const expected = crypto.createHash('sha256').update(rawNonce).digest();
  const got = typeof p.nonce === 'string' ? p.nonce : '';
  if (got !== expected.toString('hex') && got.replace(/=+$/, '') !== expected.toString('base64url')) throw badToken();
  if (!(await AppleNonce.findOneAndDelete({ nonce: rawNonce, expiresAt: { $gt: new Date() } }))) throw badToken();
  return { provider: 'apple', subject: p.sub, email: p.email.toLowerCase(), emailVerified: p.email_verified === true || p.email_verified === 'true', name: p.email.split('@')[0] };
};

/* ---------- Find or create the grown-up ---------- */

/**
 * The provider's `sub` is the key (an email can be reassigned in Google Workspace).
 * An existing email account is linked only when the provider verified the email,
 * or anyone controlling a look-alike provider account could take it over (Mentis
 * Run 6 linking gate). A brand new account needs a verified email too, so nobody
 * can claim an address they do not own.
 *
 * Pre-registration hijack: someone could sign up with a victim's email and a
 * password of their own, then wait for the victim to arrive with Google. If that
 * existing account never proved the mailbox, its password (and every session it
 * opened) is the squatter's, so both are dropped before the provider is linked.
 */
const signInWith = async (id: VerifiedIdentity, extras: { invite?: string; familyName?: string; name?: string; acceptLegal?: boolean }) => {
  const linked = await SocialIdentity.findOne({ provider: id.provider, subject: id.subject });
  if (linked) {
    const user = await User.findById(linked.userId);
    if (user) return user;
    await linked.deleteOne();
  }
  if (!id.emailVerified) throw new HttpError(401, 'Your email is not verified with that account yet', 'EMAIL_UNVERIFIED');

  const name = (extras.name ?? id.name).slice(0, 40) || 'Grown-up';
  let user = await User.findOne({ email: id.email });
  if (user && user.role !== 'parent') throw badToken();
  if (user && !user.emailVerifiedAt) {
    await User.updateOne({ _id: user._id }, { $unset: { passwordHash: 1 }, $set: { emailVerifiedAt: new Date() } });
    await revokeAllSessions(String(user._id));
    warn('social sign-in took over an unverified password account', { userId: String(user._id), provider: id.provider });
    user = await User.findById(user._id);
  }
  if (!user) {
    const parent = { name, email: id.email, emailVerified: true, acceptLegal: extras.acceptLegal };
    try {
      user = extras.invite
        ? await joinWithInvite(extras.invite, parent)
        : await startFamily(extras.familyName ?? `${name}'s family`.slice(0, 60), parent);
    } catch (err) {
      // Two taps at once: the other request created the account first.
      if ((err as HttpError).status !== 409) throw err;
      user = await User.findOne({ email: id.email, role: 'parent' });
      if (!user) throw err;
    }
  }
  await SocialIdentity.updateOne(
    { provider: id.provider, subject: id.subject },
    { $setOnInsert: { userId: user._id } },
    { upsert: true },
  );
  return user;
};

export const googleSignIn = async (body: z.infer<typeof googleBody>) => signInWith(await verifyGoogle(body.idToken), body);
export const appleSignIn = async (body: z.infer<typeof appleBody>) => signInWith(await verifyApple(body.identityToken, body.nonce), body);
