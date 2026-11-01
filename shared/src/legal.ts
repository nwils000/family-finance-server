// Legal documents: the version a grown-up agrees to at signup. Bump a version when the
// text changes in a way that needs fresh agreement; the app stores what each parent accepted.
// The documents themselves render from client/src/pages/legal.tsx.

export const LEGAL_VERSIONS = { terms: '2026-10-31', privacy: '2026-10-31' } as const;
export type LegalDoc = keyof typeof LEGAL_VERSIONS;

/** Where the documents live, shared by the app, emails and the marketing site. */
export const LEGAL_PATHS: Record<LegalDoc, string> = { terms: '/terms', privacy: '/privacy' };

/**
 * Who runs Kid Kapital, as the Terms and the Privacy Policy name them (COPPA asks a
 * children's privacy notice to name the operator and how to reach them).
 */
export const OPERATOR_NAME = 'Nathan Wilson';

/**
 * Private preview: new families are not open yet, because verifiable parental consent
 * (COPPA) is not built. While false, the marketing site shows "Coming soon" instead of any
 * signup link (site button.tsx SignupButton), and the server refuses to add a kid for anyone
 * not on PREVIEW_ALLOWED_EMAILS while grown-ups are auto-verified
 * (email-verification.ts assertKidCreationOpen). Open it only once consent is built and a
 * lawyer has confirmed the approach.
 */
export const NEW_FAMILIES_OPEN = false;
export const PRIVATE_PREVIEW_MESSAGE = "Kid Kapital is in private preview and isn't open to new families yet.";

/**
 * Retention limit (COPPA requires a published one, never indefinite): a family nobody has
 * signed in to for this many months is deleted with all its data
 * (server/src/services/personal-data.ts eraseInactiveFamilies). The Privacy Policy reads it.
 */
export const INACTIVE_FAMILY_MONTHS = 12;

/**
 * Activity history (quest runs, coin movements, chest opens) older than this is deleted even in
 * an active family (services/personal-data.ts eraseOldActivity). Balances, XP and badges stay:
 * what badges count is rolled up onto the kid first. The Privacy Policy reads it.
 */
export const ACTIVITY_HISTORY_MONTHS = 24;

/**
 * COPPA (16 CFR 312.4(d)(1)) asks a children's privacy notice for the operator's postal address
 * and phone. Empty until a mailbox and number that are not a home address exist; the Privacy
 * Policy shows them once set, and guards.test.ts refuses to open new families while either is empty.
 */
export const OPERATOR_ADDRESS = '';
export const OPERATOR_PHONE = '';

/** Contact for legal and privacy requests (access, deletion, consent questions). A real, read inbox. */
export const PRIVACY_CONTACT = 'nwils000@gmail.com';
