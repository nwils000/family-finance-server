import { Types } from 'mongoose';
import type { z } from 'zod';
import { autoApproves, defaultRewardCents, isDueOn, toDateKey, xpForStars, type Repeat } from '@kk/shared';
import { HttpError, notFound } from '../http.js';
import { Family, Quest, QuestRun, User } from '../models.js';
import type { helpersBody, newQuestBody, questActionBody, questBody } from '../schemas.js';
import { familyOf, resolveKid, transition, updateScoped, visibleTo, type Actor } from './access.js';
import { awardAssists, awardXp, chestOpened } from './game.js';
import { contributeToTeamGoals } from './teamGoals.js';
import { move } from './money.js';

const shapeQuest = (q: InstanceType<typeof Quest>) => ({
  id: String(q._id),
  kidId: String(q.kidId),
  title: q.title,
  icon: q.icon,
  stars: q.stars,
  rewardCents: q.rewardCents,
  repeat: q.repeat as Repeat,
  autoApprove: !!q.autoApprove,
});

/** Quests due on a day, each with the kid's run for that day (if any). */
export const questsForDay = async (actor: Actor, date: string) => {
  const quests = (await Quest.find(visibleTo(actor, { active: true })).sort({ createdAt: 1 })).filter((q) =>
    isDueOn(q.repeat as Repeat, date, q.startKey),
  );
  const runs = await QuestRun.find({ questId: { $in: quests.map((q) => q._id) }, dateKey: date });
  const runFor = new Map(runs.map((r) => [String(r.questId), r]));
  return {
    date,
    chestOpened: actor.role === 'kid' ? await chestOpened(new Types.ObjectId(actor.userId), date) : false,
    quests: quests.map((q) => {
      const run = runFor.get(String(q._id));
      return { ...shapeQuest(q), run: run ? { id: String(run._id), status: run.status, helperIds: run.helperIds.map(String), autoApproved: !!run.autoApproved } : null };
    }),
  };
};

export const allQuests = async (actor: Actor) => {
  const quests = await Quest.find({ familyId: familyOf(actor), active: true }).sort({ createdAt: -1 });
  return { quests: quests.map(shapeQuest) };
};

/** One quest per chosen kid, so each kid's progress is tracked separately. */
export const createQuests = async (actor: Actor, body: z.infer<typeof newQuestBody>) => {
  const familyId = familyOf(actor);
  const [family, kids] = await Promise.all([
    Family.findById(familyId),
    User.find({ _id: { $in: body.kidIds }, familyId, role: 'kid' }),
  ]);
  if (!family || kids.length !== new Set(body.kidIds).size) throw notFound('Kid not found');
  const startKey = body.repeat.kind === 'once' ? body.repeat.date : toDateKey(new Date());
  const quests = await Quest.insertMany(
    kids.map((kid) => ({
      familyId,
      kidId: kid._id,
      title: body.title,
      icon: body.icon,
      stars: body.stars,
      // A kid's own star value (set by a grown-up) wins over the family default.
      rewardCents: body.rewardCents ?? defaultRewardCents(body.stars, kid.starValueCents ?? family.starValueCents),
      repeat: body.repeat,
      autoApprove: !!body.autoApprove,
      startKey,
    })),
  );
  return { quests: quests.map((q) => shapeQuest(q as unknown as InstanceType<typeof Quest>)) };
};

export const updateQuest = async (actor: Actor, id: string, body: Partial<z.infer<typeof questBody>>) => ({
  quest: shapeQuest(await updateScoped(Quest, actor, id, body, 'Quest')),
});

export const archiveQuest = (actor: Actor, id: string) => updateScoped(Quest, actor, id, { active: false }, 'Quest');

const dayOffsetKey = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toDateKey(d);
};

/** Kids can finish today's or yesterday's quests, with one extra day each way for time zones. */
const inQuestWindow = (date: string) => date >= dayOffsetKey(-2) && date <= dayOffsetKey(1);

