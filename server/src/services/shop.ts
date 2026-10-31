import type { z } from 'zod';
import { notFound } from '../http.js';
import { Purchase, Reward } from '../models.js';
import type { rewardBody } from '../schemas.js';
import { assertFeature, familyOf, resolveKid, transition, updateScoped, visibleTo, type Actor } from './access.js';
import { move } from './money.js';

const shapeReward = (r: InstanceType<typeof Reward>) => ({ id: String(r._id), title: r.title, icon: r.icon, priceCents: r.priceCents });

const shapePurchase = (p: InstanceType<typeof Purchase>) => ({
  id: String(p._id),
  kidId: String(p.kidId),
  title: p.title,
  icon: p.icon,
  priceCents: p.priceCents,
  status: p.status,
  source: p.source,
  createdAt: p.get('createdAt') as Date,
});

export const listRewards = async (actor: Actor) => {
  const rewards = await Reward.find({ familyId: familyOf(actor), active: true }).sort({ priceCents: 1 });
  return { rewards: rewards.map(shapeReward) };
};

export const createReward = async (actor: Actor, body: z.infer<typeof rewardBody>) => ({
  reward: shapeReward(await Reward.create({ ...body, familyId: familyOf(actor) })),
});

export const updateReward = async (actor: Actor, id: string, body: Partial<z.infer<typeof rewardBody>>) => ({
  reward: shapeReward(await updateScoped(Reward, actor, id, body, 'Reward')),
});

export const archiveReward = (actor: Actor, id: string) => updateScoped(Reward, actor, id, { active: false }, 'Reward');

/** Coins leave the wallet right away; a grown-up then hands it over or declines (refund). */
export const buyReward = async (actor: Actor, rewardId: string, kidId?: string) => {
  await assertFeature(actor, 'shop');
  const kid = await resolveKid(actor, kidId);
  const reward = await Reward.findOne({ _id: rewardId, familyId: kid.familyId, active: true });
  if (!reward) throw notFound('Reward not found');
  await move({ familyId: kid.familyId, kidId: kid._id, amountCents: -reward.priceCents, kind: 'purchase', label: reward.title });
  const purchase = await Purchase.create({
    familyId: kid.familyId,
    kidId: kid._id,
    rewardId: reward._id,
    title: reward.title,
    icon: reward.icon,
    priceCents: reward.priceCents,
  });
  return { purchase: shapePurchase(purchase) };
};

export const listPurchases = async (actor: Actor) => {
  const purchases = await Purchase.find(visibleTo(actor)).sort({ createdAt: -1 }).limit(50);
  return { purchases: purchases.map(shapePurchase) };
};

export const fulfillPurchase = (actor: Actor, id: string) => transition(Purchase, actor, id, 'pending', 'fulfilled', 'Nothing to hand over');

export const declinePurchase = async (actor: Actor, id: string) => {
  const p = await transition(Purchase, actor, id, 'pending', 'declined', 'Nothing to decline');
  await move({ familyId: p.familyId, kidId: p.kidId, amountCents: p.priceCents, kind: 'refund', label: `${p.title} refund` });
};
