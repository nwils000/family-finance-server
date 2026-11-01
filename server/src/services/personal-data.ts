// A family's personal data: the one owner for exporting it and for erasing it (removing
// a kid, a grown-up leaving, deleting the whole family). COPPA and the App Store both require that a parent can
// delete their child's data, so nothing a kid or family owns may be left behind.
// guards.test.ts checks that every model holding kidId / familyId / userId is listed here.
import type { Types } from 'mongoose';
import { ACTIVITY_HISTORY_MONTHS, INACTIVE_FAMILY_MONTHS } from '@kk/shared';
import { CoParentInvite, EmailVerificationToken, PasswordResetToken, SessionCutoff, SocialIdentity, SpentRefreshToken } from '../models-account.js';
import {
  Account,
  ChestOpen,
  Family,
  LessonAssignment,
  LessonProgress,
  Milestone,
  MilestoneClaim,
  Purchase,
  Quest,
  QuestRun,
  RefreshToken,
  Reward,
  TeamGoal,
  Txn,
  User,
} from '../models.js';
import { revokeAllSessions } from '../auth.js';
import { removeKidFromTeamGoals } from './teamGoals.js';

/** Everything that belongs to one kid, deleted by kidId. */
export const KID_DATA = [Account, Txn, Quest, QuestRun, Purchase, ChestOpen, LessonProgress, LessonAssignment, MilestoneClaim] as const;
/** Everything that belongs to one user (any role), deleted by userId. */
export const USER_DATA = [RefreshToken, SpentRefreshToken, SessionCutoff, PasswordResetToken, EmailVerificationToken, SocialIdentity] as const;
/** Family-wide data with no single owner, deleted with the family. */
export const FAMILY_DATA = [Reward, Milestone, TeamGoal, CoParentInvite] as const;
/** Models deliberately not erased here, and why. Checked by the guard so a new model must pick a side. */
export const NOT_PERSONAL = {
  Family: 'deleted last by eraseFamily itself',
  User: 'deleted by eraseUser',
  AppleNonce: 'short-lived sign-in nonces with a TTL; not tied to a user',
  RevokedJti: 'ids of signed-out access tokens, TTL at their 15 minute expiry; no user id stored',
  AbuseCounter: 'rate-limit and bot counters with a TTL of their window; rate-limit keys (which may hold an email or kid id) are stored hashed',
  IpBan: 'automatic bans of an IP address (IPv6 /64), TTL at the end of the ban; not tied to a user',
} as const;

const eraseUser = async (userId: Types.ObjectId) => {
  // Sessions end first, through the one owner, so a token in flight is refused at once.
  await revokeAllSessions(String(userId));
  await Promise.all(USER_DATA.map((M) => (M as typeof RefreshToken).deleteMany({ userId })));
  await User.deleteOne({ _id: userId });
};

/** Remove one kid and everything that is theirs. */
export const eraseKid = async (familyId: Types.ObjectId, kidId: Types.ObjectId) => {
  await Promise.all([
    ...KID_DATA.map((M) => (M as typeof Txn).deleteMany({ familyId, kidId })),
    // Helping a sibling leaves the kid's id on the sibling's quest run.
    QuestRun.updateMany({ familyId, helperIds: kidId }, { $pull: { helperIds: kidId } }),
    removeKidFromTeamGoals(familyId, kidId),
  ]);
  await eraseUser(kidId);
};

/** Delete the whole family: every kid, every grown-up, and all family data. */
export const eraseFamily = async (familyId: Types.ObjectId) => {
  const members = await User.find({ familyId }).select('role');
  for (const m of members.filter((u) => u.role === 'kid')) await eraseKid(familyId, m._id);
  for (const m of members.filter((u) => u.role === 'parent')) await eraseUser(m._id);
  await Promise.all(FAMILY_DATA.map((M) => (M as typeof Reward).deleteMany({ familyId })));
  await Family.deleteOne({ _id: familyId });
};

const monthsBefore = (now: Date, months: number) => {
  const d = new Date(now);
  d.setMonth(d.getMonth() - months);
  return d;
};

/**
 * The retention limit (COPPA: published, never indefinite; the number is @kk/shared
 * INACTIVE_FAMILY_MONTHS and the Privacy Policy reads it). A family nobody signed in to for
 * that long is erased whole. A family that predates lastActiveAt counts from its creation.
 * One family failing (say, a paid plan that still renews) never stops the rest.
 */
