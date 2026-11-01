// COPPA stopgap: in the preview where grown-ups are auto-verified (no parental consent step),
// only allow-listed grown-ups may add a kid. Everyone else gets the friendly private-preview 403.
import { afterEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { PRIVATE_PREVIEW_MESSAGE } from '@kk/shared';
import { createApp } from '../app.js';
import { config } from '../config.js';
import { User } from '../models.js';
import { markVerified, useTestDb } from './testDb.js';

useTestDb('private-preview');
const app = createApp();
const original = { preview: config.previewWithoutEmail, allowed: config.previewAllowedEmails };
afterEach(() => {
  config.previewWithoutEmail = original.preview;
  config.previewAllowedEmails = original.allowed;
});

const parent = async (email: string) => {
  const res = await request(app).post('/api/auth/signup').send({ name: 'Pat', email, password: 'Password123!', familyName: 'Team', acceptLegal: true });
  await markVerified(email);
  return { Authorization: `Bearer ${res.body.accessToken}` };
};
const addKid = (auth: Record<string, string>) => request(app).post('/api/family/kids').set(auth).send({ name: 'Mia', avatar: 'frog', pin: '1234' });

describe('private preview', () => {
  it('a grown-up not on the allow list cannot add a kid, and no kid is stored', async () => {
    config.previewWithoutEmail = true;
    config.previewAllowedEmails = ['nathan@x.com'];
    const auth = await parent('stranger@x.com');
    const res = await addKid(auth);
    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({ code: 'PRIVATE_PREVIEW', error: PRIVATE_PREVIEW_MESSAGE });
    const familyId = (await User.findOne({ email: 'stranger@x.com' }))!.familyId;
    expect(await User.countDocuments({ familyId, role: 'kid' })).toBe(0);
  });

  it('an allow-listed grown-up can (case does not matter)', async () => {
    config.previewWithoutEmail = true;
    config.previewAllowedEmails = ['nathan@x.com'];
    expect((await addKid(await parent('Nathan@X.com'))).status).toBe(200);
  });

  it('outside the preview, kid creation follows the normal rules', async () => {
    config.previewWithoutEmail = false;
    config.previewAllowedEmails = [];
    expect((await addKid(await parent('normal@x.com'))).status).toBe(200);
  });
});
