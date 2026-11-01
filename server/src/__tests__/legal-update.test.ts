// Changed Terms or Privacy Policy: a grown-up agrees again before anything else, and kids sign in
// only once a grown-up in their family has agreed to the current Privacy Policy.
import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { LEGAL_UPDATE_CODE } from '@kk/shared';
import { createApp } from '../app.js';
import { Family, User } from '../models.js';
import { markVerified, useTestDb } from './testDb.js';

useTestDb('legal-update');
const app = createApp();
const PASSWORD = 'Password123!';

/** A family with one kid, whose grown-up then "agreed" only to older documents. */
const oldFamily = async (email: string) => {
  const signup = await request(app).post('/api/auth/signup').send({ name: 'Pat', email, password: PASSWORD, familyName: 'Team', acceptLegal: true });
  await markVerified(email);
  const auth = { Authorization: `Bearer ${signup.body.accessToken}` };
  const kidId = (await request(app).post('/api/family/kids').set(auth).send({ name: 'Mia', avatar: 'frog', pin: '1234' })).body.kid.id as string;
  await User.updateOne({ email }, { $set: { legalAccepted: { terms: '2000-01-01', privacy: '2000-01-01', at: new Date(2000, 0, 1) } } });
  const parent = await User.findOne({ email });
  const code = (await Family.findById(parent!.familyId))!.code;
  const login = await request(app).post('/api/auth/login').send({ email, password: PASSWORD });
  return { auth: { Authorization: `Bearer ${login.body.accessToken}` }, kidId, code };
};

describe('re-agreeing to changed documents', () => {
  it('a grown-up on old versions is asked to agree before anything else, but can still see or delete their data', async () => {
    const { auth } = await oldFamily('old@x.com');
    const blocked = await request(app).get('/api/family').set(auth);
    expect(blocked.status).toBe(428);
    expect(blocked.body.code).toBe(LEGAL_UPDATE_CODE);
    expect((await request(app).get('/api/account/export').set(auth)).status).toBe(200);
    const accepted = await request(app).post('/api/account/legal/accept').set(auth);
    expect(accepted.status).toBe(200);
    expect((await request(app).get('/api/family').set({ Authorization: `Bearer ${accepted.body.accessToken}` })).status).toBe(200);
  });

  it('a kid cannot sign in until a grown-up in the family has agreed to the current Privacy Policy', async () => {
    const { auth, kidId, code } = await oldFamily('kidblock@x.com');
    const before = await request(app).post('/api/auth/kid-login').send({ code, kidId, pin: '1234' });
    expect(before.status).toBe(428);
    expect(before.body.error).toMatch(/grown-up/);
    await request(app).post('/api/account/legal/accept').set(auth);
    expect((await request(app).post('/api/auth/kid-login').send({ code, kidId, pin: '1234' })).status).toBe(200);
  });

  it('a grown-up who agreed at signup is never asked', async () => {
    const signup = await request(app).post('/api/auth/signup').send({ name: 'Pat', email: 'fresh@x.com', password: PASSWORD, familyName: 'Team', acceptLegal: true });
    expect((await request(app).get('/api/family').set({ Authorization: `Bearer ${signup.body.accessToken}` })).status).toBe(200);
  });
});
