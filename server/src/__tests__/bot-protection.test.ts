// Bot protection and rate limits that hold across serverless instances (bot-protection.ts,
// services/abuse.ts, security.ts limiter()). Each test calls from its own address.
import express from 'express';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FORM_SIGNALS_KEY } from '@kk/shared';
import { createApp } from '../app.js';
import { Family, User } from '../models.js';
import { AbuseCounter, IpBan, PasswordResetToken } from '../models-account.js';
import { limiter, protection } from '../security.js';
import { BAN_LADDER_MS, FAILED_SIGNIN_THRESHOLD, recordFailedSignIn } from '../services/abuse.js';
import { useTestDb } from './testDb.js';

useTestDb('bot-protection');

const app = createApp();
const BROWSER = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
let last = 0;
const newIp = () => `203.0.113.${++last}`;
const get = (ip: string, path: string, agent: string | null = BROWSER) => {
  const req = request(app).get(path).set('X-Forwarded-For', ip);
  return agent === null ? req : req.set('User-Agent', agent);
};
const post = (ip: string, path: string, body: object) => request(app).post(path).set('X-Forwarded-For', ip).set('User-Agent', BROWSER).send(body);

const signupBody = (email: string) => ({ name: 'Sam', email, password: 'Kapital1!', familyName: 'The Testers', acceptLegal: true });
const banOf = (ip: string) => IpBan.findById(ip).lean();
const minutesLeft = (until: Date) => Math.round((until.getTime() - Date.now()) / 60_000);

afterEach(() => {
  protection.limits = false;
  protection.bans = false;
  vi.restoreAllMocks();
});

describe('rate limits', () => {
  it('two instances share one count through the database (Vercel runs many)', async () => {
    protection.limits = true;
    // Two separate apps, each with its own limiter and store, like two serverless instances.
    const instance = () => express().set('trust proxy', 1).get('/x', limiter('shared-test', 60_000, 3), (_req, res) => res.json({ ok: true }));
    const [one, two] = [instance(), instance()];
    const ip = newIp();
    const hit = (a: express.Express) => request(a).get('/x').set('X-Forwarded-For', ip).then((r) => r.status);
    expect([await hit(one), await hit(two), await hit(one), await hit(two), await hit(one)]).toEqual([200, 200, 200, 429, 429]);
    // Another address has its own count.
    expect(await request(two).get('/x').set('X-Forwarded-For', newIp()).then((r) => r.status)).toBe(200);
  });

  it('a database error lets the request through and logs one line, never a 500', async () => {
    protection.limits = true;
    protection.bans = true;
    const log = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.spyOn(AbuseCounter, 'findOneAndUpdate').mockRejectedValue(new Error('db down'));
    vi.spyOn(IpBan, 'exists').mockRejectedValue(new Error('db down'));
    const ip = newIp();
    expect((await get(ip, '/api/health')).status).toBe(200);
    expect((await get(ip, '/wp-admin')).status).toBe(404);
    expect((await post(ip, '/api/auth/login', { email: 'nobody@example.com', password: 'nope' })).status).toBe(401);
    expect(log.mock.calls.some(([line]) => JSON.parse(String(line)).msg === 'abuse store unavailable, allowing')).toBe(true);
  });
});

describe('bot protection', () => {
  it('honeypot paths and scanner agents ban an address: 15 minutes first, then an hour', async () => {
    protection.bans = true;
    const ip = newIp();
    expect((await get(ip, '/wp-admin/setup.php')).status).toBe(404);
    expect((await get(ip, '/.env')).status).toBe(404);
    // Two probes score 10 of 15: not banned yet.
    expect((await get(ip, '/api/health')).status).toBe(200);
    expect((await get(ip, '/api/health', 'sqlmap/1.7.2#stable')).status).toBe(403);
    // Banned now, whatever it claims to be, everywhere, with no detail.
    const banned = await get(ip, '/api/health');
    expect(banned.status).toBe(403);
    expect(banned.body).toEqual({ error: 'Access denied' });
    const first = (await banOf(ip))!;
    expect(first.offense).toBe(1);
    expect(minutesLeft(first.until)).toBe(BAN_LADDER_MS[0] / 60_000);
    // Someone else is untouched.
    expect((await get(newIp(), '/api/health')).status).toBe(200);

    // The ban runs out. The score is still high, so one more probe earns the next rung.
    await IpBan.updateOne({ _id: ip }, { $set: { until: new Date(Date.now() - 1000) } });
    expect((await get(ip, '/api/health')).status).toBe(200);
    expect((await get(ip, '/.git/config')).status).toBe(404);
    const second = (await banOf(ip))!;
    expect(second.offense).toBe(2);
    expect(minutesLeft(second.until)).toBe(BAN_LADDER_MS[1] / 60_000);
  });

  it('an IPv6 /64 is one address', async () => {
    protection.bans = true;
    for (const path of ['/.env', '/.git/HEAD', '/phpmyadmin']) await get('2001:db8:1:2::a', path);
    expect((await get('2001:db8:1:2:ffff::9', '/api/health')).status).toBe(403);
    expect((await get('2001:db8:1:3::a', '/api/health')).status).toBe(200);
  });

  it('empty and generic client agents are refused on the API without a ban; webhooks are exempt', async () => {
    protection.bans = true;
    const ip = newIp();
    expect((await get(ip, '/api/health', null)).status).toBe(403);
    for (let i = 0; i < 5; i++) expect((await get(ip, '/api/health', 'curl/8.4.0')).status).toBe(403);
    expect((await get(ip, '/api/health')).status).toBe(200);
    expect(await banOf(ip)).toBeNull();
    // Signed webhooks come from servers, not browsers: never judged by their agent.
    const hook = await request(app).post('/api/billing/webhooks/revenuecat').set('X-Forwarded-For', ip).set('User-Agent', 'python-requests/2.31').send({});
    expect(hook.status).not.toBe(403);
  });

  it('wrong passwords from one address count toward a ban', async () => {
    protection.bans = true;
    const ip = newIp();
    expect((await post(ip, '/api/auth/login', { email: 'nobody@example.com', password: 'Wrong1!' })).status).toBe(401);
    expect((await AbuseCounter.findById(`fail:${ip}`).lean())?.hits).toBe(1);
    for (let i = 1; i < FAILED_SIGNIN_THRESHOLD; i++) await recordFailedSignIn(ip);
    expect((await banOf(ip))?.reason).toBe('excessive_auth_failures');
    expect(await AbuseCounter.exists({ _id: `fail:${ip}` })).toBeNull();
    expect((await get(ip, '/api/health')).status).toBe(403);
  });
});

