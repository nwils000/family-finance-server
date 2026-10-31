// Legal documents: the version a grown-up agrees to at signup. Bump a version when the
// text changes in a way that needs fresh agreement; the app stores what each parent accepted.
// The documents themselves render from client/src/pages/legal.tsx.

export const LEGAL_VERSIONS = { terms: '2026-10-30', privacy: '2026-10-30' } as const;
export type LegalDoc = keyof typeof LEGAL_VERSIONS;

/** Where the documents live, shared by the app, emails and the marketing site. */
export const LEGAL_PATHS: Record<LegalDoc, string> = { terms: '/terms', privacy: '/privacy' };

/** Contact for privacy requests (access, deletion, consent questions). Placeholder until a real inbox exists. */
export const PRIVACY_CONTACT = 'privacy@kidkapital.app';
