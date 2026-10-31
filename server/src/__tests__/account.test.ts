// Account security: password reset, refresh token reuse, sign out everywhere,
// change password, social sign-in switched off, and request hardening.
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { useTestDb } from './testDb.js';
import mongoose from 'mongoose';
import request from 'supertest';
import { createApp } from '../app.js';
import { REUSE_GRACE_MS } from '../auth.js';
import { PasswordResetToken, SpentRefreshToken } from '../models-account.js';
import { testOutbox } from '../services/mailer.js';

const app = createApp();
const PASSWORD = 'Password123!';
const NEW_PASSWORD = 'Brand-New-Pass9';

useTestDb('account');
beforeEach(() => {
  testOutbox.length = 0;
});

const bearer = (t: string) => ({ Authorization: `Bearer ${t}` });
const native = { 'X-Client-Platform': 'native' };

const signup = async (email = 'pat@x.com') => {
  const res = await request(app).post('/api/auth/signup').set(native).send({ name: 'Pat', email, password: PASSWORD, familyName: 'Pats', acceptLegal: true });
  expect(res.status).toBe(200);
  return { access: res.body.accessToken as string, refresh: res.body.refreshToken as string };
};
const login = (email: string, password: string) => request(app).post('/api/auth/login').set(native).send({ email, password });
const refresh = (token: string) => request(app).post('/api/auth/refresh').set(native).send({ refreshToken: token });

/** Signup also mails a verification link; these tests are about the reset mail. */
const resetMails = () => testOutbox.filter((m) => m.subject.includes('Reset'));
/** The reset email is sent after the response, so wait for it to land. */
const waitForMail = async () => {
  for (let i = 0; i < 50 && !resetMails().length; i++) await new Promise((r) => setTimeout(r, 20));
  return resetMails().at(-1);
};
const tokenFrom = (text: string) => /#token=([a-f0-9]{64})/.exec(text)?.[1] ?? '';

describe('forgot and reset password', () => {
  it('gives the same answer for a known and an unknown email, and mails only the known one', async () => {
    await signup();
    const known = await request(app).post('/api/auth/password/forgot').send({ email: 'pat@x.com' });
    const unknown = await request(app).post('/api/auth/password/forgot').send({ email: 'nobody@x.com' });
    expect(known.status).toBe(200);
    expect(unknown.status).toBe(200);
    expect(known.body).toEqual(unknown.body);
    await waitForMail();
    expect(resetMails().map((m) => m.to)).toEqual(['pat@x.com']);
  });

  it('resets once with a strong password, ends old sessions, and burns the link', async () => {
    const before = await signup();
    await request(app).post('/api/auth/password/forgot').send({ email: 'pat@x.com' });
    const token = tokenFrom((await waitForMail())!.text);
    expect(token).toHaveLength(64);
    // Stored hashed, never as the raw token.
    expect(await PasswordResetToken.exists({ tokenHash: token })).toBeNull();

    expect((await request(app).post('/api/auth/password/reset/check').send({ token })).body).toEqual({ valid: true });
    const weak = await request(app).post('/api/auth/password/reset').send({ token, password: 'password123' });
    expect(weak.status).toBe(400);

    const ok = await request(app).post('/api/auth/password/reset').send({ token, password: NEW_PASSWORD });
    expect(ok.status).toBe(200);
    expect((await request(app).post('/api/auth/password/reset').send({ token, password: NEW_PASSWORD })).status).toBe(400);
    expect((await request(app).post('/api/auth/password/reset/check').send({ token })).body).toEqual({ valid: false });

    expect((await login('pat@x.com', PASSWORD)).status).toBe(401);
    expect((await login('pat@x.com', NEW_PASSWORD)).status).toBe(200);
    // Sessions from before the reset are gone, access and refresh alike.
    expect((await refresh(before.refresh)).status).toBe(401);
    expect((await request(app).get('/api/auth/me').set(bearer(before.access))).status).toBe(401);
  });

  it('keeps the first link when asked twice within a minute', async () => {
    await signup();
    await request(app).post('/api/auth/password/forgot').send({ email: 'pat@x.com' });
    await waitForMail();
    await request(app).post('/api/auth/password/forgot').send({ email: 'pat@x.com' });
    await new Promise((r) => setTimeout(r, 100));
    expect(resetMails()).toHaveLength(1);
    expect(await PasswordResetToken.countDocuments()).toBe(1);
  });
});

