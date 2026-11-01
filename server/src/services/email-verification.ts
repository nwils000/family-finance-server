// Proving a grown-up owns their email (ported from Mentis verifyEmail /
// resendVerificationEmail). Same shape as the password reset link: a hashed,
// single-use token, carried in the URL fragment, consumed with findOneAndDelete.
//
// What an unverified grown-up may do: sign in, set up quests, the shop and settings,
// change their password, change the family code. What waits for a verified email
// (assertEmailVerified): adding a kid and inviting another grown-up, because both
// bring new people's data in, and COPPA wants the parent's verified contact first.
import { PRIVATE_PREVIEW_MESSAGE } from '@kk/shared';
import type { AuthedUser } from '../auth.js';
import { config } from '../config.js';
import { HttpError } from '../http.js';
import { User } from '../models.js';
import { EmailVerificationToken } from '../models-account.js';
import { appLink, newToken, sha256 } from '../tokens.js';
import { sendMail } from './mailer.js';

const VERIFY_TTL_MS = 24 * 60 * 60_000;
/** A second request inside this window keeps the link already sent. */
const RESEND_COOLDOWN_MS = 60_000;

const sendLink = async (userId: unknown, email: string) => {
  const recent = await EmailVerificationToken.exists({ userId, createdAt: { $gt: new Date(Date.now() - RESEND_COOLDOWN_MS) } });
  if (recent) return;
  await EmailVerificationToken.deleteMany({ userId });
  const token = newToken();
  const row = await EmailVerificationToken.create({ userId, email, tokenHash: sha256(token), expiresAt: new Date(Date.now() + VERIFY_TTL_MS) });
  try {
    await sendMail({
      to: email,
      subject: 'Confirm your email for Kid Kapital',
      text: `Welcome to Kid Kapital!\n\nTap this link to confirm this is your email (it works once, for 24 hours):\n${appLink('/verify-email', 'token', token)}\n\nYou can add your kids as soon as it is confirmed. If you did not sign up, ignore this email.`,
    });
  } catch (err) {
    await EmailVerificationToken.deleteOne({ _id: row._id });
    throw err;
  }
};

/**
 * COPPA stopgap. In the preview without email, grown-ups count as verified without proving
 * anything, so there is no parental consent step. Until consent is built, no kid's data may
 * come in except for the allow-listed grown-ups (config.previewAllowedEmails). Called before
 * every kid creation (family.ts addKid, the only path that makes a kid).
 */
export const assertKidCreationOpen = async (actor: AuthedUser) => {
  if (!config.previewWithoutEmail) return;
  const user = await User.findById(actor.userId).select('email');
  if (user?.email && config.previewAllowedEmails.includes(user.email.toLowerCase())) return;
  throw new HttpError(403, PRIVATE_PREVIEW_MESSAGE, 'PRIVATE_PREVIEW');
};

/** Send the link after the response, so signup never waits on (or fails with) the mail server. */
export const sendVerificationLink = (user: { _id: unknown; email?: string | null }) => {
  if (!user.email) return;
  const email = user.email;
  setImmediate(() => {
    sendLink(user._id, email).catch((err) =>
      console.error(JSON.stringify({ level: 'error', msg: 'verification email failed', error: String((err as Error)?.message ?? err) })),
    );
  });
};

/**
 * Whether a new grown-up account starts verified: Google or Apple verified the email,
 * or this is a staging preview without email (config.previewWithoutEmail).
 */
export const startsVerified = (providerVerified: boolean | undefined) => !!providerVerified || config.previewWithoutEmail;

const INVALID = 'That link has expired or was already used. Sign in and ask for a new one.';

/** Works signed out too: the link may be opened on another device. */
export const verifyEmail = async (token: string) => {
  const row = await EmailVerificationToken.findOneAndDelete({ tokenHash: sha256(token), expiresAt: { $gt: new Date() } });
  if (!row) throw new HttpError(400, INVALID, 'VERIFY_INVALID');
  // Only the address the link was sent to; a changed email needs its own link.
  const updated = await User.updateOne({ _id: row.userId, email: row.email }, { $set: { emailVerifiedAt: new Date() } });
  if (!updated.matchedCount) throw new HttpError(400, INVALID, 'VERIFY_INVALID');
  return { ok: true };
};

export const resendVerification = async (actor: AuthedUser) => {
  const user = await User.findById(actor.userId).select('email emailVerifiedAt');
  if (!user?.email) throw new HttpError(400, 'This account has no email');
  if (!user.emailVerifiedAt) await sendLink(user._id, user.email);
  return { ok: true, alreadyVerified: !!user.emailVerifiedAt };
};

/** The one gate for actions that need a verified grown-up. Kids never reach these (requireParent). */
export const assertEmailVerified = async (actor: AuthedUser) => {
  const user = await User.findById(actor.userId).select('emailVerifiedAt').lean();
  if (!user?.emailVerifiedAt) throw new HttpError(403, 'Confirm your email first. Check your inbox for our link, or send a new one from Settings.', 'EMAIL_UNVERIFIED');
};
