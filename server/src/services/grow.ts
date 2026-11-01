import { GROWTH_PERIOD_DAYS, POT_NAMES, type AccountKind } from '@kk/shared';
import { Account, Family, Purchase, Quest, QuestRun, Txn, User } from '../models.js';
import { assertFeature, familyOf, resolveKid, visibleTo, type Actor } from './access.js';
import { NOT_TRANSFER_OUT, transfer } from './money.js';
import { teamPrizesToHandOver } from './teamGoals.js';


export const growOverview = async (actor: Actor, kidId?: string) => {
  const kid = await resolveKid(actor, kidId);
  const [family, accounts] = await Promise.all([Family.findById(kid.familyId), Account.find({ kidId: kid._id })]);
  return {
    walletCents: kid.balanceCents,
    piggyRatePct: family!.piggyRatePct,
    rocketMinPct: family!.rocketMinPct,
    rocketMaxPct: family!.rocketMaxPct,
    accounts: accounts.map((a) => ({
      kind: a.kind as AccountKind,
      balanceCents: a.balanceCents,
      lastGrowthPct: a.lastGrowthPct,
      nextGrowthAt: new Date(a.lastGrowthAt!.getTime() + GROWTH_PERIOD_DAYS * 86_400_000),
    })),
  };
};

/** Deposit into or withdraw from a growth pot. One path for both pots and both directions. */
export const moveGrowth = async (actor: Actor, kind: AccountKind, direction: 'deposit' | 'withdraw', amountCents: number, kidId?: string) => {
  if (direction === 'deposit') {
    await assertFeature(actor, kind);
  }
  const kid = await resolveKid(actor, kidId);
  const base = { familyId: kid.familyId, kidId: kid._id };
  if (direction === 'deposit') await transfer(base, 'wallet', kind, amountCents, `Into ${POT_NAMES[kind]}`);
  else await transfer(base, kind, 'wallet', amountCents, `Out of ${POT_NAMES[kind]}`);
};

export const activity = async (actor: Actor, kidId?: string) => {
  const filter = actor.role === 'parent' && kidId ? { familyId: familyOf(actor), kidId: (await resolveKid(actor, kidId))._id } : visibleTo(actor);
  const txns = await Txn.find({ ...filter, ...NOT_TRANSFER_OUT }).sort({ createdAt: -1 }).limit(60);
  return {
    activity: txns.map((t) => ({
      id: String(t._id),
      kidId: String(t.kidId),
      amountCents: t.amountCents,
      kind: t.kind,
      label: t.label,
      pot: t.pot,
      createdAt: t.createdAt,
    })),
  };
};

/** The grown-up inbox: finished quests to approve and rewards to hand over. */
export const approvals = async (actor: Actor) => {
  const familyId = familyOf(actor);
  const [runs, purchases, kids] = await Promise.all([
    QuestRun.find({ familyId, status: 'done' }).sort({ createdAt: 1 }),
    Purchase.find({ familyId, status: 'pending' }).sort({ createdAt: 1 }),
    User.find({ familyId, role: 'kid' }).select('name avatar'),
  ]);
  const quests = await Quest.find({ _id: { $in: runs.map((r) => r.questId) } });
  const questById = new Map(quests.map((q) => [String(q._id), q]));
  const kidById = new Map(kids.map((k) => [String(k._id), { id: String(k._id), name: k.name, avatar: k.avatar }]));
  return {
    quests: runs.map((r) => {
      const q = questById.get(String(r.questId));
      return {
        runId: String(r._id),
        dateKey: r.dateKey,
        kid: kidById.get(String(r.kidId)),
        title: q?.title ?? 'Quest',
        icon: q?.icon ?? null,
        stars: q?.stars ?? 1,
        rewardCents: q?.rewardCents ?? 0,
        helpers: r.helperIds.map((h) => kidById.get(String(h))).filter(Boolean),
      };
    }),
    purchases: purchases.map((p) => ({
      id: String(p._id),
      kid: kidById.get(String(p.kidId)),
      title: p.title,
      icon: p.icon,
      priceCents: p.priceCents,
      source: p.source,
    })),
    teamPrizes: await teamPrizesToHandOver(familyId),
  };
};
