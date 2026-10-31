// Regression tests for the authentication and request-security audit: grown-up
// invites instead of the family code, atomic PIN lockouts, login timing, email
// verification, access token revocation, CSRF, error replies and log hygiene.
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTestDb } from './testDb.js';

// Google sign-in on, with a fake verifier: the "ID token" is the JSON payload itself.
vi.hoisted(() => {
  process.env.GOOGLE_CLIENT_ID = 'test-google-client';
});
vi.mock('google-auth-library', () => ({
  OAuth2Client: class {
    async verifyIdToken({ idToken }: { idToken: string }) {
      const payload = JSON.parse(idToken);
      return { getPayload: () => payload };
    }
  },
}));

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import request from 'supertest';
import { PASSWORD_MAX } from '@kk/shared';
import { createApp } from '../app.js';
import { errorHandler } from '../http.js';
import { User } from '../models.js';
import { CoParentInvite, EmailVerificationToken } from '../models-account.js';
import { ipKey, loggablePath } from '../security.js';
import { DUMMY_PASSWORD_HASH } from '../services/accounts.js';
import { testOutbox } from '../services/mailer.js';

const app = createApp();
const PASSWORD = 'Password123!';
const XHR = { 'X-Requested-With': 'XMLHttpRequest' };
const bearer = (t: string) => ({ Authorization: `Bearer ${t}`, ...XHR });

useTestDb('authsec');
beforeEach(() => {
  testOutbox.length = 0;
});

const waitForMail = async (to: string) => {
  for (let i = 0; i < 50 && !testOutbox.some((m) => m.to === to); i++) await new Promise((r) => setTimeout(r, 20));
  return testOutbox.filter((m) => m.to === to).at(-1);
};
const fragment = (text: string, key: string) => new RegExp(`#${key}=([a-f0-9]{64})`).exec(text)?.[1] ?? '';

