// Verifiable parental consent, COPPA "email plus" (valid because a kid's data stays inside the
// family and is never disclosed). The first time a grown-up adds a kid, the grown-up's own account
// email gets the direct notice with a single-use consent link. The kid stays locked (cannot sign
// in, so nothing is collected beyond what the grown-up typed: auth.ts issueSession) until the link
// is used. A day or more after consent, a follow-up email with a revoke link confirms it; revoking
// deletes the kid. With no consent within CONSENT_WINDOW_DAYS, the kid profile is deleted.
//
// Recipients are only ever the signed-in grown-up's own account email (read from the database),
// never an address a caller sends. Every user-entered string in the HTML goes through escapeHtml.
import type { Types } from 'mongoose';
import { LEGAL_PATHS, LEGAL_VERSIONS, OPERATOR_ADDRESS, OPERATOR_NAME, OPERATOR_PHONE, PRIVACY_CONTACT } from '@kk/shared';
import { config } from '../config.js';
import { HttpError, notFound } from '../http.js';
import { Family, User } from '../models.js';
import { ConsentToken } from '../models-account.js';
import { appLink, newToken, sha256 } from '../tokens.js';
import { countHit } from './abuse.js';
import { familyOf, type Actor } from './access.js';
import { escapeHtml, sendMail } from './mailer.js';
import { eraseKid } from './personal-data.js';

const DAY_MS = 86_400_000;
/** No consent within this many days: the kid profile is deleted (the notice says so). */
export const CONSENT_WINDOW_DAYS = 7;
/** The follow-up with the revoke link goes out at least this long after consent (the daily job makes it 24 to 48 hours). */
const CONFIRM_AFTER_MS = DAY_MS;
/** A revoke link works for this long. */
const REVOKE_TTL_MS = 30 * DAY_MS;
/** The email quota is shared by every one of Nathan's apps: at most this many consent emails per family per day. */
const MAX_CONSENT_EMAILS_PER_DAY = 3;

const OPERATOR_LINE = [OPERATOR_NAME, OPERATOR_ADDRESS, OPERATOR_PHONE, PRIVACY_CONTACT].filter(Boolean).join(', ');
const privacyUrl = () => `${config.appUrl}${LEGAL_PATHS.privacy}`;
const p = (html: string) => `<p style="margin:0 0 14px;line-height:1.5">${html}</p>`;
const button = (href: string, label: string) =>
  `<p style="margin:20px 0"><a href="${href}" style="background:#5B5BE6;color:#fff;padding:12px 20px;border-radius:12px;text-decoration:none;font-weight:bold">${label}</a></p>`;

/** The direct notice (16 CFR 312.4(c)(1)). Plain text and HTML say the same thing. */
const noticeMail = (to: string, family: string, kid: string, link: string) => {
  const lines = [
    `You (or someone using this email) asked to add a child, "${kid}", to the Kid Kapital family "${family}". We need your consent before your child can use Kid Kapital. We collected your email only to ask for it.`,
    'If you agree, we will collect: the nickname, drawn avatar, optional age and PIN you entered; and, as your child plays, quests finished, coins, rewards, the name of their savings goal, lesson and quiz answers, plus a sign-in cookie and internet address used only to keep them signed in and the service secure.',
    'We use this only to run Kid Kapital for your family. Vercel and MongoDB host it for us, and EmailJS delivers our emails (like this one); we share it with no one else, never sell it and show no ads. You can agree to collection without agreeing to any other disclosure.',
    `If you don't agree within ${CONSENT_WINDOW_DAYS} days, we delete your child's profile. You can review, download or delete your child's information at any time from Settings, or by writing to us.`,
  ];
  return {
    to,
    subject: `Please confirm: add ${kid} to Kid Kapital`,
    text: [...lines, `Privacy Policy: ${privacyUrl()}`, `To agree: ${link}`, OPERATOR_LINE].join('\n\n'),
    html: [
      p(`You (or someone using this email) asked to add a child, <b>${escapeHtml(kid)}</b>, to the Kid Kapital family <b>${escapeHtml(family)}</b>. We need your consent before your child can use Kid Kapital. We collected your email only to ask for it.`),
      ...lines.slice(1).map((l) => p(escapeHtml(l))),
      p(`Privacy Policy: <a href="${privacyUrl()}">${privacyUrl()}</a>`),
      button(link, 'I agree'),
      p(`<span style="color:#666">${escapeHtml(OPERATOR_LINE)}</span>`),
    ].join(''),
  };
};

const confirmationMail = (to: string, kid: string, link: string) => ({
  to,
  subject: `You agreed: ${kid} can use Kid Kapital`,
  text: [
    `This confirms that you agreed to let ${kid} use Kid Kapital. If that wasn't you, or you've changed your mind, use this link to withdraw consent. It deletes ${kid}'s profile and everything in it: ${link}`,
    `Privacy Policy: ${privacyUrl()}`,
    OPERATOR_LINE,
  ].join('\n\n'),
  html: [
    p(`This confirms that you agreed to let <b>${escapeHtml(kid)}</b> use Kid Kapital.`),
    p(`If that wasn't you, or you've changed your mind, withdraw consent below. It deletes ${escapeHtml(kid)}'s profile and everything in it.`),
    button(link, 'Withdraw consent'),
    p(`Privacy Policy: <a href="${privacyUrl()}">${privacyUrl()}</a>`),
    p(`<span style="color:#666">${escapeHtml(OPERATOR_LINE)}</span>`),
  ].join(''),
});

/**
 * Email the direct notice for one locked kid to the signed-in grown-up's own account email.
 * Used when the kid is added and by "Resend". At most 3 consent emails per family per day.
 */