export const eraseInactiveFamilies = async (now = new Date()) => {
  const cutoff = monthsBefore(now, INACTIVE_FAMILY_MONTHS);
  const stale = await Family.find({
    $or: [{ lastActiveAt: { $lt: cutoff } }, { lastActiveAt: { $exists: false }, createdAt: { $lt: cutoff } }],
  }).select('_id');
  let erased = 0;
  for (const f of stale) {
    try {
      await eraseFamily(f._id);
      erased++;
    } catch (err) {
      console.warn(JSON.stringify({ level: 'warn', msg: 'inactive family not erased', familyId: String(f._id), err: String(err) }));
    }
  }
  if (erased) console.info(JSON.stringify({ level: 'info', msg: 'erased inactive families', erased }));
  return { erased };
};

/**
 * The activity-history limit (COPPA 312.10: keep data only as long as needed). Quest runs, coin
 * movements and chest opens older than ACTIVITY_HISTORY_MONTHS are deleted in every family.
 * Balances and XP live on the kid and accounts, so nothing a kid owns changes; what badges and
 * the quest count read from those rows is rolled up onto the kid (pastActivity) first.
 * If the job stops between the roll-up and the delete, the next run counts those rows again;
 * that can only ever award a badge early, never take one away.
 */
export const eraseOldActivity = async (now = new Date()) => {
  const cutoff = monthsBefore(now, ACTIVITY_HISTORY_MONTHS);
  const old = { createdAt: { $lt: cutoff } };
  const [approved, deposits] = await Promise.all([
    QuestRun.aggregate<{ _id: Types.ObjectId; n: number }>([{ $match: { ...old, status: 'approved' } }, { $group: { _id: '$kidId', n: { $sum: 1 } } }]),
    Txn.aggregate<{ _id: Types.ObjectId; pots: string[] }>([
      { $match: { ...old, kind: 'deposit', pot: { $in: ['piggy', 'rocket'] } } },
      { $group: { _id: '$kidId', pots: { $addToSet: '$pot' } } },
    ]),
  ]);
  const rollup = new Map<string, { $inc?: Record<string, number>; $set?: Record<string, boolean> }>();
  for (const r of approved) rollup.set(String(r._id), { $inc: { 'pastActivity.questsApproved': r.n } });
  for (const d of deposits) {
    const u = rollup.get(String(d._id)) ?? {};
    u.$set = { ...(d.pots.includes('piggy') ? { 'pastActivity.saved': true } : {}), ...(d.pots.includes('rocket') ? { 'pastActivity.rocket': true } : {}) };
    rollup.set(String(d._id), u);
  }
  if (rollup.size) await User.bulkWrite([...rollup].map(([kidId, update]) => ({ updateOne: { filter: { _id: kidId, role: 'kid' }, update } })));
  const [runs, txns, chests] = await Promise.all([QuestRun.deleteMany(old), Txn.deleteMany(old), ChestOpen.deleteMany(old)]);
  const deleted = runs.deletedCount + txns.deletedCount + chests.deletedCount;
  if (deleted) console.info(JSON.stringify({ level: 'info', msg: 'erased old activity history', deleted }));
  return { deleted };
};

/** A grown-up deletes their own account. The last grown-up takes the family with them. */
export const eraseParent = async (familyId: Types.ObjectId, parentId: Types.ObjectId) => {
  const others = await User.countDocuments({ familyId, role: 'parent', _id: { $ne: parentId } });
  if (others === 0) return eraseFamily(familyId).then(() => ({ familyDeleted: true }));
  await eraseUser(parentId);
  return { familyDeleted: false };
};

/** Secrets are stored only as hashes, and every such field ends in "Hash" (passwordHash, pinHash, tokenHash). */
const isSecret = (key: string) => key.endsWith('Hash') || key === '__v';

/**
 * Everything the family has stored, as plain JSON, for the grown-up who asks. Secrets
 * never leave the server, whichever model they are on.
 */
export const exportFamily = async (familyId: Types.ObjectId) => {
  const strip = <T extends { toObject: () => Record<string, unknown> }>(docs: T[]) =>
    docs.map((d) => Object.fromEntries(Object.entries(d.toObject()).filter(([k]) => !isSecret(k))));
  const byFamily = { familyId };
  const [family, users, ...rest] = await Promise.all([
    Family.findById(familyId),
    User.find(byFamily),
    ...[...KID_DATA, ...FAMILY_DATA].map((M) => (M as typeof Txn).find(byFamily)),
  ]);
  const collections = Object.fromEntries([...KID_DATA, ...FAMILY_DATA].map((M, i) => [M.modelName, strip(rest[i])]));
  return { exportedAt: new Date().toISOString(), family: family ? strip([family])[0] : null, members: strip(users), ...collections };
};
