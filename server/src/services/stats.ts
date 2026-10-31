import type { Types } from 'mongoose';
import { BADGE_RULES, toDateKey } from '@kk/shared';
import { Purchase, QuestRun, Txn } from '../models.js';

const dayBefore = (key: string) => {
  const [y, m, d] = key.split('-').map(Number);
  return toDateKey(new Date(y, m - 1, d - 1));
};

/** Streak = consecutive days, ending today or yesterday, with at least one finished quest. */
export const kidStats = async (kidId: Types.ObjectId) => {
  const [days, approved, purchases, piggyIn, rocketIn] = await Promise.all([
    QuestRun.distinct('dateKey', { kidId, status: { $in: ['done', 'approved'] } }),
    QuestRun.countDocuments({ kidId, status: 'approved' }),
    // Only real shop buys count; helper prizes are stored as purchases too. $ne covers rows from before `source` existed.
    Purchase.countDocuments({ kidId, status: { $ne: 'declined' }, source: { $ne: 'milestone' } }),
    Txn.exists({ kidId, pot: 'piggy', kind: 'deposit' }),
    Txn.exists({ kidId, pot: 'rocket', kind: 'deposit' }),
  ]);
  const set = new Set<string>(days);
  let cursor = toDateKey(new Date());
  if (!set.has(cursor)) cursor = dayBefore(cursor);
  let streak = 0;
  while (set.has(cursor)) {
    streak++;
    cursor = dayBefore(cursor);
  }
  const badges = [
    approved >= 1 && 'first-quest',
    streak >= BADGE_RULES.streakDays && 'streak',
    piggyIn && 'saver',
    purchases >= 1 && 'shopper',
    approved >= BADGE_RULES.helperQuests && 'helper',
    rocketIn && 'rocketeer',
  ].filter(Boolean) as string[];
  return { streak, questsDone: approved, badges };
};