describe('refresh token reuse detection', () => {
  it('a replayed rotated token revokes every session of that user', async () => {
    const first = await signup();
    const r1 = await refresh(first.refresh);
    expect(r1.status).toBe(200);
    const second = { access: r1.body.accessToken as string, refresh: r1.body.refreshToken as string };
    // Another device of the same user, signed in separately.
    const other = await login('pat@x.com', PASSWORD);
    expect(other.status).toBe(200);

    // Age the spent token past the benign two-tabs window, then replay it.
    await SpentRefreshToken.collection.updateMany({}, { $set: { createdAt: new Date(Date.now() - REUSE_GRACE_MS - 1000) } });
    const replay = await refresh(first.refresh);
    expect(replay.status).toBe(401);
    expect(replay.body.code).toBe('SESSION_REVOKED');

    expect((await refresh(second.refresh)).status).toBe(401);
    expect((await refresh(other.body.refreshToken)).status).toBe(401);
    expect((await request(app).get('/api/auth/me').set(bearer(second.access))).status).toBe(401);
  });

  it('a concurrent double refresh with the same token gives both callers a working session and revokes nothing', async () => {
    const first = await signup();
    const [a, b] = await Promise.all([refresh(first.refresh), refresh(first.refresh)]);
    expect(a.status).toBe(200);
    expect(b.status).toBe(200);
    // The grace session is single-use: a third replay inside the window is refused, but revokes nothing.
    const c = await refresh(first.refresh);
    expect(c.status).toBe(401);
    expect(c.body.code).toBeUndefined();
    for (const r of [a, b]) {
      expect((await request(app).get('/api/auth/me').set(bearer(r.body.accessToken))).status).toBe(200);
      expect((await refresh(r.body.refreshToken)).status).toBe(200);
    }
  });
});

describe('signed-in account actions', () => {
  it('sign out everywhere ends other devices and keeps this one with a fresh session', async () => {
    const phone = await signup();
    const laptop = await login('pat@x.com', PASSWORD);
    const res = await request(app).post('/api/auth/logout-all').set(native).set(bearer(phone.access));
    expect(res.status).toBe(200);
    expect((await refresh(laptop.body.refreshToken)).status).toBe(401);
    expect((await request(app).get('/api/auth/me').set(bearer(laptop.body.accessToken))).status).toBe(401);
    expect((await request(app).get('/api/auth/me').set(bearer(res.body.accessToken))).status).toBe(200);
    expect((await refresh(res.body.refreshToken)).status).toBe(200);
  });

  it('change password checks the old one, enforces the rules, and signs out other devices', async () => {
    const me = await signup();
    const other = await login('pat@x.com', PASSWORD);
    const wrong = await request(app).post('/api/auth/password/change').set(bearer(me.access)).send({ currentPassword: 'nope', newPassword: NEW_PASSWORD });
    expect(wrong.status).toBe(400);
    const weak = await request(app).post('/api/auth/password/change').set(bearer(me.access)).send({ currentPassword: PASSWORD, newPassword: 'short' });
    expect(weak.status).toBe(400);
    const ok = await request(app).post('/api/auth/password/change').set(native).set(bearer(me.access)).send({ currentPassword: PASSWORD, newPassword: NEW_PASSWORD });
    expect(ok.status).toBe(200);
    expect((await refresh(other.body.refreshToken)).status).toBe(401);
    expect((await login('pat@x.com', NEW_PASSWORD)).status).toBe(200);
  });
});

describe('social sign-in when not configured', () => {
  it('reports no providers and answers 501 NOT_CONFIGURED', async () => {
    expect((await request(app).get('/api/auth/providers')).body).toEqual({ google: null, apple: null, appleNative: false });
    const google = await request(app).post('/api/auth/google').send({ idToken: 'x'.repeat(40) });
    expect(google.status).toBe(501);
    expect(google.body.code).toBe('NOT_CONFIGURED');
    expect((await request(app).get('/api/auth/apple/nonce')).status).toBe(501);
    const apple = await request(app).post('/api/auth/apple').send({ identityToken: 'x'.repeat(40), nonce: 'a'.repeat(64) });
    expect(apple.status).toBe(501);
  });
});

describe('request hardening', () => {
  it('refuses object query params and operator keys in bodies', async () => {
    const me = await signup();
    expect((await request(app).get('/api/activity?kidId[$ne]=x').set(bearer(me.access))).status).toBe(400);
    const injected = await request(app).post('/api/auth/login').send({ email: { $ne: null }, password: { $gt: '' } });
    expect(injected.status).toBe(400);
  });

  it('refuses a body nested past the depth limit', async () => {
    let deep: object = {};
    for (let i = 0; i < 40; i++) deep = { a: deep };
    const res = await request(app).post('/api/auth/login').send(deep);
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('INVALID_BODY');
  });

  it('tags responses with a request id and forbids caching', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-request-id']).toBeTruthy();
    expect(res.headers['cache-control']).toBe('no-store');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('new signups must use a strong password', async () => {
    const res = await request(app).post('/api/auth/signup').send({ name: 'W', email: 'w@x.com', password: 'password123', familyName: 'W', acceptLegal: true });
    expect(res.status).toBe(400);
  });
});
