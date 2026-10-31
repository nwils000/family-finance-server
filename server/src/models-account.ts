// Models for account security and billing. Kept apart from models.ts so the core
// game models stay small; services are the only importers (see guards.test.ts).
import mongoose, { Schema } from 'mongoose';
import { PLANS } from '@kk/shared';

const { model } = mongoose;
const id = Schema.Types.ObjectId;

/** Single-use, hashed, expiring password reset link (ported from Mentis models/PasswordResetToken). */
const passwordResetTokenSchema = new Schema(
  {
    userId: { type: id, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, expires: 0 },
    // Claimed with a conditional update (used: false -> true), so two tabs can never both use it.
    used: { type: Boolean, default: false, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
export const PasswordResetToken = model('PasswordResetToken', passwordResetTokenSchema);

/**
 * A refresh token that was already rotated. Seeing one again means it was copied:
 * the session owner and a thief both hold it, so every session of that user ends.
 */
const spentRefreshTokenSchema = new Schema(
  {
    userId: { type: id, required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, expires: 0 },
    // A spent token may start ONE grace session (the two-tabs race); claimed with a
    // conditional update so a burst of replays cannot mint a session each.
    graceUsed: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
export const SpentRefreshToken = model('SpentRefreshToken', spentRefreshTokenSchema);

/** Access tokens minted at or before `at` are refused (password change, sign out everywhere, reuse). */
const sessionCutoffSchema = new Schema({
  userId: { type: id, required: true, unique: true },
  at: { type: Date, required: true },
});
export const SessionCutoff = model('SessionCutoff', sessionCutoffSchema);

/** An access token ended early by sign out. Kept until the token would have expired anyway. */
const revokedJtiSchema = new Schema({
  jti: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, expires: 0 },
});
export const RevokedJti = model('RevokedJti', revokedJtiSchema);

/**
 * Single-use, hashed link that proves a grown-up owns their email. `email` is the
 * address it was sent to, so a link never verifies an address it was not sent to.
 */
const emailVerificationTokenSchema = new Schema(
  {
    userId: { type: id, ref: 'User', required: true, index: true },
    email: { type: String, required: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, expires: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
export const EmailVerificationToken = model('EmailVerificationToken', emailVerificationTokenSchema);

/**
 * A grown-up's invite for another grown-up to join the family. The family code
 * only lets KIDS sign in; a grown-up account needs one of these. Single-use,
 * claimed with a conditional update (usedAt: null -> now), 7 days.
 */
const coParentInviteSchema = new Schema(
  {
    familyId: { type: id, ref: 'Family', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    createdBy: { type: id, ref: 'User', required: true },
    expiresAt: { type: Date, required: true, expires: 0 },
    usedAt: { type: Date, default: null },
    usedBy: { type: id, ref: 'User', default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
export const CoParentInvite = model('CoParentInvite', coParentInviteSchema);

/** A grown-up's Google or Apple identity. The provider's `sub` is the stable key, never the email. */
const socialIdentitySchema = new Schema(
  {
    provider: { type: String, enum: ['google', 'apple'], required: true },
    subject: { type: String, required: true },
    userId: { type: id, ref: 'User', required: true, index: true },
  },
  { timestamps: true },
);
socialIdentitySchema.index({ provider: 1, subject: 1 }, { unique: true });
export const SocialIdentity = model('SocialIdentity', socialIdentitySchema);

/** Server-issued Sign in with Apple nonce, consumed once (Mentis keeps these in Redis). */
const appleNonceSchema = new Schema({
  nonce: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, expires: 0 },
});
export const AppleNonce = model('AppleNonce', appleNonceSchema);

/**
 * The family's subscription. One per family. Read only through
 * services/billing.ts getFamilyPlan(), which decides what the stored state means.
 */
const entitlementSchema = new Schema(
  {
    familyId: { type: id, ref: 'Family', required: true, unique: true },
    plan: { type: String, enum: PLANS, default: 'free' },
    status: { type: String, enum: ['active', 'past_due', 'cancelled', 'inactive'], default: 'inactive' },
    source: { type: String, enum: ['stripe', 'revenuecat', 'manual', null], default: null },
    currentPeriodEnd: { type: Date, default: null },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    stripeCustomerId: { type: String, default: null, index: true },
    stripeSubscriptionId: { type: String, default: null },
    /** Provider timestamp of the last event applied, so a late, older webhook never overwrites a newer one. */
    lastEventAt: { type: Date, default: null },
  },
  { timestamps: true },
);
export const Entitlement = model('Entitlement', entitlementSchema);

/** Webhook idempotency: one row per provider event id (Mentis models/WebhookEvent). */
const billingEventSchema = new Schema(
  {
    provider: { type: String, enum: ['stripe', 'revenuecat'], required: true },
    eventId: { type: String, required: true },
    type: String,
    status: { type: String, enum: ['processing', 'completed', 'failed'], required: true },
    attempts: { type: Number, default: 0 },
    error: String,
  },
  { timestamps: true },
);
billingEventSchema.index({ provider: 1, eventId: 1 }, { unique: true });
// Keep 90 days of history for support, then let Mongo clean up.
billingEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 86_400 });
export const BillingEvent = model('BillingEvent', billingEventSchema);