const signup = async (email = 'pat@x.com') => {
  const res = await request(app).post('/api/auth/signup').send({ name: 'Pat', email, password: PASSWORD, familyName: 'Pats', acceptLegal: true });
  expect(res.status).toBe(200);
  return res.body.accessToken as string;
};
/** Signup, then click the emailed verification link: the real flow. */
const verifiedParent = async (email = 'pat@x.com') => {
  const access = await signup(email);
  const token = fragment((await waitForMail(email))!.text, 'token');
  expect((await request(app).post('/api/auth/email/verify').send({ token })).status).toBe(200);
  return access;
};
const familyCode = async (access: string) => (await request(app).get('/api/family').set(bearer(access))).body.family.code as string;
const addKid = (access: string, pin = '1234') => request(app).post('/api/family/kids').set(bearer(access)).send({ name: 'Kiddo', avatar: 'fox', pin });
const kidLogin = (code: string, kidId: string, pin: string) => request(app).post('/api/auth/kid-login').send({ code, kidId, pin });
const inviteToken = async (access: string) => {
  const res = await request(app).post('/api/family/invites').set(bearer(access));
  expect(res.status).toBe(200);
  expect(res.body.url).toMatch(/\/join#invite=[a-f0-9]{64}$/);
  return fragment(res.body.url, 'invite');
};
const googleToken = (email: string, sub = `sub-${email}`, verified = true) =>
  JSON.stringify({ sub, email, email_verified: verified, given_name: 'Gee', padding: 'x'.repeat(20) });

describe('C1: a grown-up joins only with a single-use invite, never the family code', () => {
  it('the family code alone cannot create a grown-up account, by email or by Google', async () => {
    const access = await verifiedParent();
    const code = await familyCode(access);
    const join = await request(app).post('/api/auth/join').send({ name: 'Eve', email: 'eve@x.com', password: PASSWORD, code, acceptLegal: true });
    expect(join.status).toBe(400);
    // Google with a code: the code is ignored, so Eve gets a family of her own, never Pat's.
    const google = await request(app).post('/api/auth/google').send({ idToken: googleToken('eve@x.com'), code, acceptLegal: true });
    expect(google.status).toBe(200);
    expect(google.body.user.familyId).not.toBe((await User.findOne({ email: 'pat@x.com' }))!.familyId.toString());
  });

  it('an invite joins once; reuse and expiry are refused; only a verified grown-up can invite', async () => {
    const unverified = await signup('new@x.com');
    const refused = await request(app).post('/api/family/invites').set(bearer(unverified));
    expect(refused.status).toBe(403);
    expect(refused.body.code).toBe('EMAIL_UNVERIFIED');

    const access = await verifiedParent();
    const invite = await inviteToken(access);
    // Stored hashed only.
    expect(await CoParentInvite.exists({ tokenHash: invite })).toBeNull();
    expect((await request(app).post('/api/auth/invite/check').send({ invite })).body).toEqual({ valid: true, familyName: 'Pats' });

    const joined = await request(app).post('/api/auth/join').send({ name: 'Jo', email: 'jo@x.com', password: PASSWORD, invite, acceptLegal: true });
    expect(joined.status).toBe(200);
    const pat = await User.findOne({ email: 'pat@x.com' });
    expect(joined.body.user.familyId).toBe(String(pat!.familyId));

    const reuse = await request(app).post('/api/auth/join').send({ name: 'Al', email: 'al@x.com', password: PASSWORD, invite, acceptLegal: true });
    expect(reuse.status).toBe(400);
    expect(reuse.body.code).toBe('INVITE_INVALID');
    expect((await request(app).post('/api/auth/invite/check').send({ invite })).body).toEqual({ valid: false });

    const old = await inviteToken(access);
    await CoParentInvite.updateMany({ usedAt: null }, { $set: { expiresAt: new Date(Date.now() - 1000) } });
    const expired = await request(app).post('/api/auth/join').send({ name: 'Al', email: 'al@x.com', password: PASSWORD, invite: old, acceptLegal: true });
    expect(expired.status).toBe(400);
  });

  it('two people racing one invite: exactly one joins', async () => {
    const access = await verifiedParent();
    const invite = await inviteToken(access);
    const results = await Promise.all(
      ['a', 'b', 'c'].map((n) => request(app).post('/api/auth/join').send({ name: n, email: `${n}@x.com`, password: PASSWORD, invite, acceptLegal: true })),
    );
    expect(results.filter((r) => r.status === 200)).toHaveLength(1);
  });

  it('a taken email does not burn the invite', async () => {
    const access = await verifiedParent();
    const invite = await inviteToken(access);
    expect((await request(app).post('/api/auth/join').send({ name: 'P', email: 'pat@x.com', password: PASSWORD, invite, acceptLegal: true })).status).toBe(409);
    expect((await request(app).post('/api/auth/join').send({ name: 'Jo', email: 'jo@x.com', password: PASSWORD, invite, acceptLegal: true })).status).toBe(200);
  });

  it('Google sign-in can join with an invite', async () => {
    const access = await verifiedParent();
    const invite = await inviteToken(access);
    const res = await request(app).post('/api/auth/google').send({ idToken: googleToken('gee@x.com'), invite, acceptLegal: true });
    expect(res.status).toBe(200);
    expect(res.body.user.familyId).toBe(String((await User.findOne({ email: 'pat@x.com' }))!.familyId));
    expect(res.body.user.emailVerified).toBe(true);
  });

  it('a grown-up can change the kid sign-in code; the old one stops working', async () => {
    const access = await verifiedParent();
    const old = await familyCode(access);
    const res = await request(app).post('/api/family/code/rotate').set(bearer(access));
    expect(res.status).toBe(200);
    expect(res.body.code).not.toBe(old);
    expect((await request(app).get(`/api/auth/family/${old}`)).status).toBe(404);
    expect((await request(app).get(`/api/auth/family/${res.body.code}`)).status).toBe(200);
  });
});

describe('C2 + M2: kid PIN lockout is atomic, escalates, and only a new PIN clears it', () => {
  it('20 parallel wrong PINs lock the kid; at most 5 are even compared', async () => {
    const access = await verifiedParent();
    const kidId = (await addKid(access)).body.kid.id as string;
    const code = await familyCode(access);
    const compare = vi.spyOn(bcrypt, 'compare');
    const results = await Promise.all(Array.from({ length: 20 }, (_, i) => kidLogin(code, kidId, String(i).padStart(4, '0'))));
    const compared = compare.mock.calls.length;
    compare.mockRestore();
    expect(compared).toBeLessThanOrEqual(5);
    expect(results.filter((r) => r.status === 429).length).toBeGreaterThanOrEqual(15);
    // Locked: even the right PIN is refused now.
    expect((await kidLogin(code, kidId, '1234')).status).toBe(429);
    const kid = await User.findById(kidId);
    expect(kid!.lockedUntil!.getTime()).toBeGreaterThan(Date.now());
    expect(kid!.lockouts).toBe(1);
  });

  it('each lock is longer (5 min, 1 h, 24 h); a grown-up changing the PIN clears it and ends the kid sessions', async () => {
    const access = await verifiedParent();
    const kidId = (await addKid(access)).body.kid.id as string;
    const code = await familyCode(access);
    const session = await kidLogin(code, kidId, '1234');
    expect(session.status).toBe(200);

    const lockLength = async () => {
      for (let i = 0; i < 5; i++) await kidLogin(code, kidId, '0000');
      const kid = await User.findById(kidId);
      const ms = kid!.lockedUntil!.getTime() - Date.now();
      // Let the lock lapse without clearing the ladder.
      await User.updateOne({ _id: kidId }, { $set: { lockedUntil: new Date(Date.now() - 1000) } });
      return ms;
    };
    const near = (ms: number, target: number) => Math.abs(ms - target) < 30_000;
    expect(near(await lockLength(), 5 * 60_000)).toBe(true);
    expect(near(await lockLength(), 60 * 60_000)).toBe(true);
    expect(near(await lockLength(), 24 * 60 * 60_000)).toBe(true);
    expect(near(await lockLength(), 24 * 60 * 60_000)).toBe(true);
    // A successful sign-in does not reset the ladder.
    expect((await kidLogin(code, kidId, '1234')).status).toBe(200);
    expect((await User.findById(kidId))!.lockouts).toBe(4);

    for (let i = 0; i < 5; i++) await kidLogin(code, kidId, '0000');
    expect((await kidLogin(code, kidId, '1234')).status).toBe(429);
    expect((await request(app).patch(`/api/family/kids/${kidId}`).set(bearer(access)).send({ pin: '4321' })).status).toBe(200);
    const kid = await User.findById(kidId);
    expect(kid!.lockouts).toBe(0);
    expect(kid!.lockedUntil).toBeNull();
    // The old PIN's session is over, and the new PIN works.
    expect((await request(app).get('/api/auth/me').set(bearer(session.body.accessToken))).status).toBe(401);
    expect((await kidLogin(code, kidId, '4321')).status).toBe(200);
  });

  it('grown-up logins lock too, atomically', async () => {
    await signup();
    const results = await Promise.all(Array.from({ length: 12 }, () => request(app).post('/api/auth/login').send({ email: 'pat@x.com', password: 'Wrong-pass1!' })));
    expect(results.filter((r) => r.status === 429).length).toBeGreaterThanOrEqual(7);
    expect((await request(app).post('/api/auth/login').send({ email: 'pat@x.com', password: PASSWORD })).status).toBe(429);
  });
});

describe('H1: login timing does not reveal accounts', () => {
  it('the dummy hash is a real cost-12 bcrypt hash', () => {
    expect(bcrypt.getRounds(DUMMY_PASSWORD_HASH)).toBe(12);
  });

  it('an unknown email and a Google-only account still run one full compare', async () => {
    await request(app).post('/api/auth/google').send({ idToken: googleToken('gee@x.com'), acceptLegal: true });
    const compare = vi.spyOn(bcrypt, 'compare');
    expect((await request(app).post('/api/auth/login').send({ email: 'nobody@x.com', password: PASSWORD })).status).toBe(401);
    expect((await request(app).post('/api/auth/login').send({ email: 'gee@x.com', password: PASSWORD })).status).toBe(401);
    expect(compare).toHaveBeenCalledTimes(2);
    expect(compare.mock.calls.every(([, hash]) => hash === DUMMY_PASSWORD_HASH)).toBe(true);
    compare.mockRestore();
  });
});

describe('H2: email verification', () => {
  it('signup mails a single-use link; kids wait for it; the link works once', async () => {
    const access = await signup();
    const me = await request(app).get('/api/auth/me').set(bearer(access));
    expect(me.body.user.emailVerified).toBe(false);
    const blocked = await addKid(access);
    expect(blocked.status).toBe(403);
    expect(blocked.body.code).toBe('EMAIL_UNVERIFIED');

    const token = fragment((await waitForMail('pat@x.com'))!.text, 'token');
    expect(await EmailVerificationToken.exists({ tokenHash: token })).toBeNull();
    expect((await request(app).post('/api/auth/email/verify').send({ token })).status).toBe(200);
    expect((await request(app).post('/api/auth/email/verify').send({ token })).status).toBe(400);
    expect((await request(app).get('/api/auth/me').set(bearer(access))).body.user.emailVerified).toBe(true);
    expect((await addKid(access)).status).toBe(200);
  });

  it('resend sends a fresh link to an unverified grown-up', async () => {
    const access = await signup();
    await waitForMail('pat@x.com');
    await EmailVerificationToken.collection.updateMany({}, { $set: { createdAt: new Date(Date.now() - 120_000) } });
    const res = await request(app).post('/api/auth/email/resend').set(bearer(access));
    expect(res.status).toBe(200);
    expect(testOutbox.filter((m) => m.to === 'pat@x.com')).toHaveLength(2);
  });

  it('Google sign-in over an unverified password account drops the squatter password and sessions', async () => {
    // Someone registers the victim's address with their own password, and never verifies it.
    const squatter = await signup('victim@x.com');
    const res = await request(app).post('/api/auth/google').send({ idToken: googleToken('victim@x.com'), acceptLegal: true });
    expect(res.status).toBe(200);
    expect(res.body.user.emailVerified).toBe(true);
    expect(res.body.user.hasPassword).toBe(false);
    expect((await request(app).post('/api/auth/login').send({ email: 'victim@x.com', password: PASSWORD })).status).toBe(401);
    expect((await request(app).get('/api/auth/me').set(bearer(squatter))).status).toBe(401);
  });

  it('Google sign-in over a verified password account keeps the password', async () => {
    await verifiedParent('kept@x.com');
    expect((await request(app).post('/api/auth/google').send({ idToken: googleToken('kept@x.com'), acceptLegal: true })).status).toBe(200);
    expect((await request(app).post('/api/auth/login').send({ email: 'kept@x.com', password: PASSWORD })).status).toBe(200);
  });
});

describe('M1: signing out ends the access token at once', () => {
  it('a logged-out access token is refused', async () => {
    const access = await signup();
    expect((await request(app).get('/api/auth/me').set(bearer(access))).status).toBe(200);
    expect((await request(app).post('/api/auth/logout').set(bearer(access))).status).toBe(200);
    expect((await request(app).get('/api/auth/me').set(bearer(access))).status).toBe(401);
  });
});

describe('M3: a Google-only account cannot set a password without the mailbox', () => {
  it('change password answers USE_RESET', async () => {
    const res = await request(app).post('/api/auth/google').send({ idToken: googleToken('gee@x.com'), acceptLegal: true });
    const change = await request(app).post('/api/auth/password/change').set(bearer(res.body.accessToken)).send({ newPassword: 'Brand-New-Pass9' });
    expect(change.status).toBe(400);
    expect(change.body.code).toBe('USE_RESET');
  });
});

describe('M4: error replies and logs', () => {
  it('malformed and oversized JSON are 4xx, not 500', async () => {
    const bad = await request(app).post('/api/auth/login').set('Content-Type', 'application/json').send('{"email":"a@x.com","password":"hunter2"');
    expect(bad.status).toBe(400);
    expect(JSON.stringify(bad.body)).not.toContain('hunter2');
    const big = await request(app).post('/api/auth/login').set('Content-Type', 'application/json').send(JSON.stringify({ email: 'a@x.com', password: 'x'.repeat(60_000) }));
    expect(big.status).toBe(413);
  });

  it('a 500 logs one structured line, never the raw error or its body', () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const err = Object.assign(new Error('boom'), { body: { password: 'hunter2' } });
    let status = 0;
    const res = { status: (s: number) => ((status = s), { json: () => undefined }) };
    errorHandler(err, { id: 'req-123' } as never, res as never, () => undefined);
    expect(status).toBe(500);
    expect(log).toHaveBeenCalledTimes(1);
    const [line] = log.mock.calls[0];
    expect(typeof line).toBe('string');
    expect(JSON.parse(line as string)).toMatchObject({ level: 'error', id: 'req-123', message: 'boom', name: 'Error' });
    expect(line).not.toContain('hunter2');
    log.mockRestore();
  });
});