export const sendConsentNotice = async (actor: Actor, kidId: Types.ObjectId | string) => {
  const familyId = familyOf(actor);
  const [parent, kid, family] = await Promise.all([
    User.findOne({ _id: actor.userId, familyId, role: 'parent' }).select('email'),
    User.findOne({ _id: kidId, familyId, role: 'kid' }).select('name kidConsent'),
    Family.findById(familyId).select('name'),
  ]);
  if (!parent?.email || !kid || !family) throw notFound('Kid not found');
  if (kid.kidConsent?.at) throw new HttpError(409, 'You already agreed for this kid.', 'ALREADY_CONSENTED');
  const { hits } = await countHit(`consent-mail:${familyId}`, DAY_MS);
  if (hits > MAX_CONSENT_EMAILS_PER_DAY) throw new HttpError(429, "We've sent a few emails today. Please try again tomorrow.", 'RATE_LIMITED');

  await ConsentToken.deleteMany({ kidId: kid._id, purpose: 'consent' });
  const token = newToken();
  const row = await ConsentToken.create({
    kidId: kid._id,
    familyId,
    parentId: parent._id,
    purpose: 'consent',
    tokenHash: sha256(token),
    expiresAt: new Date(Date.now() + CONSENT_WINDOW_DAYS * DAY_MS),
  });
  try {
    await sendMail(noticeMail(parent.email, family.name, kid.name, appLink('/consent', 'token', token)));
  } catch {
    await ConsentToken.deleteOne({ _id: row._id });
    throw new HttpError(502, "We couldn't send the email. Please try again later.", 'SEND_FAILED');
  }
  return { sent: true as const };
};

/** The grown-up used the consent link: record consent once (the link is single-use). */
export const confirmConsent = async (token: string) => {
  const row = await ConsentToken.findOneAndDelete({ tokenHash: sha256(token), purpose: 'consent', expiresAt: { $gt: new Date() } });
  if (!row) throw new HttpError(400, 'That link has expired or was already used. You can send a new one from Family in Kid Kapital.', 'LINK_INVALID');
  const kid = await User.findOneAndUpdate(
    { _id: row.kidId, role: 'kid', kidConsent: null },
    { $set: { kidConsent: { at: new Date(), method: 'email_plus', noticeVersion: LEGAL_VERSIONS.privacy, parentId: row.parentId, confirmSentAt: null } } },
    { new: true },
  ).select('name');
  if (!kid) throw new HttpError(400, 'That link has expired or was already used.', 'LINK_INVALID');
  return { kidName: kid.name };
};

/** The revoke link from the follow-up email: withdraw consent by deleting the kid and everything theirs. */
export const revokeConsent = async (token: string) => {
  const row = await ConsentToken.findOneAndDelete({ tokenHash: sha256(token), purpose: 'revoke', expiresAt: { $gt: new Date() } });
  if (!row) throw new HttpError(400, 'That link has expired or was already used. You can remove the kid from Family in Kid Kapital.', 'LINK_INVALID');
  const kid = await User.findOne({ _id: row.kidId, role: 'kid' }).select('name familyId');
  if (kid) await eraseKid(kid.familyId, kid._id);
  return { kidName: kid?.name ?? null };
};

/**
 * Daily (services/jobs.ts). Sends each follow-up with its revoke link once a day or more has
 * passed since consent (claimed first, so two runs never send twice; a failed send is released to
 * retry), and deletes kids still waiting after CONSENT_WINDOW_DAYS.
 */
export const runConsentJobs = async (now = new Date()) => {
  if (!config.consentRequired) return { confirmed: 0, expired: 0 };
  let confirmed = 0;
  const due = await User.find({ role: 'kid', 'kidConsent.at': { $lte: new Date(now.getTime() - CONFIRM_AFTER_MS) }, 'kidConsent.confirmSentAt': null }).select('name familyId kidConsent');
  for (const kid of due) {
    const claimed = await User.updateOne({ _id: kid._id, 'kidConsent.confirmSentAt': null }, { $set: { 'kidConsent.confirmSentAt': now } });
    if (!claimed.modifiedCount) continue;
    const parent = kid.kidConsent?.parentId ? await User.findOne({ _id: kid.kidConsent.parentId, familyId: kid.familyId, role: 'parent' }).select('email') : null;
    if (!parent?.email) continue;
    const token = newToken();
    const row = await ConsentToken.create({ kidId: kid._id, familyId: kid.familyId, parentId: parent._id, purpose: 'revoke', tokenHash: sha256(token), expiresAt: new Date(now.getTime() + REVOKE_TTL_MS) });
    try {
      await sendMail(confirmationMail(parent.email, kid.name, appLink('/consent/withdraw', 'token', token)));
      confirmed++;
    } catch (err) {
      await ConsentToken.deleteOne({ _id: row._id });
      await User.updateOne({ _id: kid._id }, { $set: { 'kidConsent.confirmSentAt': null } });
      console.warn(JSON.stringify({ level: 'warn', msg: 'consent follow-up not sent; will retry', err: String(err) }));
    }
  }
  const stale = await User.find({ role: 'kid', kidConsent: null, createdAt: { $lt: new Date(now.getTime() - CONSENT_WINDOW_DAYS * DAY_MS) } }).select('familyId');
  for (const kid of stale) await eraseKid(kid.familyId, kid._id);
  if (confirmed || stale.length) console.info(JSON.stringify({ level: 'info', msg: 'consent jobs', confirmed, expired: stale.length }));
  return { confirmed, expired: stale.length };
};
