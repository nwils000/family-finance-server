import type { z } from 'zod';
import { ageFromBirthYear, DEFAULT_FEATURES, FEATURES, type Features } from '@kk/shared';
import { notFound } from '../http.js';
import { Account, Family, LessonProgress, User } from '../models.js';
import type { giftBody, kidBody, kidUpdateBody, settingsBody } from '../schemas.js';
import { revokeAllSessions } from '../auth.js';
import { familyOf, resolveKid, type Actor } from './access.js';
import { hashPin } from './accounts.js';
import { assertWithinLimit } from './billing.js';
import { assertEmailVerified } from './email-verification.js';
import { ensureAccounts, move } from './money.js';
import { eraseKid } from './personal-data.js';
import { kidStats } from './stats.js';

const shapeFamily = (f: InstanceType<typeof Family>) => ({
  id: String(f._id),
  name: f.name,
  code: f.code,
  starValueCents: f.starValueCents,
  piggyRatePct: f.piggyRatePct,
  rocketMinPct: f.rocketMinPct,
  rocketMaxPct: f.rocketMaxPct,
  theme: f.theme,
  lessonRewardCents: f.lessonRewardCents ?? 0,
  levelUpBonusCents: f.levelUpBonusCents ?? 0,
  learnMode: (f.learnMode ?? 'open') as 'open' | 'assigned',
  // Read each switch by name: spreading a Mongoose subdocument copies its internals, not its fields.
  features: Object.fromEntries(FEATURES.map((k) => [k, f.features?.[k] ?? DEFAULT_FEATURES[k]])) as Features,
});

const shapeKid = async (kid: InstanceType<typeof User>) => {
  const accounts = await Account.find({ kidId: kid._id });
  const pot = (kind: string) => accounts.find((a) => a.kind === kind)?.balanceCents ?? 0;
  return {
    id: String(kid._id),
    name: kid.name,
    avatar: kid.avatar,
    balanceCents: kid.balanceCents,
    piggyCents: pot('piggy'),
    rocketCents: pot('rocket'),
    xp: kid.xp,
    starValueCents: kid.starValueCents ?? null,
    effortBoost: kid.effortBoost,
    assistPoints: kid.assistPoints,
    trusted: !!kid.trusted,
    age: ageFromBirthYear(kid.birthYear),
    lessonsDone: await LessonProgress.countDocuments({ kidId: kid._id }),
    hat: kid.hat,
    goal: kid.goal?.title ? { title: kid.goal.title, icon: kid.goal.icon, targetCents: kid.goal.targetCents } : null,
    ...(await kidStats(kid._id)),
  };
};

/** Age in, birth year stored, so the kid's lessons grow up with them. */
const birthYearFor = (age: number | null | undefined) => (age == null ? null : new Date().getFullYear() - age);

/** Everything the home screen needs in one request. A kid sees only themself. */
export const getHome = async (actor: Actor) => {
  const family = await Family.findById(familyOf(actor));
  if (!family) throw notFound('Family not found');
  const members = await User.find({ familyId: family._id }).sort({ createdAt: 1 });
  const kids = members.filter((m) => m.role === 'kid' && (actor.role === 'parent' || String(m._id) === actor.userId));
  return {
    family: shapeFamily(family),
    parents: members.filter((m) => m.role === 'parent').map((p) => ({ id: String(p._id), name: p.name, avatar: p.avatar })),
    kids: await Promise.all(kids.map(shapeKid)),
    // Everyone's name and avatar (no balances), so a kid can tag a sibling who helped.
    siblings: members.filter((m) => m.role === 'kid').map((k) => ({ id: String(k._id), name: k.name, avatar: k.avatar, hat: k.hat })),
  };
};

export const updateSettings = async (actor: Actor, { features, ...rest }: z.infer<typeof settingsBody>) => {
  // Flatten feature switches so flipping one never resets the others.
  const featureSet = Object.fromEntries(Object.entries(features ?? {}).map(([k, v]) => [`features.${k}`, v]));
  const family = await Family.findByIdAndUpdate(familyOf(actor), { $set: { ...rest, ...featureSet } }, { new: true, runValidators: true });
  if (!family) throw notFound('Family not found');
  return { family: shapeFamily(family) };
};

export const addKid = async (actor: Actor, body: z.infer<typeof kidBody>) => {
  // COPPA: a grown-up's verified contact comes before any kid's data is collected.
  await assertEmailVerified(actor);
  await assertWithinLimit(actor, 'kids', await User.countDocuments({ familyId: familyOf(actor), role: 'kid' }));
  const kid = await User.create({
    familyId: familyOf(actor),
    role: 'kid',
    name: body.name,
    avatar: body.avatar,
    pinHash: await hashPin(body.pin),
    birthYear: birthYearFor(body.age),
  });
  // Two adds at the same moment can both pass the check above. Re-check by creation
  // order (ObjectIds sort by time): whichever kid landed past the limit is removed,
  // so a family can never end up over its plan, however the requests race.
  try {
    await assertWithinLimit(actor, 'kids', await User.countDocuments({ familyId: kid.familyId, role: 'kid', _id: { $lt: kid._id } }));
  } catch (err) {
    await kid.deleteOne();
    throw err;
  }
  await ensureAccounts(kid.familyId, kid._id);
  return { kid: await shapeKid(kid) };
};

export const updateKid = async (actor: Actor, kidId: string, body: z.infer<typeof kidUpdateBody>) => {
  const kid = await resolveKid(actor, kidId);
  if (body.name) kid.name = body.name;
  if (body.avatar) kid.avatar = body.avatar;
  if (body.pin) {
    // A new PIN is a fresh start: clear every lock (the escalation ladder too, which
    // nothing else clears) and end every session the old PIN opened.
    kid.pinHash = await hashPin(body.pin);
    kid.failedLogins = 0;
    kid.lockedUntil = null;
    kid.lockouts = 0;
  }
  if (body.starValueCents !== undefined) kid.starValueCents = body.starValueCents;
  if (body.effortBoost !== undefined) kid.effortBoost = body.effortBoost;
  if (body.trusted !== undefined) kid.trusted = body.trusted;
  if (body.age !== undefined) kid.birthYear = birthYearFor(body.age);
  await kid.save();
  if (body.pin) await revokeAllSessions(String(kid._id));
  return { kid: await shapeKid(kid) };
};

export const removeKid = async (actor: Actor, kidId: string) => {
  const kid = await resolveKid(actor, kidId);
  // Everything that is the kid's goes, through the one owner (sessions, history, progress).
  await eraseKid(kid.familyId, kid._id);
};

/** A bonus (positive) or a deduction (negative) straight to a kid's wallet. */
export const giftKid = async (actor: Actor, kidId: string, body: z.infer<typeof giftBody>) => {
  const kid = await resolveKid(actor, kidId);
  await move({ familyId: kid.familyId, kidId: kid._id, amountCents: body.amountCents, kind: 'gift', label: body.label });
};
