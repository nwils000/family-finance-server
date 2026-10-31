// Kapital Plus: plan limits, effective plan with grace, and both webhooks
// (signature / authorization checks, idempotency, out-of-order events).
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { markVerified, useTestDb } from './testDb.js';

// Test-mode keys must exist before config.ts reads the environment.
vi.hoisted(() => {
  process.env.STRIPE_SECRET_KEY = 'sk_test_kidkapital';
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_kidkapital_test';
  process.env.REVENUECAT_WEBHOOK_SECRET = 'rc_hook_secret';
  delete process.env.STRIPE_PRICE_PLUS;
});

import mongoose from 'mongoose';
import request from 'supertest';
import Stripe from 'stripe';
import { createApp } from '../app.js';
import { Entitlement } from '../models-account.js';
import { effectivePlan, GRACE_DAYS } from '../services/billing.js';

const app = createApp();
const stripe = new Stripe('sk_test_kidkapital');
const DAY = 86_400_000;

useTestDb('billing');

const bearer = (t: string) => ({ Authorization: `Bearer ${t}` });

const makeFamily = async (tag = 'fam') => {
  const res = await request(app).post('/api/auth/signup').send({ name: 'Pat', email: `${tag}@x.com`, password: 'Password123!', familyName: tag, acceptLegal: true });
  const parent = res.body.accessToken as string;
  await markVerified(`${tag}@x.com`);
  const familyId = (await request(app).get('/api/family').set(bearer(parent))).body.family.id as string;
  return { parent, familyId };
};
const addKid = (parent: string, name: string) => request(app).post('/api/family/kids').set(bearer(parent)).send({ name, avatar: 'fox', pin: '1234' });
const status = async (parent: string) => (await request(app).get('/api/billing/status').set(bearer(parent))).body;

const stripeEvent = (familyId: string, opts: { id: string; created: number; status?: string; type?: string }) => {
  const payload = JSON.stringify({
    id: opts.id,
    object: 'event',
    type: opts.type ?? 'customer.subscription.updated',
    created: opts.created,
    data: {
      object: {
        id: 'sub_123',
        object: 'subscription',
        customer: 'cus_123',
        status: opts.status ?? 'active',
        cancel_at_period_end: false,
        metadata: { familyId },
        items: { data: [{ current_period_end: Math.floor((Date.now() + 30 * DAY) / 1000) }] },
      },
    },
  });
  return { payload, signature: stripe.webhooks.generateTestHeaderString({ payload, secret: 'whsec_kidkapital_test' }) };
};
const postStripe = (e: { payload: string; signature: string }) =>
  request(app).post('/api/billing/webhooks/stripe').set('Content-Type', 'application/json').set('Stripe-Signature', e.signature).send(e.payload);

const rcEvent = (familyId: string, id: string, type: string, extra: object = {}) => ({
  event: { id, type, app_user_id: familyId, entitlement_ids: ['plus'], expiration_at_ms: Date.now() + 30 * DAY, event_timestamp_ms: Date.now(), ...extra },
});
const postRc = (body: object, auth = 'Bearer rc_hook_secret') => request(app).post('/api/billing/webhooks/revenuecat').set('Authorization', auth).send(body);

describe('plan limits', () => {
  it('a free family can add 2 kids and gets 402 PLAN_LIMIT on the third', async () => {
    const f = await makeFamily();
    expect((await addKid(f.parent, 'A')).status).toBe(200);
    expect((await addKid(f.parent, 'B')).status).toBe(200);
    const third = await addKid(f.parent, 'C');
    expect(third.status).toBe(402);
    expect(third.body.code).toBe('PLAN_LIMIT');
    const s = await status(f.parent);
    expect(s.plan).toBe('free');
    expect(s.usage.kids).toBe(2);
  });

  it('a Plus family can add a third kid', async () => {
    const f = await makeFamily();
    await Entitlement.create({ familyId: f.familyId, plan: 'plus', status: 'active', source: 'manual' });
    for (const name of ['A', 'B', 'C']) expect((await addKid(f.parent, name)).status).toBe(200);
    expect((await status(f.parent)).plan).toBe('plus');
  });

  it('checkout answers 501 until a Stripe price is configured', async () => {
    const f = await makeFamily();
    const res = await request(app).post('/api/billing/checkout').set(bearer(f.parent));
    expect(res.status).toBe(501);
    expect(res.body.code).toBe('NOT_CONFIGURED');
  });
});

