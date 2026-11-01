// Form guard: the anti-bot signals a public form sends, ported from Mentis
// shared/formGuardConstants.ts. The client (client/src/lib/form-guard.ts and the
// <Honeypot> in components/ui) and the server (server/src/bot-protection.ts formGuard)
// both read this file, so the field names and timing floors can never drift apart.
//
// 1. Honeypot fields are named like real inputs a bot loves to fill (a URL), never
//    "honeypot". They are hidden by their PARENT, not display:none on the input,
//    because a headless bot checks the input's own computed style. Both names are
//    URL-shaped on purpose: browsers do not autofill a URL, while "company" or
//    "phone" fields can be autofilled into a hidden input by a real grown-up's browser.
// 2. The fill-time floor is the fastest a PERSON could finish, not an average. A
//    password manager is fast, so timing alone never drops anything; it only counts
//    together with "no pointer, key or touch at all".
// 3. A request with NO signals is treated exactly like a clean one. An old app build
//    on a phone that predates this file must keep working.

/** Every public form the guard watches. */
export type FormGuardSurface = 'signup' | 'join' | 'login' | 'kidLogin' | 'passwordReset' | 'contact';

/** The body key the signals ride under. The server strips it before zod sees the body. */
export const FORM_SIGNALS_KEY = 'clientSignals';

/** Hidden fields on every guarded form. Either one arriving non-blank is a bot. */
export const HONEYPOT_FIELDS = ['website', 'homepage'] as const;
export type HoneypotField = (typeof HONEYPOT_FIELDS)[number];

/**
 * Fastest plausible human fill per form, in milliseconds: 3 seconds on every grown-up form
 * (the standard across Nathan's apps). A submit is caught only when it is faster than this
 * AND no real pointer, key or touch happened, so a person using a password manager is never
 * caught. Kid login counts from the family code screen through the avatar tap and four PIN
 * digits, and stays low so a quick kid is never slowed down.
 */
export const FORM_MIN_FILL_MS: Record<FormGuardSurface, number> = {
  signup: 3000,
  join: 3000,
  login: 3000,
  kidLogin: 600,
  contact: 3000,
  passwordReset: 3000,
};

/** Anything longer is a stale tab or a replay, not evidence, so it is ignored. */
export const MAX_PLAUSIBLE_FILL_MS = 6 * 60 * 60_000;

/** What the client sends under FORM_SIGNALS_KEY. Every field is optional. */
export interface ClientFormSignals {
  surface?: FormGuardSurface;
  /** Milliseconds from the form appearing to the submit. */
  elapsedMs?: number;
  /** True once a real pointer, key or touch event happened on the page. A scripted POST never sets it. */
  interacted?: boolean;
}

/** The extra body a guarded form adds to its request. */
export type FormGuardBody = Partial<Record<HoneypotField, string>> & { [FORM_SIGNALS_KEY]?: ClientFormSignals };
