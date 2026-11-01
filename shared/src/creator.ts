// The creator's corner in grown-up Settings: a "Made by" credit (with a link to the creator's
// support page on the web) and a contact form. Never on a kid screen.
// The same EmailJS account and spam rules serve every one of Nathan's apps (the portfolio's
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

/** EmailJS REST settings. All public by design (EmailJS has no secret in the browser). */
export const EMAILJS = {
  origin: 'https://api.emailjs.com',
  sendPath: '/api/v1.0/email/send',
  serviceId: 'service_3t589y2',
  templateId: 'template_u5t6zq1',
  publicKey: 'aEYQQP-65mEPEsaXX',
  /** Every app sends its name so the shared inbox can tell them apart. */
  appName: 'Kid Kapital',
} as const;

/**
 * The free EmailJS plan is 200 sends a month shared by every app, so the form is careful.
 * Matches the portfolio exactly.
 */
export const CONTACT_RULES = {
  trapField: 'website',
  minFillMs: 3000,
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

/** silent: a bot tripped a trap; show the normal success message and send nothing. */
export type ContactVerdict = { ok: true } | { ok: false; silent: true } | { ok: false; silent?: false; text: string };

const DAY_MS = 86_400_000;

/** Decide whether a contact message may go out. `sent` holds this browser's earlier send times. */
export const checkContactSubmission = ({
  fields,
  trap,
  openedAt,
  now,
  sent,
}: {
  fields: ContactFields;
  trap: string;
  openedAt: number;
  now: number;
  sent: number[];
}): ContactVerdict => {
  const R = CONTACT_RULES;
  if (trap) return { ok: false, silent: true };
  if (now - openedAt < R.minFillMs) return { ok: false, silent: true };
  const recent = sent.filter((t) => now - t < DAY_MS);
  if (recent.length && now - Math.max(...recent) < R.cooldownMs) {
    return { ok: false, text: 'Thanks, your last message just went out. Give it a minute before sending another.' };
  }
  if (recent.length >= R.maxPerDay) return { ok: false, text: `That is a lot of messages for one day. You can email ${PRIVACY_CONTACT} directly.` };
  const message = fields.message.trim();
  if (message.length < R.minMessage) return { ok: false, text: 'Could you say a little more in your message?' };
  if ((message.match(/https?:\/\/|www\./gi) ?? []).length > R.maxLinks) {
    return { ok: false, text: `That message has a lot of links in it. You can email ${PRIVACY_CONTACT} directly.` };
  }
  return { ok: true };
};
