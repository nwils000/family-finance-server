// The one way the server sends email. Two kinds, both server-side only:
// - sendMail: account emails (parental consent, its follow-up, password reset, email
//   verification) to an account's OWN email, read from the database, never an address a caller
//   typed. From "Kid Kapital <hello@nathanwilson.dev>", replies to the operator.
// - sendToOperator: a grown-up's contact-form message to the operator's inbox, replies to them.
// Transport: SMTP when SMTP_URL is set, otherwise Resend (shared by every one of Nathan's apps:
// 100 a day in total, so this app caps itself, below). In development without either, the message
// is printed so a link is still usable locally; a hosted server without one never prints it (it
// holds a secret link). Tests read the outboxes instead of a mailbox.
import nodemailer, { type Transporter } from 'nodemailer';
import type { ContactFields } from '@kk/shared';
import { config } from '../config.js';
import { HttpError } from '../http.js';
import { countHit } from './abuse.js';

export interface Mail {
  /** Always an account's own email, read from the database, never an address a caller typed. */
  to: string;
  subject: string;
  text: string;
  /** Optional HTML body; every user-entered string in it must go through escapeHtml. */
  html?: string;
}

/** For any user-entered text (a family name, a kid's nickname, a message) placed in an HTML email. */
export const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const textToHtml = (text: string) => escapeHtml(text).replace(/\n/g, '<br>');
/** A subject line from user text: one line, no control characters. */
const oneLine = (s: string) => s.replace(/[\r\n\t]+/g, ' ').trim().slice(0, 150);

/** The Resend quota is shared by every app (100 a day), so Kid Kapital takes at most these. */
export const DAILY_MAIL_CAPS = { account: 30, contact: 10 } as const;
const DAY_MS = 86_400_000;
const TRY_LATER = "We couldn't send the email. Please try again later.";

/** Tests read sent mail from here instead of a mailbox. Only filled when NODE_ENV is test. */
export const testOutbox: Mail[] = [];
/** Tests read relayed contact messages from here. Only filled when NODE_ENV is test. */
export const operatorOutbox: ContactFields[] = [];

let transport: Transporter | null = null;
const smtp = () => (transport ??= nodemailer.createTransport(config.mail.smtpUrl!));

/** Count one send against this app's share of the day; past it, refuse kindly before sending. */
export const withinDailyCap = async (kind: keyof typeof DAILY_MAIL_CAPS) => {
  const { hits } = await countHit(`mail:${kind}`, DAY_MS);
  if (hits > DAILY_MAIL_CAPS[kind]) throw new HttpError(503, TRY_LATER, 'MAIL_CAP');
};

/** One Resend send. 10 second timeout, no retry, never logs the content. */
const resendSend = async (message: { from: string; to: string[]; reply_to?: string; subject: string; html: string; text: string }) => {
  let res: Response;
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.resend.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    console.error(JSON.stringify({ level: 'error', msg: 'email send failed', reason: 'network or timeout' }));
    throw new HttpError(503, TRY_LATER, 'SEND_FAILED');
  }
  if (!res.ok) {
    console.error(JSON.stringify({ level: 'error', msg: 'email send failed', status: res.status }));
    throw new HttpError(503, TRY_LATER, 'SEND_FAILED');
  }
};

/** An account email (see the top of this file). */
export const sendMail = async (mail: Mail) => {
  if (config.isTest) {
    testOutbox.push(mail);
    return;
  }
  if (config.mail.smtpUrl) {
    await smtp().sendMail({ from: config.mail.from, ...mail });
    return;
  }
  if (config.resend.apiKey) {
    await withinDailyCap('account');
    await resendSend({
      from: config.resend.accountFrom,
      to: [mail.to],
      ...(config.resend.replyTo ? { reply_to: config.resend.replyTo } : {}),
      subject: oneLine(mail.subject),
      html: mail.html ?? textToHtml(mail.text),
      text: mail.text,
    });
    return;
  }
  if (config.isHosted) {
    // A staging preview without email skips mail on purpose (config.previewWithoutEmail).
    if (config.previewWithoutEmail) return;
    console.error(JSON.stringify({ level: 'error', msg: 'mail not sent: no mail transport is configured', subject: mail.subject }));
    return;
  }
  console.log(`\n[dev mail] to ${mail.to}\nSubject: ${mail.subject}\n\n${mail.text}\n`);
};

/**
 * A grown-up's contact-form message to the operator's inbox (services/contact.ts), with replies
 * going to the grown-up. The body is never logged. No retry: a failure says to try later.
 */
export const sendToOperator = async (message: ContactFields) => {
  if (config.isTest) {
    operatorOutbox.push(message);
    return;
  }
  const { apiKey, operatorInbox } = config.resend;
  if (!apiKey || !operatorInbox) {
    if (config.isHosted) throw new HttpError(503, 'The contact form is not set up yet.', 'NOT_CONFIGURED');
    console.log(`\n[dev contact] from ${message.user_name} <${message.user_email}>\n\n${message.message}\n`);
    return;
  }
  await withinDailyCap('contact');
  await resendSend({
    from: config.resend.accountFrom,
    to: [operatorInbox],
    reply_to: message.user_email,
    subject: oneLine(`[Kid Kapital] New message from ${message.user_name}`),
    text: `From: ${message.user_name} <${message.user_email}>\n\n${message.message}`,
    html: `<p><b>From:</b> ${escapeHtml(message.user_name)} &lt;${escapeHtml(message.user_email)}&gt;</p><p>${textToHtml(message.message)}</p>`,
  });
};