describe('form guard', () => {
  it('a filled honeypot field gets a normal-looking signup, and nothing is created', async () => {
    const ip = newIp();
    const caught = await post(ip, '/api/auth/signup', { ...signupBody('bot@example.com'), website: 'https://spam.example' });
    expect(caught.status).toBe(200);
    expect(caught.body.user).toMatchObject({ role: 'parent', name: 'Sam', email: 'bot@example.com', emailVerified: false, hasPassword: true });
    expect(caught.headers['set-cookie']?.[0]).toMatch(/^kk_refresh=/);
    expect(await User.countDocuments()).toBe(0);
    expect(await Family.countDocuments()).toBe(0);
    // The token looks real and opens nothing.
    expect((await request(app).get('/api/auth/me').set('Authorization', `Bearer ${caught.body.accessToken}`)).status).toBe(401);

    // Same shape as a real signup.
    const real = await post(ip, '/api/auth/signup', signupBody('real@example.com'));
    expect(real.status).toBe(200);
    expect(Object.keys(caught.body).sort()).toEqual(Object.keys(real.body).sort());
    expect(Object.keys(caught.body.user).sort()).toEqual(Object.keys(real.body.user).sort());
    // A malformed body still gets the real validation error, not a decoy success.
    expect((await post(ip, '/api/auth/signup', { website: 'x', email: 'nope' })).status).toBe(400);
  });

  it('no signals passes; too fast alone passes; too fast with no interaction gets the normal wrong-password answer', async () => {
    const ip = newIp();
    expect((await post(ip, '/api/auth/signup', { ...signupBody('pat@example.com'), [FORM_SIGNALS_KEY]: { elapsedMs: 9000, interacted: true } })).status).toBe(200);
    const login = { email: 'pat@example.com', password: 'Kapital1!' };
    expect((await post(ip, '/api/auth/login', login)).status).toBe(200);
    expect((await post(ip, '/api/auth/login', { ...login, [FORM_SIGNALS_KEY]: { elapsedMs: 50, interacted: true } })).status).toBe(200);
    expect((await post(ip, '/api/auth/login', { ...login, [FORM_SIGNALS_KEY]: { elapsedMs: 9000, interacted: false } })).status).toBe(200);
    expect((await post(ip, '/api/auth/login', { ...login, [FORM_SIGNALS_KEY]: 'garbage' })).status).toBe(200);
    const caught = await post(ip, '/api/auth/login', { ...login, [FORM_SIGNALS_KEY]: { elapsedMs: 50, interacted: false } });
    expect(caught.status).toBe(401);
    expect(caught.body).toEqual({ error: 'Wrong email or password' });
    // The decoy touched no account: the real login still works and nothing was locked.
    expect((await User.findOne({ email: 'pat@example.com' }).lean())?.failedLogins ?? 0).toBe(0);
  });

  it('a caught password reset answers like a real one and sends nothing', async () => {
    const ip = newIp();
    await post(ip, '/api/auth/signup', signupBody('lee@example.com'));
    const caught = await post(ip, '/api/auth/password/forgot', { email: 'lee@example.com', homepage: 'https://spam.example' });
    expect(caught.status).toBe(200);
    expect(caught.body).toEqual({ ok: true });
    await new Promise((r) => setTimeout(r, 300));
    expect(await PasswordResetToken.countDocuments()).toBe(0);
    // The same request without the honeypot really does make a link.
    expect((await post(ip, '/api/auth/password/forgot', { email: 'lee@example.com' })).body).toEqual({ ok: true });
    await new Promise((r) => setTimeout(r, 300));
    expect(await PasswordResetToken.countDocuments()).toBe(1);
  });

  it('caught submissions score against the address when bans are live', async () => {
    protection.bans = true;
    const ip = newIp();
    await post(ip, '/api/auth/signup', { ...signupBody('a@example.com'), website: 'https://spam.example' });
    expect((await AbuseCounter.findById(`risk:${ip}`).lean())?.hits).toBe(5);
  });
});