/** Helpers must be other kids in the same family. */
const validHelpers = async (kid: InstanceType<typeof User>, helperIds: string[] = []) => {
  const ids = [...new Set(helperIds)].filter((h) => h !== String(kid._id));
  if (!ids.length) return [];
  const found = await User.find({ _id: { $in: ids }, familyId: kid.familyId, role: 'kid' }).select('_id');
  if (found.length !== ids.length) throw notFound('Helper not found');
  return found.map((h) => h._id);
};

/** "I did it!" Coins land once a grown-up approves. Optionally names siblings who helped. */
export const markDone = async (actor: Actor, questId: string, body: z.infer<typeof questActionBody>) => {
  const kid = await resolveKid(actor, body.kidId);
  const helperIds = await validHelpers(kid, body.helperIds);
  const quest = await Quest.findOne({ _id: questId, kidId: kid._id, active: true });
  if (!quest) throw notFound('Quest not found');
  if (!inQuestWindow(body.date) || !isDueOn(quest.repeat as Repeat, body.date, quest.startKey)) {
    throw new HttpError(400, "That quest isn't due that day");
  }
  try {
    const run = await QuestRun.create({ familyId: quest.familyId, questId: quest._id, kidId: kid._id, dateKey: body.date, status: 'done', helperIds });
    if (!autoApproves(quest, kid)) return { run: { id: String(run._id), status: run.status, helperIds: run.helperIds.map(String) } };
    // Trusted: approve through the same once-only path a grown-up's thumbs up uses.
    const approved = await transition(QuestRun, actor, String(run._id), 'done', 'approved', 'Nothing to approve');
    const payout = await settleApproved(approved, true);
    return { run: { id: String(run._id), status: 'approved' as const, helperIds: run.helperIds.map(String) }, ...payout };
  } catch (err) {
    if ((err as { code?: number }).code === 11000) throw new HttpError(409, 'Already done!');
    throw err;
  }
};

/** Change who helped, while the quest still waits for a grown-up. */
export const setHelpers = async (actor: Actor, questId: string, body: z.infer<typeof helpersBody>) => {
  const kid = await resolveKid(actor, body.kidId);
  const helperIds = await validHelpers(kid, body.helperIds);
  const run = await QuestRun.findOneAndUpdate({ questId, kidId: kid._id, dateKey: body.date, status: 'done' }, { helperIds }, { new: true });
  if (!run) throw new HttpError(409, 'Already reviewed');
  return { helperIds: run.helperIds.map(String) };
};

/** Take back an "I did it!" that nobody has reviewed yet. */
export const undoDone = async (actor: Actor, questId: string, body: z.infer<typeof questActionBody>) => {
  const kid = await resolveKid(actor, body.kidId);
  const res = await QuestRun.deleteOne({ questId, kidId: kid._id, dateKey: body.date, status: 'done' });
  if (!res.deletedCount) throw new HttpError(409, 'Already reviewed');
};

/**
 * Everything an approval does, after the run moved done -> approved exactly once:
 * pay the doer, award XP, add team-goal effort and helper points. Shared by a
 * grown-up's thumbs up and by trusted (auto-approved) quests, so they can never differ.
 */
const settleApproved = async (run: InstanceType<typeof QuestRun>, autoApproved = false) => {
  const quest = await Quest.findById(run.questId);
  const amount = quest?.rewardCents ?? 0;
  const stars = quest?.stars ?? 1;
  await move({ familyId: run.familyId, kidId: run.kidId, amountCents: amount, kind: 'quest', label: quest?.title ?? 'Quest' });
  await QuestRun.updateOne({ _id: run._id }, { paidCents: amount, autoApproved });
  await contributeToTeamGoals(run.familyId, run.kidId, stars);
  await awardAssists(run.familyId, run.helperIds, stars);
  return { paidCents: amount, ...(await awardXp(run.kidId, xpForStars(stars))) };
};

export const approveRun = async (actor: Actor, runId: string) =>
  settleApproved(await transition(QuestRun, actor, runId, 'done', 'approved', 'Nothing to approve'));

export const rejectRun = (actor: Actor, runId: string) => transition(QuestRun, actor, runId, 'done', 'rejected', 'Nothing to review');
