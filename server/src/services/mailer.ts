// The one way the server sends email. With SMTP_URL set it sends through SMTP;
// in development without it, the message is printed to the console so a reset
// link is still usable locally. Production without SMTP logs that mail is off
// and never prints the message (it holds a secret link). Staging counts as hosted.
import nodemailer, { type Transporter } from 'nodemailer';
import type { ContactFields } from '@kk/shared';
import { config } from '../config.js';
import { HttpError } from '../http.js';

export interface Mail {
  /** Always an account's own email, read from the database, never an address a caller typed. */
  to: string;
  subject: string;
  text: string;
  /** Optional HTML body; every user-entered string in it must go through escapeHtml. */
  html?: string;
}

/** For any user-entered text (a family name, a kid's nickname) placed in an HTML email. */
export const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const textToHtml = (text: string) => escapeHtml(text).replace(/\n/g, '<br>');

/** Tests read sent mail from here instead of a mailbox. Only filled when NODE_ENV is test. */
export const testOutbox: Mail[] = [];

let transport: Transporter | null = null;
const smtp = () => (transport ??= nodemailer.createTransport(config.mail.smtpUrl!));

export const sendMail = async (mail: Mail) => {
  if (config.isTest) {
    testOutbox.push(mail);
    return;
  }
  if (config.mail.smtpUrl) {
    await smtp().sendMail({ from: config.mail.from, ...mail });
    return;
  }
  // No SMTP: EmailJS's direct-to-user template, server-side with the private key (free tier).
  if (config.emailjs.userTemplateId && config.emailjs.privateKey) {
    await emailjsSend(config.emailjs.userTemplateId, {
      to_email: mail.to,
      subject: mail.subject,
      from_name: 'Kid Kapital',
      body_html: mail.html ?? textToHtml(mail.text),
    });
    return;
  }
  if (config.isHosted) {
    // A staging preview without email skips mail on purpose (config.previewWithoutEmail).
    if (config.previewWithoutEmail) return;
    console.error(JSON.stringify({ level: 'error', msg: 'mail not sent: SMTP_URL is not configured', subject: mail.subject }));
    return;
  }
  console.log(`\n[dev mail] to ${mail.to}\nSubject: ${mail.subject}\n\n${mail.text}\n`);
};

/** Tests read relayed contact messages from here. Only filled when NODE_ENV is test. */
export const operatorOutbox: ContactFields[] = [];

const EMAILJS_SEND = 'https://api.emailjs.com/api/v1.0/email/send';

/**
 * A grown-up's contact-form message to the operator's inbox, relayed server-side through
 * EmailJS (strict mode: the private key is required, so a copied public key sends nothing).
 * The message body is never logged. No retry: a failure tells the grown-up to email instead.
 */
export const sendToOperator = async (message: ContactFields) => {
  if (config.isTest) {
    operatorOutbox.push(message);
    return;
  }
  const { serviceId, templateId, publicKey, privateKey } = config.emailjs;
  if (!serviceId || !templateId || !publicKey || !privateKey) {
    if (config.isHosted) throw new HttpError(503, 'The contact form is not set up yet.', 'NOT_CONFIGURED');
    console.log(`\n[dev contact] from ${message.user_name} <${message.user_email}>\n\n${message.message}\n`);
    return;
  }
  await emailjsSend(templateId, { ...message, app_name: 'Kid Kapital' }).catch(() => {
    throw new HttpError(502, 'That did not send. Please email us directly.', 'SEND_FAILED');
  });
};

/** One server-side EmailJS send (strict mode: the private key goes with it). Never logs the content. */
const emailjsSend = async (templateId: string, params: Record<string, string>) => {
  const { serviceId, publicKey, privateKey } = config.emailjs;
  const res = await fetch(EMAILJS_SEND, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ service_id: serviceId, template_id: templateId, user_id: publicKey, accessToken: privateKey, template_params: params }),
  });
  if (!res.ok) {
    console.error(JSON.stringify({ level: 'error', msg: 'email send failed', status: res.status }));
    throw new HttpError(502, "We couldn't send the email. Please try again later.", 'SEND_FAILED');
  }
};