describe('M5: CSRF guard', () => {
  it('a cross-site text/plain POST to logout is refused; our client header passes', async () => {
    const forged = await request(app).post('/api/auth/logout').set('Content-Type', 'text/plain').send('x');
    expect(forged.status).toBe(403);
    expect(forged.body.code).toBe('CSRF_REFUSED');
    expect((await request(app).post('/api/auth/logout').set(XHR)).status).toBe(200);
  });
});

describe('L1, L5, L6 and limiter keys', () => {
  it('request logs mask token-looking path segments and the family code', () => {
    expect(loggablePath(`/api/auth/password/reset/${'a'.repeat(64)}?x=1`)).toBe('/api/auth/password/reset/:token');
    expect(loggablePath('/api/auth/family/ABC123')).toBe('/api/auth/family/:code');
    // Object ids (24 hex) stay readable.
    expect(loggablePath('/api/quests/65f0c0ffee0000000000abcd/done')).toBe('/api/quests/65f0c0ffee0000000000abcd/done');
  });

  it('sends no ETag', async () => {
    const access = await signup();
    expect((await request(app).get('/api/family').set(bearer(access))).headers.etag).toBeUndefined();
  });

  it('login refuses a password longer than PASSWORD_MAX before hashing it', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'a@x.com', password: 'x'.repeat(PASSWORD_MAX + 1) });
    expect(res.status).toBe(400);
  });

  it('limiter keys fold IPv6 to its /64 and IPv4-mapped addresses to IPv4', () => {
    expect(ipKey('2001:db8:1:2:3:4:5:6')).toBe('2001:db8:1:2::/64');
    expect(ipKey('2001:db8:1:2:ffff::9')).toBe(ipKey('2001:db8:1:2::1'));
    expect(ipKey('2001:db8::1')).toBe('2001:db8:0:0::/64');
    expect(ipKey('::ffff:192.0.2.7')).toBe('192.0.2.7');
    expect(ipKey('192.0.2.7')).toBe('192.0.2.7');
  });
});
