// Creating grown-up and kid accounts, inviting grown-ups, and checking credentials.
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import type { z } from 'zod';
import { LEGAL_VERSIONS, type AvatarId } from '@kk/shared';
import { config } from '../config.js';
import { HttpError, notFound } from '../http.js';
import { Family, User } from '../models.js';
import { CoParentInvite } from '../models-account.js';
import type { kidLoginBody, loginBody, signupBody, joinBody } from '../schemas.js';
import { appLink, newToken, sha256 } from '../tokens.js';
import { familyOf, type Actor } from './access.js';
import { assertEmailVerified, sendVerificationLink, startsVerified } from './email-verification.js';

const PASSWORD_ROUNDS = 12;
const PIN_ROUNDS = 10;

/**
 * Real bcrypt hashes of random strings nobody knows, at the same cost as real ones.
 * A login for an unknown email (or a Google-only account) still runs one full
 * compare, so the reply time never says whether an account exists (Mentis DUMMY_HASH).
 */
export const DUMMY_PASSWORD_HASH = '$2a$12$6OKDnrgp4SoxoIMFbKN5XeVEl4CtaPJDDzNHD7erOp8y9Y7slXZk.';
const DUMMY_PIN_HASH = '$2a$10$G97fEp9t2udKEiTLxIbjT.9hl4qGvfclYeW8zQ7r.ZRY4o0WKKXci';

export const hashPin = (pin: string) => bcrypt.hash(pin, PIN_ROUNDS);
/** The one way a grown-up password is hashed (signup, join, reset, change). */
export const hashPassword = (password: string) => bcrypt.hash(password, PASSWORD_ROUNDS);
/**
 * The one way a password or PIN is compared to its hash. Always compares, against a
 * dummy of the same cost when there is no hash, so a missing account or a missing
 * password takes as long as a wrong one.
 */
export const checkSecret = async (secret: string, hash: string | null | undefined, dummy = DUMMY_PASSWORD_HASH) => {
  const ok = await bcrypt.compare(secret, hash || dummy);
  return !!hash && ok;
};

