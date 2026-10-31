// The one way the server sends email. With SMTP_URL set it sends through SMTP;
// in development without it, the message is printed to the console so a reset
// link is still usable locally. Production without SMTP logs that mail is off
// and never prints the message (it holds a secret link). Staging counts as hosted.
import nodemailer, { type Transporter } from 'nodemailer';
import { config } from '../config.js';

export interface Mail {
  to: string;
  subject: string;
  text: string;
}

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
  if (config.isHosted) {
    // A staging preview without email skips mail on purpose (config.previewWithoutEmail).
    if (config.previewWithoutEmail) return;
    console.error(JSON.stringify({ level: 'error', msg: 'mail not sent: SMTP_URL is not configured', subject: mail.subject }));
    return;
  }
  console.log(`\n[dev mail] to ${mail.to}\nSubject: ${mail.subject}\n\n${mail.text}\n`);
};