describe('effective plan (expiry and grace)', () => {
  const now = Date.now();
  const plus = (status: 'active' | 'past_due' | 'cancelled' | 'inactive', endOffsetDays: number | null, extra = {}) => ({
    plan: 'plus' as const,
    status,
    source: 'stripe' as const,
    currentPeriodEnd: endOffsetDays === null ? null : new Date(now + endOffsetDays * DAY),
    cancelAtPeriodEnd: false,
    ...extra,
  });

  it('honors grace windows and expiry', () => {
    expect(effectivePlan(null)).toBe('free');
    expect(effectivePlan(plus('active', 10))).toBe('plus');
    expect(effectivePlan(plus('active', -(GRACE_DAYS.staleActiveStripe - 1)))).toBe('plus');
    expect(effectivePlan(plus('active', -(GRACE_DAYS.staleActiveStripe + 1)))).toBe('free');
    expect(effectivePlan(plus('active', -1, { cancelAtPeriodEnd: true }))).toBe('free');
    expect(effectivePlan(plus('active', null))).toBe('free');
    expect(effectivePlan(plus('active', null, { source: 'manual' }))).toBe('plus');
    expect(effectivePlan(plus('past_due', -(GRACE_DAYS.pastDue - 1)))).toBe('plus');
    expect(effectivePlan(plus('past_due', -(GRACE_DAYS.pastDue + 1)))).toBe('free');
    expect(effectivePlan(plus('cancelled', 3))).toBe('plus');
    expect(effectivePlan(plus('cancelled', -1))).toBe('free');
    expect(effectivePlan(plus('inactive', 30))).toBe('free');
  });
});

describe('plan limit races', () => {
  it('simultaneous adds never push a free family past its kid limit', async () => {
    const f = await makeFamily('race');
    const adds = await Promise.all(['A', 'B', 'C', 'D'].map((name) => addKid(f.parent, name)));
    expect(adds.filter((r) => r.status === 200).length).toBe(2);
    const kids = (await request(app).get('/api/family').set(bearer(f.parent))).body.kids;
    expect(kids).toHaveLength(2);
  });
});

describe('stripe webhook', () => {
  it('rejects a bad signature', async () => {
    const f = await makeFamily();
    const e = stripeEvent(f.familyId, { id: 'evt_1', created: 100 });
    const res = await postStripe({ payload: e.payload, signature: 't=1,v1=deadbeef' });
    expect(res.status).toBe(400);
    expect((await status(f.parent)).plan).toBe('free');
  });

  it('applies a signed event once, ignores a duplicate and an older event', async () => {
    const f = await makeFamily();
    const now = Math.floor(Date.now() / 1000);
    const e = stripeEvent(f.familyId, { id: 'evt_2', created: now });
    const first = await postStripe(e);
    expect(first.status).toBe(200);
    expect(first.body.duplicate).toBeUndefined();
    expect((await status(f.parent)).plan).toBe('plus');

    const again = await postStripe(stripeEvent(f.familyId, { id: 'evt_2', created: now }));
    expect(again.status).toBe(200);
    expect(again.body.duplicate).toBe(true);

    // An older "canceled" event arriving late must not undo the newer state.
    const late = await postStripe(stripeEvent(f.familyId, { id: 'evt_0', created: now - 600, status: 'canceled' }));
    expect(late.status).toBe(200);
    expect((await status(f.parent)).plan).toBe('plus');

    const deleted = await postStripe(stripeEvent(f.familyId, { id: 'evt_3', created: now + 60, type: 'customer.subscription.deleted', status: 'canceled' }));
    expect(deleted.status).toBe(200);
    expect((await status(f.parent)).plan).toBe('free');
  });
});

describe('revenuecat webhook', () => {
  it('rejects a wrong Authorization header', async () => {
    const f = await makeFamily();
    expect((await postRc(rcEvent(f.familyId, 'rc_1', 'INITIAL_PURCHASE'), 'Bearer nope')).status).toBe(401);
    expect((await postRc(rcEvent(f.familyId, 'rc_1', 'INITIAL_PURCHASE'), '')).status).toBe(401);
    expect((await status(f.parent)).plan).toBe('free');
  });

  it('turns Plus on and off, once per event id', async () => {
    const f = await makeFamily();
    expect((await postRc(rcEvent(f.familyId, 'rc_2', 'INITIAL_PURCHASE'))).status).toBe(200);
    expect((await status(f.parent)).plan).toBe('plus');
    expect((await status(f.parent)).source).toBe('revenuecat');
    expect((await postRc(rcEvent(f.familyId, 'rc_2', 'INITIAL_PURCHASE'))).body.duplicate).toBe(true);

    const expired = await postRc(rcEvent(f.familyId, 'rc_3', 'EXPIRATION', { event_timestamp_ms: Date.now() + 1000 }));
    expect(expired.status).toBe(200);
    expect((await status(f.parent)).plan).toBe('free');
  });

  it('ignores events for other entitlements', async () => {
    const f = await makeFamily();
    await postRc(rcEvent(f.familyId, 'rc_4', 'INITIAL_PURCHASE', { entitlement_ids: ['something_else'] }));
    expect((await status(f.parent)).plan).toBe('free');
  });
});
