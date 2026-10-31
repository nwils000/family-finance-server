// A family's personal data: the one owner for exporting it and for erasing it (removing
// a kid, a grown-up leaving, deleting the whole family). COPPA and the App Store both require that a parent can
// delete their child's data, so nothing a kid or family owns may be left behind.
// guards.test.ts checks that every model holding kidId / familyId / userId is listed here.
import type { Types } from 'mongoose';
import { HttpError } from '../http.js';
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
import { forgetEntitlement, hasRenewingSubscription } from './billing.js';
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
  Entitlement: 'billing row, removed through billing.ts forgetEntitlement',
  BillingEvent: 'provider event ids for idempotency; no personal data',
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
  if (await hasRenewingSubscription(familyId)) {
    throw new HttpError(409, 'Cancel Kapital Plus first, so your card is not charged again. Then you can delete the family.', 'SUBSCRIPTION_ACTIVE');
  }
  const members = await User.find({ familyId }).select('role');
  for (const m of members.filter((u) => u.role === 'kid')) await eraseKid(familyId, m._id);
  for (const m of members.filter((u) => u.role === 'parent')) await eraseUser(m._id);
  await Promise.all([...FAMILY_DATA.map((M) => (M as typeof Reward).deleteMany({ familyId })), forgetEntitlement(familyId)]);
  await Family.deleteOne({ _id: familyId });
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
