// Grown-up password rules, ported from Mentis authController `passwordSchema`.
// The server's zod schema and the client's form hint both read this list.

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 128;

export const PASSWORD_RULES: readonly { test: (pw: string) => boolean; message: string }[] = [
  { test: (pw) => pw.length >= PASSWORD_MIN, message: `Password needs at least ${PASSWORD_MIN} characters` },
  { test: (pw) => pw.length <= PASSWORD_MAX, message: `Password can be at most ${PASSWORD_MAX} characters` },
  { test: (pw) => /[a-z]/.test(pw), message: 'Add a lowercase letter' },
  { test: (pw) => /[A-Z]/.test(pw), message: 'Add an uppercase letter' },
  { test: (pw) => /[0-9]/.test(pw), message: 'Add a number' },
  { test: (pw) => /[^a-zA-Z0-9]/.test(pw), message: 'Add a symbol, like ! or ?' },
  // A bcrypt-shaped value must never be stored as if it were a plain password.
  { test: (pw) => !/^\$2[aby]\$/.test(pw), message: 'That password is not allowed' },
];

/** The first rule a new password breaks, or null when it is strong enough. */
export const passwordProblem = (pw: string): string | null => PASSWORD_RULES.find((r) => !r.test(pw))?.message ?? null;

export const PASSWORD_HINT = `${PASSWORD_MIN}+ characters with upper and lower case, a number and a symbol`;
