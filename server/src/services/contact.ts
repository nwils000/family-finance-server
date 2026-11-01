// The grown-up contact form (client features/creator.tsx). The form guard (bot-protection.ts,
// surface 'contact') has already dropped traps, sub-3-second submits and missing signals with the
// normal success reply; the route's limiters cap 3 per 10 minutes and 10 a day per address.
import { contactProblem, type ContactFields } from '@kk/shared';
import { HttpError } from '../http.js';
import { sendToOperator } from './mailer.js';

export const CONTACT_SENT = { ok: true } as const;

export const sendContact = async (fields: ContactFields) => {
  const problem = contactProblem(fields.message);
  if (problem) throw new HttpError(400, problem, 'CONTACT_REFUSED');
  await sendToOperator(fields);
  return CONTACT_SENT;
};
