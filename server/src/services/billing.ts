// Kapital Plus: what plan a family is on, the plan gates every service calls, and
// keeping the family's Entitlement in step with Stripe (web) and RevenueCat (app
// stores). Ported from Mentis: getEffectiveTier + SUBSCRIPTION_GRACE_DAYS
// (subscriptionLimitsService), the webhook idempotency claim
// (revenueCatEventProcessor / stripeWebhookController), mapStripeStatusToUserEnum,
// and the RevenueCat Authorization check (revenueCatWebhookController).
//
// Every piece is off until its keys are set: no keys means every family is on
// Free and the billing endpoints answer 501, so local dev keeps working.
import crypto from 'crypto';
import Stripe from 'stripe';
import { Types } from 'mongoose';
import {
  PAID_PLANS, PLAN_LIMITS, PLAN_LIMIT_CODE, PLAN_NAMES, PLUS_ENTITLEMENT, canAddMore, planAllows, planLimit,
  type Plan, type PlanFeature, type PlanLimitKey,
} from '@kk/shared';
import { config } from '../config.js';
import { HttpError } from '../http.js';
import { User } from '../models.js';
import { BillingEvent, Entitlement } from '../models-account.js';
import { familyOf, type Actor } from './access.js';

type EntitlementDoc = InstanceType<typeof Entitlement>;
type Source = 'stripe' | 'revenuecat' | 'manual';
type Status = 'active' | 'past_due' | 'cancelled' | 'inactive';

const DAY_MS = 86_400_000;
/** How long a paid state survives with no fresh word from the provider (Mentis SUBSCRIPTION_GRACE_DAYS). */
export const GRACE_DAYS = { staleActiveRevenueCat: 10, staleActiveStripe: 18, pastDue: 14 } as const;

const log = (level: 'info' | 'warn' | 'error', msg: string, extra: object = {}) =>
  console[level === 'info' ? 'log' : level](JSON.stringify({ level, msg, ...extra }));

/* ---------- The plan a family is on ---------- */

/**
 * What a stored entitlement means right now. Pure, so it is easy to test, and the
 * ONE place expiry and grace are decided (Mentis getEffectiveTier).
 */
export const effectivePlan = (e: Pick<EntitlementDoc, 'plan' | 'status' | 'source' | 'currentPeriodEnd' | 'cancelAtPeriodEnd'> | null, now = Date.now()): Plan => {
  if (!e || e.plan !== 'plus') return 'free';
  const end = e.currentPeriodEnd ? new Date(e.currentPeriodEnd).getTime() : null;
  switch (e.status) {
    case 'active': {
      // A paid row with no period end looks exactly like a lost webhook. Only a deliberate comp may have one.
      if (end === null) return e.source === 'manual' ? 'plus' : 'free';
      // Cancelled at period end and the period is over: the EXPIRATION webhook was missed.
      if (e.cancelAtPeriodEnd && end < now) return 'free';
      const grace = e.source === 'revenuecat' ? GRACE_DAYS.staleActiveRevenueCat : GRACE_DAYS.staleActiveStripe;
      return now - end > grace * DAY_MS ? 'free' : 'plus';
    }
    case 'past_due':
      return end !== null && now < end + GRACE_DAYS.pastDue * DAY_MS ? 'plus' : 'free';
    case 'cancelled':
      return end !== null && end > now ? 'plus' : 'free';
    default:
      return 'free';
  }
};

/**
 * True while a paid subscription will charge again (it renews and has not been cancelled).
 * Deleting a family is refused then, so a deleted family is never billed.
 */
export const hasRenewingSubscription = async (familyId: Types.ObjectId) => {
  const e = await Entitlement.findOne({ familyId }).lean();
  return !!e && (e.source === 'stripe' || e.source === 'revenuecat') && (e.status === 'active' || e.status === 'past_due') && !e.cancelAtPeriodEnd;
};

/** Forget a deleted family's subscription row (only after hasRenewingSubscription said no). */
export const forgetEntitlement = (familyId: Types.ObjectId) => Entitlement.deleteOne({ familyId });

export const getFamilyPlan = async (familyId: Types.ObjectId | string): Promise<Plan> =>
  effectivePlan(await Entitlement.findOne({ familyId }).lean());

