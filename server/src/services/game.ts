// XP, the daily chest, hats and dream goals. The only module that changes xp.
import type { Types } from 'mongoose';
import type { z } from 'zod';
import { assistPointsFor, assistXpFor, planAllows, CHEST_XP, hatUnlocked, levelFor, type HatId } from '@kk/shared';
import { HttpError } from '../http.js';
import { ChestOpen, Family, Milestone, MilestoneClaim, Purchase, User } from '../models.js';
import type { goalBody } from '../schemas.js';
import { assertFeature, resolveKid, type Actor } from './access.js';
import { getFamilyPlan } from './billing.js';
import { move } from './money.js';
import { questsForDay } from './quests.js';

/** Add XP and report whether the kid levelled up, so the client can throw a party. */
/**
 * The one way XP is earned. Crossing into a new level pays the family's level-up
 * bonus (once per level) and unlocks any level prizes, whatever earned the XP.
 */
export const awardXp = async (kidId: Types.ObjectId, xp: number) => {
  const before = await User.findOneAndUpdate({ _id: kidId, role: 'kid' }, { $inc: { xp } });
  if (!before) return { xp, levelUp: null, bonusCents: 0 };
  const from = levelFor(before.xp).level;
  const to = levelFor(before.xp + xp).level;
  if (to <= from) return { xp, levelUp: null, bonusCents: 0 };
  const family = await Family.findById(before.familyId).select('levelUpBonusCents');
  const bonus = family?.levelUpBonusCents ?? 0;
  for (let level = from + 1; level <= to && bonus > 0; level++) {
    await move({ familyId: before.familyId, kidId, amountCents: bonus, kind: 'bonus', label: `Level ${level} bonus` });
  }
  await unlockMilestones(before.familyId, kidId, 'level', to);
  return { xp, levelUp: to, bonusCents: bonus * (to - from) };
};

/**
 * Unlock every prize of `kind` the kid has now reached (helper points or level).
 * The unique claim makes each prize unlock once; it lands in the grown-up inbox.
 */
const unlockMilestones = async (familyId: Types.ObjectId, kidId: Types.ObjectId, kind: 'helper' | 'level', value: number) => {
  // Older milestones were all helper ones and have no kind stored.
  const kindFilter = kind === 'helper' ? { kind: { $ne: 'level' } } : { kind: 'level' };
  const milestones = await Milestone.find({ familyId, active: true, points: { $lte: value }, ...kindFilter });
  for (const m of milestones) {
    try {
      await MilestoneClaim.create({ familyId, kidId, milestoneId: m._id });
    } catch (err) {
      if ((err as { code?: number }).code === 11000) continue; // already unlocked
      throw err;
    }
    await Purchase.create({ familyId, kidId, source: 'milestone', milestoneId: m._id, title: m.title, icon: m.icon, priceCents: 0 });
  }
};

/**
 * One chest per day, unlocked only when a grown-up has approved every quest that
 * day. Requiring approval (not just "I did it!") means a chest can never be won by
 * work that later gets sent back, so nothing ever has to be taken away again.
 */
export const openChest = async (actor: Actor, date: string) => {
  if (actor.role !== 'kid') throw new HttpError(403, 'Chests are for kids!');
  await assertFeature(actor, 'chest');
  const kid = await resolveKid(actor);
  const { quests } = await questsForDay(actor, date);
  if (!quests.length || quests.some((q) => q.run?.status !== 'approved')) {
    throw new HttpError(400, 'The chest opens once a grown-up approves all of your quests', 'CHEST_LOCKED');
  }
  try {
    await ChestOpen.create({ familyId: kid.familyId, kidId: kid._id, dateKey: date, xp: CHEST_XP });
  } catch (err) {
    if ((err as { code?: number }).code === 11000) throw new HttpError(409, 'Already opened today!');
    throw err;
  }
  return awardXp(kid._id, CHEST_XP);
};

export const chestOpened = async (kidId: Types.ObjectId, date: string) => !!(await ChestOpen.exists({ kidId, dateKey: date }));

export const setHat = async (actor: Actor, hat: HatId, kidId?: string) => {
  const kid = await resolveKid(actor, kidId);
  if (!hatUnlocked(hat, levelFor(kid.xp).level)) throw new HttpError(403, 'Level up to unlock that hat!');
  kid.hat = hat;
  await kid.save();
};

export const setGoal = async (actor: Actor, goal: z.infer<typeof goalBody>, kidId?: string) => {
  await assertFeature(actor, 'goals');
  const kid = await resolveKid(actor, kidId);
  kid.set('goal', goal);
  await kid.save();
};

/**
 * Helpers on an approved quest earn assist points and a little XP. The doer keeps
 * every coin. Crossing a milestone unlocks its prize exactly once (unique claim)
 * and drops it in the grown-up's inbox like a shop purchase waiting to be handed over.
 */
export const awardAssists = async (familyId: Types.ObjectId, helperIds: Types.ObjectId[], stars: number) => {
  if (!helperIds.length) return;
  const family = await Family.findById(familyId).select('features');
  // Helper points need the family switch on and a plan that includes them.
  if (family?.features?.assists === false || !planAllows(await getFamilyPlan(familyId), 'assists')) return;
  const points = assistPointsFor(stars);
  for (const helperId of helperIds) {
    const helper = await User.findOneAndUpdate({ _id: helperId, familyId, role: 'kid' }, { $inc: { assistPoints: points } }, { new: true });
    if (!helper) continue;
    // Helper XP goes through awardXp like all XP, so level bonuses and prizes apply too.
    await awardXp(helper._id, assistXpFor(stars));
    await unlockMilestones(familyId, helper._id, 'helper', helper.assistPoints);
  }
};
