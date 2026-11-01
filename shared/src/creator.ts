// The creator's corner in grown-up Settings: a "Made by" credit (with a link to the creator's
// support page on the web) and a contact form. Never on a kid screen. The form posts to our own
// server (/api/contact), which relays it to the operator's inbox; the browser never talks to a
// mail service and holds no mail keys.
// The same relay account and spam rules serve every one of Nathan's apps (the portfolio's
// Contact.js SPAM_RULES / checkSubmission are the reference), so they live here once.
import { PRIVACY_CONTACT } from './legal';

/** The creator's own site, linked from the support card. */
export const CREATOR_SITE = 'https://nathanwilson.dev';

/**
 * Where people can support the creator: a page on his own site (Netlify), never in this app.
 * Kid Kapital runs on Vercel's Hobby plan, whose fair-use rules count asking for money as
 * commercial use, so nothing that takes money (no checkout page, no amounts, no money button) may live in this repo
 * (guards.test.ts). This plain link to his site is the only exception, and only in grown-up
 * Settings on the web.
 */
export const CREATOR_SUPPORT_PAGE = 'https://nathanwilson.dev/support';

/**
 * The relay's free plan is 200 sends a month shared by every one of Nathan's apps, so the form
 * is careful. Matches the portfolio. The server enforces the trap, the 3-second floor (form
 * guard surface 'contact'), the caps and the links; the browser adds a per-browser cooldown.
 */
export const CONTACT_RULES = {
  cooldownMs: 60_000,
  maxPerDay: 5,
  maxLinks: 3,
  limits: { user_name: 100, user_email: 200, message: 4000 },
  minMessage: 10,
} as const;

export interface ContactFields {
  user_name: string;
  user_email: string;
  message: string;
}

/** What is wrong with a message, or null. The server refuses with it; the browser checks first. */
export const contactProblem = (message: string): string | null => {
  const text = message.trim();
  if (text.length < CONTACT_RULES.minMessage) return 'Could you say a little more in your message?';
  if ((text.match(/https?:\/\/|www\./gi) ?? []).length > CONTACT_RULES.maxLinks) return `That message has a lot of links in it. You can email ${PRIVACY_CONTACT} directly.`;
  return null;
};

const DAY_MS = 86_400_000;

/** The browser's own pacing, from this browser's earlier send times: one a minute, five a day. */
export const contactPacing = (sent: number[], now: number): string | null => {
  const recent = sent.filter((t) => now - t < DAY_MS);
  if (recent.length && now - Math.max(...recent) < CONTACT_RULES.cooldownMs) return 'Thanks, your last message just went out. Give it a minute before sending another.';
  if (recent.length >= CONTACT_RULES.maxPerDay) return `That is a lot of messages for one day. You can email ${PRIVACY_CONTACT} directly.`;
  return null;
};