const LIMIT_COPY: Record<PlanLimitKey, (n: number) => string> = {
  kids: (n) => `The Free plan has room for ${n} kids. Kapital Plus has room for the whole crew.`,
  teamGoals: (n) => `The Free plan runs ${n} team goal at a time. Kapital Plus lets you run as many as you like.`,
};
const FEATURE_COPY: Record<PlanFeature, string> = {
  rocket: 'The rocket fund is part of Kapital Plus.',
  teamGoals: 'Team goals are part of Kapital Plus.',
  assists: 'Helper points are part of Kapital Plus.',
};
const planError = (message: string) => new HttpError(402, message, PLAN_LIMIT_CODE);

/** Refuse adding one more `key` when the family already has `currentCount` and its plan is full. */
export const assertWithinLimit = async (actor: Actor, key: PlanLimitKey, currentCount: number) => {
  const plan = await getFamilyPlan(familyOf(actor));
  if (!canAddMore(plan, key, currentCount)) throw planError(LIMIT_COPY[key](planLimit(plan, key) ?? 0));
};

/** Refuse a whole feature the family's plan does not include. */
export const assertPlanFeature = async (actor: Actor, feature: PlanFeature) => {
  if (!planAllows(await getFamilyPlan(familyOf(actor)), feature)) throw planError(FEATURE_COPY[feature]);
};

/* ---------- Status for the client ---------- */

let stripeClient: Stripe | null = null;
const stripe = () => (config.stripe.secretKey ? (stripeClient ??= new Stripe(config.stripe.secretKey)) : null);
const checkoutReady = () => !!(stripe() && config.stripe.pricePlus);

export const billingStatus = async (actor: Actor) => {
  const familyId = familyOf(actor);
  const [e, kids] = await Promise.all([Entitlement.findOne({ familyId }).lean(), User.countDocuments({ familyId, role: 'kid' })]);
  const plan = effectivePlan(e);
  return {
    plan,
    planName: PLAN_NAMES[plan],
    rules: PLAN_LIMITS[plan],
    status: plan === 'plus' ? (e?.status ?? 'active') : 'inactive',
    source: plan === 'plus' ? (e?.source ?? null) : null,
    renewsAt: plan === 'plus' ? (e?.currentPeriodEnd ?? null) : null,
    cancelAtPeriodEnd: plan === 'plus' ? !!e?.cancelAtPeriodEnd : false,
    usage: { kids },
    web: { checkout: checkoutReady(), portal: !!(stripe() && e?.stripeCustomerId) },
  };
};

/* ---------- Stripe checkout and portal (web) ---------- */

const stripeOff = () => new HttpError(501, 'Payments are not set up on this server yet', 'NOT_CONFIGURED');

/** Reuse one Stripe customer per family so the portal and webhooks always line up. */
const stripeCustomerFor = async (actor: Actor, s: Stripe) => {
  const familyId = familyOf(actor);
  const e = await Entitlement.findOneAndUpdate({ familyId }, { $setOnInsert: { familyId } }, { upsert: true, new: true });
  if (e.stripeCustomerId) return e.stripeCustomerId;
  const parent = await User.findById(actor.userId).select('email name');
  const customer = await s.customers.create(
    { email: parent?.email ?? undefined, name: parent?.name, metadata: { familyId: String(familyId) } },
    { idempotencyKey: `kk-customer-${familyId}` },
  );
  // Conditional so two checkouts at once keep the first customer.
  const won = await Entitlement.findOneAndUpdate({ familyId, stripeCustomerId: null }, { stripeCustomerId: customer.id }, { new: true });
  return won?.stripeCustomerId ?? (await Entitlement.findOne({ familyId }))!.stripeCustomerId!;
};

/** Free for everyone (PAID_PLANS off): no billing action runs, even if provider keys get set. */
const assertPaidPlans = () => {
  if (!PAID_PLANS) throw new HttpError(501, 'Kid Kapital is free for everyone right now', 'NOT_CONFIGURED');
};

