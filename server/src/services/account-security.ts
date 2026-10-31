// Grown-up account security: forgot / reset password, change password, and
// signing out everywhere. Ported from Mentis authController requestPasswordReset,
// resetPassword, validateResetToken, changePassword and logoutAllDevices.
import type { z } from 'zod';
import { revokeAllSessions, type AuthedUser } from '../auth.js';
import { HttpError } from '../http.js';
import { User } from '../models.js';
import { PasswordResetToken } from '../models-account.js';
import type { changePasswordBody, forgotBody, resetBody } from '../schemas-account.js';
import { appLink, newToken, sha256 } from '../tokens.js';
import { checkSecret, getUser, hashPassword } from './accounts.js';
import { sendMail } from './mailer.js';

const RESET_TTL_MS = 60 * 60_000;
/** A second request inside this window keeps the link already sent instead of killing it. */
const RESET_COOLDOWN_MS = 60_000;

const INVALID_LINK = 'That reset link has expired or was already used. Ask for a new one.';

/** Create the token and send the email. Runs after the response, see requestPasswordReset. */
const sendResetLink = async (userId: unknown, email: string) => {
  const recent = await PasswordResetToken.exists({ userId, used: false, createdAt: { $gt: new Date(Date.now() - RESET_COOLDOWN_MS) } });
  if (recent) return;
  await PasswordResetToken.deleteMany({ userId });
  const token = newToken();
  const row = await PasswordResetToken.create({ userId, tokenHash: sha256(token), expiresAt: new Date(Date.now() + RESET_TTL_MS) });
  const link = appLink('/reset-password', 'token', token);
  try {
    await sendMail({
      to: email,
      subject: 'Reset your Kid Kapital password',
      text: `Someone asked to reset the password for this Kid Kapital account.\n\nPick a new password here (the link works once, for 1 hour):\n${link}\n\nIf it was not you, ignore this email. Your password stays the same.`,
    });
  } catch (err) {
    await PasswordResetToken.deleteOne({ _id: row._id });
    throw err;
  }
};

/**
 * Always answers the same way, and only after one indexed lookup, so neither the
 * reply nor its timing says whether the email has an account (Mentis B1 timing fix).
 */
export const requestPasswordReset = async ({ email }: z.infer<typeof forgotBody>) => {
  const user = await User.findOne({ email, role: 'parent' }).select('_id email');
  if (user) {
    setImmediate(() => {
      sendResetLink(user._id, user.email!).catch((err) =>
        console.error(JSON.stringify({ level: 'error', msg: 'password reset email failed', error: String(err?.message ?? err) })),
      );
    });
  }
  return { ok: true };
};

const findLiveToken = (token: string) => PasswordResetToken.findOne({ tokenHash: sha256(token), used: false, expiresAt: { $gt: new Date() } });

/** Non-consuming check so the page can show "expired" before anyone types a password. */
export const checkResetToken = async (token: string) => ({ valid: /^[a-f0-9]{64}$/.test(token) && !!(await findLiveToken(token)) });

export const resetPassword = async ({ token, password }: z.infer<typeof resetBody>) => {
  const row = await findLiveToken(token);
  if (!row) throw new HttpError(400, INVALID_LINK, 'RESET_INVALID');
  // Hash before the claim: the slow step should not sit inside the claimed window.
  const passwordHash = await hashPassword(password);
  const claimed = await PasswordResetToken.findOneAndUpdate({ _id: row._id, used: false }, { used: true });
  if (!claimed) throw new HttpError(400, INVALID_LINK, 'RESET_INVALID');
  try {
    // Proving the mailbox also clears any lockout (or the new password would be refused
    // too) and verifies the email, since the link could only be read there.
    // $literal: a bcrypt hash starts with "$", which a pipeline would read as a field path.
    const updated = await User.updateOne({ _id: row.userId, role: 'parent' }, [
      {
        $set: {
          passwordHash: { $literal: passwordHash },
          failedLogins: 0,
          lockedUntil: null,
          emailVerifiedAt: { $ifNull: ['$emailVerifiedAt', new Date()] },
        },
      },
    ]);
    if (!updated.matchedCount) throw new HttpError(400, INVALID_LINK, 'RESET_INVALID');
  } catch (err) {
    // The credential did not change, so give the link back.
    await PasswordResetToken.updateOne({ _id: row._id }, { used: false }).catch(() => undefined);
    throw err;
  }
  await PasswordResetToken.deleteMany({ userId: row.userId });
  await revokeAllSessions(String(row.userId));
};

/**
 * Change a signed-in grown-up's password. Everyone else holding a session is
 * signed out; the route starts a fresh session for this device. An account made
 * with Google or Apple has no password to prove, and a stolen session must not be
 * able to add one, so it sets its first password through the emailed reset link
 * (Mentis USE_RESET), which proves the mailbox.
 */
/**
 * A grown-up proves it is really them before a big step (new password, deleting the
 * account). A Google/Apple-only account first sets a password through the reset email,
 * which proves the mailbox; a stolen session alone is never enough.
 */
export const confirmPassword = async (actor: AuthedUser, password: string | undefined) => {
  const user = await getUser(actor.userId);
  if (!user.passwordHash) {
    throw new HttpError(400, 'This account signs in with Google or Apple. Use "Forgot password" to get a link that sets a password.', 'USE_RESET');
  }
  if (!(await checkSecret(password ?? '', user.passwordHash))) {
    throw new HttpError(400, 'Your current password is not right', 'WRONG_PASSWORD');
  }
  return user;
};

export const changePassword = async (actor: AuthedUser, body: z.infer<typeof changePasswordBody>) => {
  const user = await confirmPassword(actor, body.currentPassword);
  user.passwordHash = await hashPassword(body.newPassword);
  await user.save();
  await revokeAllSessions(actor.userId);
  return user;
};

/** Sign out of every device. The route starts a fresh session for the one asking. */
export const signOutEverywhere = async (actor: AuthedUser) => {
  await revokeAllSessions(actor.userId);
  return getUser(actor.userId);
};
