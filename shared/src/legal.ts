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

/** Contact for legal and privacy requests (access, deletion, consent questions). A real, read inbox. */
export const PRIVACY_CONTACT = 'nwils000@gmail.com';