export const createCheckout = async (actor: Actor) => {
  assertPaidPlans();
  const s = stripe();
  if (!s || !config.stripe.pricePlus) throw stripeOff();
  if ((await getFamilyPlan(familyOf(actor))) === 'plus') throw new HttpError(409, 'Your family already has Kapital Plus', 'ALREADY_PLUS');
  const familyId = String(familyOf(actor));
  const session = await s.checkout.sessions.create({
    mode: 'subscription',
    customer: await stripeCustomerFor(actor, s),
    line_items: [{ price: config.stripe.pricePlus, quantity: 1 }],
    client_reference_id: familyId,
    metadata: { familyId },
    subscription_data: { metadata: { familyId } },
    allow_promotion_codes: true,
    success_url: `${config.appUrl}/parent/settings?plus=welcome`,
    cancel_url: `${config.appUrl}/parent/settings`,
  });
  if (!session.url) throw stripeOff();
  return { url: session.url };
};

export const createPortal = async (actor: Actor) => {
  assertPaidPlans();
  const s = stripe();
  if (!s) throw stripeOff();
  const e = await Entitlement.findOne({ familyId: familyOf(actor) });
  if (e?.source === 'revenuecat') throw new HttpError(409, 'Your plan is managed in the App Store or Google Play', 'MANAGED_IN_STORE');
  if (!e?.stripeCustomerId) throw new HttpError(404, 'There is no web subscription to manage yet');
  const portal = await s.billingPortal.sessions.create({ customer: e.stripeCustomerId, return_url: `${config.appUrl}/parent/settings` });
  return { url: portal.url };
};

/* ---------- Applying provider state to the entitlement ---------- */

interface EntitlementUpdate {
  status: Status;
  currentPeriodEnd?: Date | null;
  cancelAtPeriodEnd?: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

/**
 * The one write path for provider state. Applies only when this event is not
 * older than the last one applied (webhooks arrive out of order), and never lets
 * one provider's lapse cancel a family's live Plus bought through the other.
 */
const applyEntitlement = async (familyId: Types.ObjectId, source: Exclude<Source, 'manual'>, update: EntitlementUpdate, eventAt: Date) => {
  const current = await Entitlement.findOneAndUpdate({ familyId }, { $setOnInsert: { familyId } }, { upsert: true, new: true });
  const live = effectivePlan(current) === 'plus';
  if (live && current.source && current.source !== source && update.status === 'inactive') {
    log('warn', 'ignored a lapse from the other billing provider', { familyId: String(familyId), source, current: current.source });
    return;
  }
  const plan: Plan = update.status === 'inactive' ? 'free' : 'plus';
  const res = await Entitlement.updateOne(
    { _id: current._id, $or: [{ lastEventAt: null }, { lastEventAt: { $lte: eventAt } }] },
    { $set: { ...update, plan, source, lastEventAt: eventAt } },
  );
  if (!res.matchedCount) log('info', 'skipped an out-of-order billing event', { familyId: String(familyId), source });
};

const asFamilyId = (value: unknown) => (typeof value === 'string' && Types.ObjectId.isValid(value) && /^[a-f0-9]{24}$/i.test(value) ? new Types.ObjectId(value) : null);

/* ---------- Webhook idempotency (Mentis WebhookEvent claim) ---------- */

const STALE_PROCESSING_MS = 5 * 60_000;

/**
 * Claim an event id before doing anything. A completed event is a duplicate (200,
 * nothing done). An event another worker is processing right now answers 409 so
 * the provider retries later. A failed or stuck one can be claimed again.
 */
const processOnce = async (provider: 'stripe' | 'revenuecat', eventId: string, type: string, work: () => Promise<void>) => {
  try {
    await BillingEvent.findOneAndUpdate(
      { provider, eventId, $or: [{ status: 'failed' }, { status: 'processing', updatedAt: { $lt: new Date(Date.now() - STALE_PROCESSING_MS) } }] },
      { $set: { type, status: 'processing' }, $inc: { attempts: 1 }, $unset: { error: '' } },
      { upsert: true, new: true },
    );
  } catch (err) {
    if ((err as { code?: number }).code !== 11000) throw err;
    const existing = await BillingEvent.findOne({ provider, eventId }).lean();
    if (existing?.status === 'completed') return { received: true, duplicate: true };
    throw new HttpError(409, 'Event is already being processed', 'IN_FLIGHT');
  }
  try {
    await work();
  } catch (err) {
    await BillingEvent.updateOne({ provider, eventId }, { status: 'failed', error: String((err as Error).message).slice(0, 300) });
    throw err;
  }
  await BillingEvent.updateOne({ provider, eventId }, { status: 'completed' });
  return { received: true };
};

/* ---------- Stripe webhook ---------- */

/** Stripe's many statuses onto ours (Mentis mapStripeStatusToUserEnum). */
const mapStripeStatus = (s: Stripe.Subscription.Status): Status => {
  switch (s) {
    case 'active':
    case 'trialing':
      return 'active';
    case 'past_due':
    case 'unpaid':
      return 'past_due';
    case 'canceled':
      return 'cancelled';
    default:
      return 'inactive';
  }
};

const customerIdOf = (c: string | { id: string } | null) => (typeof c === 'string' ? c : (c?.id ?? null));

const familyForStripe = async (metadataFamilyId: unknown, customerId: string | null) => {
  const fromMeta = asFamilyId(metadataFamilyId);
  if (fromMeta) return fromMeta;
  if (!customerId) return null;
  return (await Entitlement.findOne({ stripeCustomerId: customerId }).select('familyId').lean())?.familyId ?? null;
};

const applyStripeEvent = async (event: Stripe.Event) => {
  const at = new Date(event.created * 1000);
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const familyId = await familyForStripe(session.metadata?.familyId ?? session.client_reference_id, customerIdOf(session.customer));
      if (!familyId) return log('warn', 'stripe checkout with no family', { eventId: event.id });
      // Bind the ids only. The subscription events carry the status, so no Stripe call is needed here.
      await Entitlement.updateOne(
        { familyId },
        { $set: { stripeCustomerId: customerIdOf(session.customer), stripeSubscriptionId: customerIdOf(session.subscription) } },
        { upsert: true },
      );
      return;
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      const customerId = customerIdOf(sub.customer);
      const familyId = await familyForStripe(sub.metadata?.familyId, customerId);
      if (!familyId) return log('warn', 'stripe subscription with no family', { eventId: event.id });
      const periodEnd = sub.items?.data?.[0]?.current_period_end;
      await applyEntitlement(
        familyId,
        'stripe',
        {
          status: event.type === 'customer.subscription.deleted' ? 'inactive' : mapStripeStatus(sub.status),
          currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
          cancelAtPeriodEnd: !!sub.cancel_at_period_end,
          ...(customerId ? { stripeCustomerId: customerId } : {}),
          stripeSubscriptionId: sub.id,
        },
        at,
      );
      return;
    }
    default:
      return; // Not one we act on; still recorded so a retry is a no-op.
  }
};

