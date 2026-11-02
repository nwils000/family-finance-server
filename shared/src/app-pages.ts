// What each page of the web app is called, for search engines, link previews and the browser tab.
// The server writes these into the HTML before sending it (server/src/web-app.ts), so a crawler
// or a chat app's preview sees the right page without running any script; the app reuses them
// for document.title (client App.tsx). Only the legal documents are indexed: the marketing site is
// the front door, and everything else is a sign-in screen or private family data.

export interface AppPageMeta {
  title: string;
  description: string;
  /** Allow search engines to index this page. */
  index?: boolean;
}

const BRAND = 'Kid Kapital';
const DEFAULT_DESCRIPTION = 'The free family app where chores become quests and coins become know-how.';

export const APP_PAGES: Record<string, AppPageMeta> = {
  '/': { title: BRAND, description: `${DEFAULT_DESCRIPTION} Grown-ups and kids sign in here.` },
  '/login': { title: `Grown-up sign in | ${BRAND}`, description: `Sign in to ${BRAND} as a grown-up.` },
  '/signup': { title: `Start a family | ${BRAND}`, description: `Start your family on ${BRAND}. ${DEFAULT_DESCRIPTION}` },
  '/kid-login': { title: `Kid sign in | ${BRAND}`, description: 'Kids sign in with the family code, their avatar and their PIN.' },
  '/join': { title: `Join a family | ${BRAND}`, description: `Join a family on ${BRAND} with the invite link another grown-up sent you.` },
  '/forgot-password': { title: `Forgot password | ${BRAND}`, description: `Get a link to reset your ${BRAND} password.` },
  '/reset-password': { title: `Reset password | ${BRAND}`, description: `Choose a new ${BRAND} password.` },
  '/verify-email': { title: `Confirm your email | ${BRAND}`, description: `Confirm your email for ${BRAND}.` },
  '/consent': { title: `Parent consent | ${BRAND}`, description: `Agree to let your child use ${BRAND}.` },
  '/consent/withdraw': { title: `Withdraw consent | ${BRAND}`, description: `Withdraw consent for your child to use ${BRAND}.` },
  '/privacy': {
    title: `Privacy Policy | ${BRAND}`,
    description: `How ${BRAND} handles grown-ups' and kids' information: what we collect, why, who hosts it, and how parents stay in control.`,
    index: true,
  },
  '/terms': { title: `Terms of Use | ${BRAND}`, description: `The terms for using ${BRAND}, the free family chores and money-lessons app.`, index: true },
};

/** The page's metadata; signed-in areas and anything unknown get the plain name and are not indexed. */
export const appPageMeta = (path: string): AppPageMeta => APP_PAGES[path.replace(/\/+$/, '') || '/'] ?? { title: BRAND, description: DEFAULT_DESCRIPTION };
export const APP_OG_IMAGE_ALT = `${BRAND}: Chores become quests. Coins become know-how.`;
