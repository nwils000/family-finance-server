// Straight from the module that owns them, NOT the @kk/shared index: this file
// reaches the browser through the nav, and the index also evaluates the whole
// lesson library (the package has no `sideEffects: false`), which put ~180 kB
// of lesson text into every page's JavaScript.
import { LEGAL_PATHS, NEW_FAMILIES_OPEN, PRIVACY_CONTACT, PRIVATE_PREVIEW_MESSAGE } from '@kk/shared/src/legal';

/**
 * The one place the site learns where things live. Every CTA, legal link and
 * canonical URL reads from here, never from a string typed into a component.
 */
const trim = (url: string) => url.replace(/\/+$/, '');

/** The Kid Kapital web app. */
export const APP_URL = trim(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5173');
/** This marketing site's own public origin (canonical URLs, sitemap, OG). */
export const SITE_URL = trim(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3100');

/** Routes inside the app. Mirrors client/src/App.tsx. */
export const APP_LINKS = {
  signup: `${APP_URL}/signup`,
  login: `${APP_URL}/login`,
  kidLogin: `${APP_URL}/kid-login`,
  join: `${APP_URL}/join`,
  privacy: `${APP_URL}${LEGAL_PATHS.privacy}`,
  terms: `${APP_URL}${LEGAL_PATHS.terms}`,
} as const;

export const CONTACT_EMAIL = PRIVACY_CONTACT;

/** Whether new families may sign up (@kk/shared legal.ts). While false no page links to signup or join: see SignupButton. */
export { NEW_FAMILIES_OPEN, PRIVATE_PREVIEW_MESSAGE };

export const SITE_NAME = 'Kid Kapital';
export const TAGLINE = 'Chores become quests. Coins become know-how.';
export const DESCRIPTION =
  'Kid Kapital is a playful family money app. Grown-ups set quests, kids earn coins, spend them in a family shop, and grow them in a piggy bank or a rocket fund. Plus Money school: short illustrated lessons for every age.';

/** Home page sections, in page order. The nav and footer both read this list. */
export const SECTIONS = [
  { id: 'how', label: 'How it works' },
  { id: 'features', label: 'Features' },
  { id: 'school', label: 'Money school' },
  { id: 'parents', label: 'For grown-ups' },
  { id: 'plans', label: 'Pricing' },
  { id: 'faq', label: 'FAQ' },
] as const;
