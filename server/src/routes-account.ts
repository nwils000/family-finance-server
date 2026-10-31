// Account security, social sign-in and Kapital Plus billing endpoints. Thin like
// routes.ts: parse with zod, call a service, return its result. Mounted in app.ts
// BEFORE routes.ts, because routes.ts requires a session for everything after its
// public block; so every signed-in route here names requireAuth itself.
import express, { Router } from 'express';
import { Types } from 'mongoose';
import { endSession, issueSession, requireAuth, requireParent } from './auth.js';
import { handle, parse } from './http.js';
import * as S from './schemas-account.js';
import {
  accountDeleteLimiter,
  authLimiter,
  dataExportLimiter,
  linkCheckLimiter,
  resendVerificationLimiter,
  resetExecuteLimiter,
  resetRequestIpLimiter,
  resetRequestLimiter,
  strictLimiter,
  webhookLimiter,
} from './security.js';
import * as security from './services/account-security.js';
import { familyOf } from './services/access.js';
import * as billing from './services/billing.js';
import * as data from './services/personal-data.js';
import * as verification from './services/email-verification.js';
import * as social from './services/social.js';

/**
 * Stripe signs the exact bytes it sent, so its webhook must see the raw body.
 * Mounted before express.json() in app.ts.
 */
export const rawBodyRoutes = Router();
rawBodyRoutes.post(
  '/billing/webhooks/stripe',
  webhookLimiter,
  express.raw({ type: 'application/json', limit: '512kb' }),
  handle((req) => billing.stripeWebhook(req.body, req.get('stripe-signature'))),
);

export const accountRoutes = Router();
const r = accountRoutes;
const signedIn = requireAuth;
const parent = [requireAuth, requireParent];

// Password reset: always the same answer, whether or not the email has an account.
r.post('/auth/password/forgot', resetRequestIpLimiter, resetRequestLimiter, handle((req) => security.requestPasswordReset(parse(S.forgotBody, req.body))));
// POST with the token in the body: a token in a path would land in the request log.
r.post('/auth/password/reset/check', linkCheckLimiter, handle((req) => security.checkResetToken(parse(S.resetCheckBody, req.body).token)));
r.post('/auth/password/reset', resetExecuteLimiter, handle(async (req) => {
  await security.resetPassword(parse(S.resetBody, req.body));
  return { ok: true };
}));

// Email verification. The link works signed out (it may open on another device).
r.post('/auth/email/verify', linkCheckLimiter, handle((req) => verification.verifyEmail(parse(S.verifyEmailBody, req.body).token)));
r.post('/auth/email/resend', ...parent, resendVerificationLimiter, handle((req) => verification.resendVerification(req.auth)));

// Social sign-in for grown-ups. 501 NOT_CONFIGURED until the provider ids are set.
r.get('/auth/providers', handle(async () => social.socialProviders()));
r.post('/auth/google', authLimiter, handle(async (req, res) => issueSession(req, res, await social.googleSignIn(parse(S.googleBody, req.body)))));
r.get('/auth/apple/nonce', authLimiter, handle(() => social.issueAppleNonce()));
r.post('/auth/apple', authLimiter, handle(async (req, res) => issueSession(req, res, await social.appleSignIn(parse(S.appleBody, req.body)))));

// Signed in: both end every other session and hand this device a fresh one.
r.post('/auth/password/change', ...parent, strictLimiter, handle(async (req, res) =>
  issueSession(req, res, await security.changePassword(req.auth, parse(S.changePasswordBody, req.body))),
));
// Your data: download everything the family stored, or delete your account (the last
// grown-up takes the whole family with them). Deleting re-checks the password first.
r.get('/account/export', ...parent, dataExportLimiter, handle((req) => data.exportFamily(familyOf(req.auth))));
r.post('/account/delete', ...parent, accountDeleteLimiter, handle(async (req, res) => {
  await security.confirmPassword(req.auth, parse(S.deleteAccountBody, req.body).password);
  const result = await data.eraseParent(familyOf(req.auth), new Types.ObjectId(req.auth.userId));
  await endSession(req, res);
  return result;
}));
r.post('/auth/logout-all', signedIn, strictLimiter, handle(async (req, res) => issueSession(req, res, await security.signOutEverywhere(req.auth))));

// Kapital Plus
r.get('/billing/status', signedIn, handle((req) => billing.billingStatus(req.auth)));
r.post('/billing/checkout', ...parent, authLimiter, handle((req) => billing.createCheckout(req.auth)));
r.post('/billing/portal', ...parent, authLimiter, handle((req) => billing.createPortal(req.auth)));
r.post('/billing/sync', ...parent, authLimiter, handle((req) => billing.syncRevenueCat(req.auth)));
r.post('/billing/webhooks/revenuecat', webhookLimiter, handle((req) => billing.revenueCatWebhook(req.get('authorization'), req.body)));
