// Verifiable parental consent ("email plus", services/consent.ts): a new kid is locked until the
// grown-up confirms the emailed notice; a follow-up email carries a revoke link; unconfirmed kids
// are deleted after the window. Emails go only to the grown-up's own account email.
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { config } from '../config.js';
import { Family, User } from '../models.js';
import { ConsentToken } from '../models-account.js';
import { CONSENT_WINDOW_DAYS, runConsentJobs } from '../services/consent.js';
import { testOutbox } from '../services/mailer.js';
import { markVerified, useTestDb } from './testDb.js';

useTestDb('consent');
const app = createApp();
let n = 0;
beforeEach(() => {
  config.consentRequired = true;
  testOutbox.length = 0;
});
afterEach(() => {
  config.consentRequired = false;
});

/** The consent notice, not the signup verification email that also lands in the outbox. */
const notice = () => testOutbox.find((m) => m.subject.startsWith('Please confirm'))!;
const tokenIn = (text: string, path: string) => new RegExp(`${path}#token=([A-Za-z0-9_-]+)`).exec(text)?.[1] ?? '';

/** A verified grown-up whose family name tries to inject HTML, plus one new kid. */
const familyWithKid = async () => {
  const email = `consent-${++n}@x.com`;
  const signup = await request(app).post('/api/auth/signup').send({ name: 'Pat', email, password: 'Password123!', familyName: '<b>Bad</b> Family', acceptLegal: true });
  await markVerified(email);
  const auth = { Authorization: `Bearer ${signup.body.accessToken}` };
  const added = await request(app).post('/api/family/kids').set(auth).send({ name: 'Mia', avatar: 'frog', pin: '1234' });
  const parent = (await User.findOne({ email }))!;
  const code = (await Family.findById(parent.familyId))!.code;
  return { email, auth, added, kidId: added.body.kid.id as string, code };
};
const kidLogin = (code: string, kidId: string) => request(app).post('/api/auth/kid-login').send({ code, kidId, pin: '1234' });

describe('parental consent', () => {
  it('a new kid is locked, and the notice goes only to the grown-up, with the HTML escaped', async () => {
    const { email, added, kidId, code } = await familyWithKid();
    expect(added.status).toBe(200);
    expect(added.body.kid.consentPending).toBe(true);
    expect(added.body.consentEmail).toEqual({ sent: true });
    const locked = await kidLogin(code, kidId);
    expect(locked.status).toBe(403);
    expect(locked.body.code).toBe('CONSENT_PENDING');
    const mail = notice();
    expect(mail.to).toBe(email);
    expect(mail.text).toMatch(/Vercel and MongoDB host it/);
    expect(mail.text).toMatch(new RegExp(`within ${CONSENT_WINDOW_DAYS} days`));
    expect(mail.html).toContain('&lt;b&gt;Bad&lt;/b&gt;');
    expect(mail.html).not.toContain('<b>Bad</b>');
  });

  it('the consent link unlocks the kid once, and records email-plus consent', async () => {
    const { kidId, code } = await familyWithKid();
    const token = tokenIn(notice().text, '/consent');
    expect((await request(app).post('/api/auth/consent/confirm').set('X-Requested-With', 'XMLHttpRequest').send({ token })).status).toBe(200);
    expect((await request(app).post('/api/auth/consent/confirm').set('X-Requested-With', 'XMLHttpRequest').send({ token })).status).toBe(400);
    expect((await kidLogin(code, kidId)).status).toBe(200);
    expect((await User.findById(kidId))!.kidConsent).toMatchObject({ method: 'email_plus' });
  });

  it('resending is limited to 3 consent emails per family per day, and never to another address', async () => {
    const { auth, kidId } = await familyWithKid(); // 1 sent
    const resend = () => request(app).post(`/api/family/kids/${kidId}/consent/resend`).set(auth).send({ to: 'someone@else.com' });
    expect((await resend()).status).toBe(200);
    expect((await resend()).status).toBe(200);
    expect((await resend()).status).toBe(429);
    expect(new Set(testOutbox.filter((m) => m.subject.startsWith('Please confirm')).map((m) => m.to)).size).toBe(1);
    expect(testOutbox.filter((m) => m.subject.startsWith('Please confirm'))).toHaveLength(3);
  });

  it('a day after consent, a follow-up email carries a withdraw link that deletes the kid', async () => {
    const { email, kidId } = await familyWithKid();
    await request(app).post('/api/auth/consent/confirm').set('X-Requested-With', 'XMLHttpRequest').send({ token: tokenIn(notice().text, '/consent') });
    await User.updateOne({ _id: kidId }, { $set: { 'kidConsent.at': new Date(Date.now() - 25 * 3_600_000) } });
    testOutbox.length = 0;
    expect((await runConsentJobs()).confirmed).toBeGreaterThanOrEqual(1);
    const followUp = testOutbox.find((m) => m.to === email)!;
    expect(followUp.subject).toMatch(/You agreed/);
    // Only once, however often the job runs.
    await runConsentJobs();
    expect(testOutbox.filter((m) => m.to === email)).toHaveLength(1);
    const token = tokenIn(followUp.text, '/consent/withdraw');
    expect((await request(app).post('/api/auth/consent/withdraw').set('X-Requested-With', 'XMLHttpRequest').send({ token })).status).toBe(200);
    expect(await User.exists({ _id: kidId })).toBeNull();
  });

  it(`a kid nobody confirmed within ${CONSENT_WINDOW_DAYS} days is deleted, with its links`, async () => {
    const { kidId } = await familyWithKid();
    await User.collection.updateOne({ _id: (await User.findById(kidId))!._id }, { $set: { createdAt: new Date(Date.now() - (CONSENT_WINDOW_DAYS + 1) * 86_400_000) } });
    await runConsentJobs();
    expect(await User.exists({ _id: kidId })).toBeNull();
    expect(await ConsentToken.countDocuments({ kidId })).toBe(0);
  });
});