// No 0/O/1/I so kids can read it off a screen.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const newFamilyCode = async () => {
  for (;;) {
    const code = Array.from(crypto.randomBytes(6), (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('');
    if (!(await Family.exists({ code }))) return code;
  }
};

export const findFamilyByCode = async (code: string) => {
  const family = await Family.findOne({ code });
  if (!family) throw notFound('No family with that code');
  return family;
};

interface NewParent {
  name: string;
  email: string;
  password?: string;
  /** True only when a provider (Google, Apple) verified the email itself. */
  emailVerified?: boolean;
  /** The grown-up said they are a parent or guardian and agreed to the Terms and Privacy Policy. */
  acceptLegal?: boolean;
}

const emailTaken = () => new HttpError(409, 'That email already has an account');

/**
 * No password means a Google or Apple sign-in account; "forgot password" can add one
 * later. An email/password account gets a verification link right after it is made.
 */
const createParent = async (familyId: unknown, body: NewParent, avatar: AvatarId) => {
  // Every way a grown-up account is made (email, invite, Google, Apple) comes through here,
  // so no account exists without the parent's agreement on record.
  if (body.acceptLegal !== true) {
    throw new HttpError(400, 'Please confirm you are a parent or guardian and agree to the Terms and Privacy Policy.', 'LEGAL_REQUIRED');
  }
  if (await User.exists({ email: body.email })) throw emailTaken();
  const user = await User.create({
    familyId,
    role: 'parent',
    name: body.name,
    email: body.email,
    avatar,
    passwordHash: body.password ? await hashPassword(body.password) : undefined,
    emailVerifiedAt: startsVerified(body.emailVerified) ? new Date() : null,
    legalAccepted: { ...LEGAL_VERSIONS, at: new Date() },
  });
  if (!user.emailVerifiedAt) sendVerificationLink(user);
  return user;
};

/** A new family with its first grown-up. Shared by email signup and social sign-in. */
export const startFamily = async (familyName: string, parent: NewParent) => {
  const family = await Family.create({ name: familyName, code: await newFamilyCode() });
  return createParent(family._id, parent, 'owl');
};

export const signup = (body: z.infer<typeof signupBody>) => startFamily(body.familyName, body);

/* ---------- Grown-up invites (the family code is for kids only) ---------- */

const INVITE_TTL_MS = 7 * 86_400_000;
const INVITE_INVALID = 'That invite has expired or was already used. Ask the grown-up who sent it for a new one.';
const liveInvite = (token: string) => ({ tokenHash: sha256(token), usedAt: null, expiresAt: { $gt: new Date() } });

/**
 * A single-use link for one more grown-up. The token is shown once, to the grown-up
 * who asked, and only its hash is stored. Needs a verified email: an invite brings a
 * new adult to the kids' data, so the inviter must be reachable first.
 */
export const createInvite = async (actor: Actor) => {
  await assertEmailVerified(actor);
  const token = newToken();
  const expiresAt = new Date(Date.now() + INVITE_TTL_MS);
  await CoParentInvite.create({ familyId: familyOf(actor), tokenHash: sha256(token), createdBy: actor.userId, expiresAt });
  return { url: appLink('/join', 'invite', token), expiresAt };
};

/** Non-consuming check so the join page can name the family, or say the link is dead. */
export const checkInvite = async (token: string) => {
  const invite = await CoParentInvite.findOne(liveInvite(token)).select('familyId').lean();
  const family = invite && (await Family.findById(invite.familyId).select('name').lean());
  return family ? { valid: true as const, familyName: family.name } : { valid: false as const };
};

/**
 * A second grown-up joins with an invite. Shared by email join and social sign-in.
 * The claim is one conditional update (usedAt: null -> now), so two tabs or two
 * people holding the same link can never both join with it.
 */
export const joinWithInvite = async (token: string, parent: NewParent) => {
  // Checked before the claim so a typo'd, already-used email does not burn the invite.
  if (await User.exists({ email: parent.email })) throw emailTaken();
  const invite = await CoParentInvite.findOneAndUpdate(liveInvite(token), { $set: { usedAt: new Date() } }, { new: true });
  if (!invite) throw new HttpError(400, INVITE_INVALID, 'INVITE_INVALID');
  try {
    if (!(await Family.exists({ _id: invite.familyId }))) throw new HttpError(400, INVITE_INVALID, 'INVITE_INVALID');
    const user = await createParent(invite.familyId, parent, 'bear');
    await CoParentInvite.updateOne({ _id: invite._id }, { $set: { usedBy: user._id } });
    return user;
  } catch (err) {
    // Nobody joined, so give the invite back.
    await CoParentInvite.updateOne({ _id: invite._id, usedBy: null }, { $set: { usedAt: null } }).catch(() => undefined);
    throw err;
  }
};

export const joinFamily = (body: z.infer<typeof joinBody>) => joinWithInvite(body.invite, body);

/**
 * A new kid sign-in code, for when the old one got around. Kids already signed in
 * stay signed in; the next sign-in needs the new code.
 */
export const rotateFamilyCode = async (actor: Actor) => {
  const code = await newFamilyCode();
  const family = await Family.findByIdAndUpdate(familyOf(actor), { $set: { code } }, { new: true });
  if (!family) throw notFound('Family not found');
  return { code: family.code };
};

/* ---------- Sign in ---------- */

/** Wrong tries before a lock. */
const MAX_FAILS = 5;
/** Grown-ups: a flat lock; a reset link clears it. Kids: each lock is longer, and only a grown-up changing the PIN resets the ladder. */
const LOCK_LADDER_MS = { parent: [5 * 60_000], kid: [5 * 60_000, 60 * 60_000, 24 * 60 * 60_000] } as const;

type Role = 'parent' | 'kid';
const tooManyTries = (role: Role) =>
  new HttpError(
    429,
    role === 'kid' ? 'Too many tries. Ask a grown-up to help, or try again later.' : 'Too many tries. Take a breather and try again in a few minutes.',
    'LOCKED',
  );

/**
 * Turn a full set of failures into a lock, atomically (Mentis incLoginAttempts): the
 * filter matches only while failedLogins is at the limit, and the update resets it,
 * so of any number of concurrent failures exactly one sets the lock.
 */
const lockIfSpent = (userId: unknown, role: Role) => {
  const ladder = LOCK_LADDER_MS[role];
  return User.updateOne({ _id: userId, failedLogins: { $gte: MAX_FAILS } }, [
    {
      $set: {
        lockedUntil: { $add: [new Date(), { $arrayElemAt: [[...ladder], { $min: [{ $ifNull: ['$lockouts', 0] }, ladder.length - 1] }] }] },
        lockouts: { $add: [{ $ifNull: ['$lockouts', 0] }, 1] },
        failedLogins: 0,
      },
    },
  ]);
};

/**
 * One credential check for both kinds of login. Each try first CLAIMS an attempt
 * with a conditional increment, before the slow compare, so twenty parallel guesses
 * get five compares between them, not twenty: the rest are refused as locked.
 */
const verifySecret = async (user: InstanceType<typeof User>, secret: string, hash: string | null | undefined, wrong: string, dummy?: string) => {
  const role = user.role as Role;
  const claimed = await User.updateOne(
    { _id: user._id, failedLogins: { $lt: MAX_FAILS }, $or: [{ lockedUntil: null }, { lockedUntil: { $lte: new Date() } }] },
    { $inc: { failedLogins: 1 } },
  );
  if (!claimed.modifiedCount) {
    // Every try is spoken for. Make sure a lock exists even if a claimed try never came back.
    await lockIfSpent(user._id, role);
    throw tooManyTries(role);
  }
  if (await checkSecret(secret, hash, dummy)) {
    await User.updateOne({ _id: user._id }, { $set: { failedLogins: 0, lockedUntil: null } });
    return user;
  }
  await lockIfSpent(user._id, role);
  throw new HttpError(401, wrong);
};

export const parentLogin = async (body: z.infer<typeof loginBody>) => {
  const user = await User.findOne({ email: body.email, role: 'parent' });
  if (!user) {
    await checkSecret(body.password, null);
    throw new HttpError(401, 'Wrong email or password');
  }
  return verifySecret(user, body.password, user.passwordHash, 'Wrong email or password');
};

export const kidLogin = async (body: z.infer<typeof kidLoginBody>) => {
  const family = await findFamilyByCode(body.code);
  const kid = await User.findOne({ _id: body.kidId, familyId: family._id, role: 'kid' });
  if (!kid) {
    await checkSecret(body.pin, null, DUMMY_PIN_HASH);
    throw new HttpError(401, 'Oops, wrong PIN');
  }
  return verifySecret(kid, body.pin, kid.pinHash, 'Oops, wrong PIN', DUMMY_PIN_HASH);
};

/** Public kid picker for the login screen: names and avatars only. */
export const familyPreview = async (code: string) => {
  const family = await findFamilyByCode(code);
  const kids = await User.find({ familyId: family._id, role: 'kid' }).select('name avatar').sort({ createdAt: 1 });
  return { name: family.name, kids: kids.map((k) => ({ id: String(k._id), name: k.name, avatar: k.avatar })) };
};

export const getUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new HttpError(401, 'Not signed in');
  return user;
};

/* ---------- Dev-only quick login (like Mentis's debug login) ---------- */

/** The seeded demo family (npm run seed). Dev quick login only ever reaches this family. */
const DEMO_CODE = 'DEMO42';

const assertDev = () => {
  // Third lock, behind the routes not being mounted and requireLocalDev.
  if (!config.devEndpoints) throw notFound();
};

/** Everyone in the demo family, for the dev account switcher. */
export const devAccounts = async () => {
  assertDev();
  const family = await Family.findOne({ code: DEMO_CODE });
  if (!family) throw new HttpError(404, 'No demo family yet. Run npm run seed.');
  const members = await User.find({ familyId: family._id }).sort({ role: -1, createdAt: 1 });
  return { accounts: members.map((m) => ({ id: String(m._id), name: m.name, role: m.role, avatar: m.avatar, hat: m.hat })) };
};

/** Sign in as any demo-family member without a password or PIN. */
export const devLogin = async (userId: string) => {
  assertDev();
  const family = await Family.findOne({ code: DEMO_CODE });
  const user = family && (await User.findOne({ _id: userId, familyId: family._id }));
  if (!user) throw notFound('Not a demo account');
  return user;
};