/** POST /billing/webhooks/stripe. `rawBody` must be the exact bytes Stripe signed. */
export const stripeWebhook = async (rawBody: unknown, signature: string | undefined) => {
  const s = stripe();
  if (!s || !config.stripe.webhookSecret) throw stripeOff();
  if (!signature || !Buffer.isBuffer(rawBody)) throw new HttpError(400, 'Missing signature');
  let event: Stripe.Event;
  try {
    event = s.webhooks.constructEvent(rawBody, signature, config.stripe.webhookSecret);
  } catch {
    log('warn', 'stripe webhook signature rejected');
    throw new HttpError(400, 'Invalid signature', 'BAD_SIGNATURE');
  }
  return processOnce('stripe', event.id, event.type, () => applyStripeEvent(event));
};

/* ---------- RevenueCat webhook and sync (app stores) ---------- */

export interface RevenueCatEvent {
  id: string;
  type: string;
  app_user_id?: string;
  original_app_user_id?: string;
  aliases?: string[];
  entitlement_ids?: string[] | null;
  expiration_at_ms?: number | null;
  event_timestamp_ms?: number;
  cancel_reason?: string;
}

/** Constant-time compare on digests, so not even the length leaks (Mentis r32 H24). */
const sameSecret = (a: string, b: string) =>
  crypto.timingSafeEqual(crypto.createHash('sha256').update(a).digest(), crypto.createHash('sha256').update(b).digest());

