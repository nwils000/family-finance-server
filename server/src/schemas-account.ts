// Input shapes for account security and social sign-in endpoints.
import { z } from 'zod';
import { CONTACT_RULES, PASSWORD_MAX } from '@kk/shared';
import { linkToken } from './tokens.js';
import { email, inviteToken, newPassword } from './schemas.js';

const resetToken = linkToken('That reset link is not valid');

export const forgotBody = z.object({ email });
/** POST, token in the body: a token in a path ends up in request logs. */
export const resetCheckBody = z.object({ token: z.string().max(200) });
export const resetBody = z.object({ token: resetToken, password: newPassword });
export const verifyEmailBody = z.object({ token: linkToken('That verification link is not valid') });
export const consentLinkBody = z.object({ token: linkToken('That link is not valid') });
export const changePasswordBody = z.object({ currentPassword: z.string().max(PASSWORD_MAX).optional(), newPassword });

/** Social sign-in. `invite` joins an existing family instead of starting one; `familyName` names a new one. */
const socialExtras = {
  invite: inviteToken.optional(),
  familyName: z.string().trim().min(1).max(60).optional(),
  /** Needed only when this sign-in creates the account (accounts.ts createParent checks). */
  acceptLegal: z.boolean().optional(),
};
export const googleBody = z.object({ idToken: z.string().min(20).max(4096), ...socialExtras });
export const appleBody = z.object({
  identityToken: z.string().min(20).max(4096),
  nonce: z.string().regex(/^[a-f0-9]{64}$/),
  // Apple sends the name only on the very first sign-in, to the client, never in the token.
  name: z.string().trim().min(1).max(40).optional(),
  ...socialExtras,
});

export const deleteAccountBody = z.object({ password: z.string().max(PASSWORD_MAX).optional() });

/** The grown-up contact form, after the form guard has taken its trap and signals off. */
export const contactBody = z
  .object({
    user_name: z.string().trim().min(1).max(CONTACT_RULES.limits.user_name),
    user_email: z.string().trim().email().max(CONTACT_RULES.limits.user_email),
    message: z.string().trim().min(1).max(CONTACT_RULES.limits.message),
  })
  .strict();
