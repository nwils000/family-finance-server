// Team goals: a prize the family earns together. Progress is effort points
// (stars x each kid's effort boost), so a younger kid on a lower star value still
// counts fully. The only module that changes a goal's contributions or progress.
import type { Types } from 'mongoose';
import type { z } from 'zod';
import { contributionShare, teamPointsFor } from '@kk/shared';
import { notFound } from '../http.js';
import { TeamGoal, User } from '../models.js';
import type { teamGoalBody } from '../schemas.js';
import { assertFeature, familyOf, transition, type Actor } from './access.js';
import { assertPlanFeature, assertWithinLimit } from './billing.js';

const shapeGoal = (g: InstanceType<typeof TeamGoal>) => {
  const contributions = Object.fromEntries(g.contributions ?? new Map());
  return {
    id: String(g._id),
    title: g.title,
    icon: g.icon ?? null,
    targetPoints: g.targetPoints,
    progress: g.progress,
    status: g.status,
    kidIds: g.kidIds.map(String),
    contributions: g.kidIds.map((k) => {
      const points = contributions[String(k)] ?? 0;
      return { kidId: String(k), points, share: contributionShare(points, g.progress) };
    }),
  };
};

export const listTeamGoals = async (actor: Actor) => {
  const goals = await TeamGoal.find({ familyId: familyOf(actor), status: { $ne: 'archived' } }).sort({ createdAt: -1 });
  const visible = actor.role === 'kid' ? goals.filter((g) => g.kidIds.some((k) => String(k) === actor.userId)) : goals;
  return { goals: visible.map(shapeGoal) };
};

const assertKids = async (actor: Actor, kidIds: string[]) => {
  const found = await User.countDocuments({ _id: { $in: kidIds }, familyId: familyOf(actor), role: 'kid' });
  if (found !== new Set(kidIds).size) throw notFound('Kid not found');
};

export const createTeamGoal = async (actor: Actor, body: z.infer<typeof teamGoalBody>) => {
  await assertFeature(actor, 'teamGoals');
  await assertPlanFeature(actor, 'teamGoals');
  await assertWithinLimit(actor, 'teamGoals', await TeamGoal.countDocuments({ familyId: familyOf(actor), status: 'active' }));
  await assertKids(actor, body.kidIds);
  const goal = await TeamGoal.create({ ...body, familyId: familyOf(actor) });
  return { goal: shapeGoal(goal) };
};

export const updateTeamGoal = async (actor: Actor, id: string, body: Partial<z.infer<typeof teamGoalBody>>) => {
  if (body.kidIds) await assertKids(actor, body.kidIds);
  const goal = await TeamGoal.findOneAndUpdate({ _id: id, familyId: familyOf(actor), status: 'active' }, body, { new: true, runValidators: true });
  if (!goal) throw notFound('Team goal not found');
  // A lower target may already be met.
  await markReachedIfDone(goal._id);
  return { goal: shapeGoal((await TeamGoal.findById(goal._id))!) };
};

export const archiveTeamGoal = async (actor: Actor, id: string) => {
  const res = await TeamGoal.updateOne({ _id: id, familyId: familyOf(actor) }, { status: 'archived' });
  if (!res.matchedCount) throw notFound('Team goal not found');
};

/** The grown-up handed the prize over. */
export const handOverTeamGoal = (actor: Actor, id: string) => transition(TeamGoal, actor, id, 'reached', 'handed', 'Nothing to hand over');

/** active -> reached exactly once, the moment progress meets the target. */
const markReachedIfDone = (goalId: Types.ObjectId) =>
  TeamGoal.updateOne(
    { _id: goalId, status: 'active', $expr: { $gte: ['$progress', '$targetPoints'] } },
    { status: 'reached', reachedAt: new Date() },
  );

/** Called when a quest is approved: add the kid's effort to every active goal they are part of. */
export const contributeToTeamGoals = async (familyId: Types.ObjectId, kidId: Types.ObjectId, stars: number) => {
  const kid = await User.findById(kidId).select('effortBoost');
  const points = teamPointsFor(stars, kid?.effortBoost ?? 1);
  const goals = await TeamGoal.find({ familyId, status: 'active', kidIds: kidId }).select('_id');
  for (const g of goals) {
    await TeamGoal.updateOne({ _id: g._id, status: 'active' }, { $inc: { progress: points, [`contributions.${kidId}`]: points } });
    await markReachedIfDone(g._id);
  }
};

/** Prizes the family reached and a grown-up still has to hand over. */
export const teamPrizesToHandOver = async (familyId: Types.ObjectId) =>
  (await TeamGoal.find({ familyId, status: 'reached' }).sort({ reachedAt: 1 })).map(shapeGoal);

/**
 * A removed kid leaves team goals: their name and personal tally go, but the points
 * stay in the goal's progress so siblings never lose ground they earned together.
 */
export const removeKidFromTeamGoals = (familyId: Types.ObjectId, kidId: Types.ObjectId) =>
  TeamGoal.updateMany({ familyId, kidIds: kidId }, { $pull: { kidIds: kidId }, $unset: { [`contributions.${kidId}`]: '' } });