/** What a RevenueCat event means for the family's entitlement, or null to ignore it. */
const revenueCatUpdate = (ev: RevenueCatEvent): EntitlementUpdate | null => {
  const periodEnd = ev.expiration_at_ms ? new Date(ev.expiration_at_ms) : null;
  switch (ev.type) {
    case 'INITIAL_PURCHASE':
    case 'RENEWAL':
    case 'UNCANCELLATION':
    case 'PRODUCT_CHANGE':
    case 'SUBSCRIPTION_EXTENDED':
    case 'SUBSCRIPTION_RESUMED':
    case 'TEMPORARY_ENTITLEMENT_GRANT':
      return { status: 'active', currentPeriodEnd: periodEnd, cancelAtPeriodEnd: false };
    case 'CANCELLATION':
      // A refund through support ends access now; a normal cancel keeps it until the period ends.
      return ev.cancel_reason === 'CUSTOMER_SUPPORT' ? { status: 'inactive', currentPeriodEnd: periodEnd } : { status: 'cancelled', currentPeriodEnd: periodEnd, cancelAtPeriodEnd: true };
    case 'BILLING_ISSUE':
      return { status: 'past_due', currentPeriodEnd: periodEnd };
    case 'EXPIRATION':
    case 'SUBSCRIPTION_PAUSED':
      return { status: 'inactive', currentPeriodEnd: periodEnd };
    default:
      return null; // TEST, TRANSFER, aliases and the rest. /billing/sync re-reads the truth when needed.
  }
};

/** POST /billing/webhooks/revenuecat. The app user id IS the family id (one subscription per family). */
export const revenueCatWebhook = async (authorization: string | undefined, body: { event?: RevenueCatEvent } | undefined) => {
  const secret = config.revenueCat.webhookSecret;
  if (!secret) throw new HttpError(501, 'App store billing is not set up on this server yet', 'NOT_CONFIGURED');
  if (!authorization || !sameSecret(authorization.replace(/^Bearer\s+/i, '').trim(), secret)) {
    log('warn', 'revenuecat webhook authorization rejected');
    throw new HttpError(401, 'Unauthorized');
  }
  const ev = body?.event;
  if (!ev || typeof ev.id !== 'string' || typeof ev.type !== 'string') throw new HttpError(400, 'Invalid event');
  return processOnce('revenuecat', ev.id, ev.type, async () => {
    if (ev.entitlement_ids && !ev.entitlement_ids.includes(PLUS_ENTITLEMENT)) return;
    const update = revenueCatUpdate(ev);
    if (!update) return;
    const familyId = [ev.app_user_id, ev.original_app_user_id, ...(ev.aliases ?? [])].map(asFamilyId).find(Boolean);
    if (!familyId) return log('warn', 'revenuecat event with no family', { eventId: ev.id, type: ev.type });
    await applyEntitlement(familyId, 'revenuecat', update, new Date(ev.event_timestamp_ms ?? Date.now()));
  });
};

/**
 * After a native purchase the webhook can lag a few seconds, so the app asks the
 * server to re-read RevenueCat directly (Mentis syncRevenueCat). The client never
 * says what it bought; the server asks RevenueCat.
 */
export const syncRevenueCat = async (actor: Actor) => {
  assertPaidPlans();
  const key = config.revenueCat.secretApiKey;
  if (!key) throw new HttpError(501, 'App store billing is not set up on this server yet', 'NOT_CONFIGURED');
  const familyId = familyOf(actor);
  const res = await fetch(`https://api.revenuecat.com/v1/subscribers/${familyId}`, {
    headers: { Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new HttpError(502, 'Could not reach the app store right now. Try again in a moment.');
  const data = (await res.json()) as { subscriber?: { entitlements?: Record<string, { expires_date: string | null }> } };
  const ent = data.subscriber?.entitlements?.[PLUS_ENTITLEMENT];
  const end = ent?.expires_date ? new Date(ent.expires_date) : null;
  const active = !!ent && (end === null || end.getTime() > Date.now());
  const current = await Entitlement.findOne({ familyId }).lean();
  if (active) {
    // RevenueCat lifetime grants have no end; store a far one so effectivePlan keeps them.
    await applyEntitlement(familyId, 'revenuecat', { status: 'active', currentPeriodEnd: end ?? new Date(Date.now() + 100 * 365 * DAY_MS), cancelAtPeriodEnd: false }, new Date());
  } else if (current?.source === 'revenuecat') {
    await applyEntitlement(familyId, 'revenuecat', { status: 'inactive', currentPeriodEnd: end }, new Date());
  }
  return billingStatus(actor);
};
