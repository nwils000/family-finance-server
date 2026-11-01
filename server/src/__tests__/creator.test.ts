// The grown-up contact form. The browser never calls the mail relay: it posts to /api/contact,
// where the form guard, the caps, the link rule and the per-address limits are enforced, and
// only then is the message relayed (mailer.ts sendToOperator; tests read operatorOutbox).
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { CONTACT_RULES, FORM_SIGNALS_KEY, contactPacing, contactProblem } from '@kk/shared';
import { createApp } from '../app.js';
import { protection } from '../security.js';
import { DAILY_MAIL_CAPS, operatorOutbox, withinDailyCap } from '../services/mailer.js';
import { useTestDb } from './testDb.js';

useTestDb('contact');
const app = createApp();
let n = 0;
const human = { [FORM_SIGNALS_KEY]: { surface: 'contact', elapsedMs: 9000, interacted: true } };
const fields = { user_name: 'Pat', user_email: 'pat@x.com', message: 'Hello, I love the piggy bank.' };

const grownUp = async () => {
  const email = `contact-${++n}@x.com`;
  const res = await request(app).post('/api/auth/signup').send({ name: 'Pat', email, password: 'Password123!', familyName: 'Team', acceptLegal: true });
  return { Authorization: `Bearer ${res.body.accessToken}` };
};
const send = (auth: Record<string, string>, body: object, ip = '198.51.100.7') => request(app).post('/api/contact').set(auth).set('X-Forwarded-For', ip).send(body);

beforeEach(() => {
  operatorOutbox.length = 0;
});
afterEach(() => {
  protection.limits = false;
});

describe('contact form (server relay)', () => {
  it('a person with normal signals reaches the inbox, with exactly the three fields', async () => {
    const res = await send(await grownUp(), { ...fields, ...human, website: '' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(operatorOutbox).toEqual([fields]);
  });

  it('a filled trap, a sub-3-second submit, or no signals gets the normal success and sends nothing', async () => {
    const auth = await grownUp();
    const fast = { [FORM_SIGNALS_KEY]: { surface: 'contact', elapsedMs: 1200, interacted: true } };
    for (const body of [{ ...fields, ...human, website: 'http://spam' }, { ...fields, ...fast }, { ...fields }]) {
      const res = await send(auth, body);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ ok: true });
    }
    expect(operatorOutbox).toEqual([]);
  });

  it('refuses unknown fields, over-long fields, a near-empty message and more than three links', async () => {
    const auth = await grownUp();
    expect((await send(auth, { ...fields, ...human, to: 'someone@else.com' })).status).toBe(400);
    expect((await send(auth, { ...fields, ...human, message: 'x'.repeat(CONTACT_RULES.limits.message + 1) })).status).toBe(400);
    expect((await send(auth, { ...fields, ...human, message: 'hi' })).status).toBe(400);
    expect((await send(auth, { ...fields, ...human, message: 'see http://a.com http://b.com www.c.com https://d.com' })).status).toBe(400);
    expect(operatorOutbox).toEqual([]);
  });

  it('grown-ups only: no session, no send', async () => {
    expect((await request(app).post('/api/contact').set('X-Requested-With', 'XMLHttpRequest').send({ ...fields, ...human })).status).toBe(401);
  });

  it('3 per 10 minutes per address', async () => {
    protection.limits = true;
    const auth = await grownUp();
    const ip = '198.51.100.99';
    for (let i = 0; i < 3; i++) expect((await send(auth, { ...fields, ...human }, ip)).status).toBe(200);
    const fourth = await send(auth, { ...fields, ...human }, ip);
    expect(fourth.status).toBe(429);
    expect(operatorOutbox).toHaveLength(3);
  });
});

describe('daily mail caps (the Resend quota is shared by every app)', () => {
  it('past the app-wide cap a send is refused kindly before it goes out', async () => {
    for (let i = 0; i < DAILY_MAIL_CAPS.contact; i++) await withinDailyCap('contact');
    await expect(withinDailyCap('contact')).rejects.toMatchObject({ status: 503, code: 'MAIL_CAP' });
  });
});

describe('contact rules shared with the browser', () => {
  it('message problems and per-browser pacing', () => {
    expect(contactProblem('hi')).toMatch(/say a little more/);
    expect(contactProblem('see http://a.com http://b.com www.c.com')).toBeNull();
    const now = 1_700_000_000_000;
    expect(contactPacing([now - 30_000], now)).toMatch(/minute/);
    expect(contactPacing([now - 61_000], now)).toBeNull();
    expect(contactPacing([1, 2, 3, 4, 5].map((h) => now - h * 3_600_000), now)).toMatch(/one day/);
  });
});
