// Kid Kapital takes no payments, and billing code was removed outright (2026-10-31), so even a
// server booted with every payment provider's env vars set has no route that could charge.
import { describe, expect, it, vi } from 'vitest';
import { markVerified, useTestDb } from './testDb.js';

vi.hoisted(() => {
  Object.assign(process.env, {
    STRIPE_SECRET_KEY: 'sk_test_should_do_nothing',
    STRIPE_WEBHOOK_SECRET: 'whsec_should_do_nothing',
    STRIPE_PRICE_PLUS: 'price_should_do_nothing',
    REVENUECAT_WEBHOOK_SECRET: 'rc_should_do_nothing',
    REVENUECAT_SECRET_API_KEY: 'sk_rc_should_do_nothing',
  });
});

import request from 'supertest';
import { createApp } from '../app.js';

useTestDb('no-billing');
const app = createApp();

const PAYMENT_ROUTES = [
  ['get', '/api/billing/status'],
  ['post', '/api/billing/checkout'],
  ['post', '/api/billing/portal'],
  ['post', '/api/billing/sync'],
  ['post', '/api/billing/webhooks/stripe'],
  ['post', '/api/billing/webhooks/revenuecat'],
] as const;

describe('no billing', () => {
  it('with every payment env var set, no payment route exists for a signed-in grown-up', async () => {
    const signup = await request(app).post('/api/auth/signup').send({ name: 'Pat', email: 'nobill@x.com', password: 'Password123!', familyName: 'Free', acceptLegal: true });
    expect(signup.status).toBe(200);
    for (const [method, path] of PAYMENT_ROUTES) {
      const res = await request(app)[method](path).set('Authorization', `Bearer ${signup.body.accessToken}`).send({});
      expect(res.status, `${method.toUpperCase()} ${path}`).toBe(404);
    }
  });

  it('a family can add as many kids as it likes: there is no plan limit', async () => {
    const signup = await request(app).post('/api/auth/signup').send({ name: 'Pat', email: 'manykids@x.com', password: 'Password123!', familyName: 'Big', acceptLegal: true });
    await markVerified('manykids@x.com');
    const auth = { Authorization: `Bearer ${signup.body.accessToken}` };
    for (const name of ['A', 'B', 'C', 'D', 'E']) {
      const res = await request(app).post('/api/family/kids').set(auth).send({ name, avatar: 'frog', pin: '1234' });
      expect(res.status, name).toBe(200);
    }
  });
});
