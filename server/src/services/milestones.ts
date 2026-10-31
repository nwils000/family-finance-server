// Milestone prizes: helper prizes (unlocked by helper points) and level prizes
// (unlocked by reaching a level). Unlocking happens in services/game.ts; this file manages the list.
import type { z } from 'zod';
import { levelFor } from '@kk/shared';
import { Milestone, MilestoneClaim } from '../models.js';
import type { milestoneBody } from '../schemas.js';
import { familyOf, resolveKid, updateScoped, type Actor } from './access.js';
import { assertPlanFeature } from './billing.js';

const shape = (m: InstanceType<typeof Milestone>) => ({ id: String(m._id), kind: (m.kind ?? 'helper') as 'helper' | 'level', title: m.title, icon: m.icon ?? null, points: m.points });

/** The family's milestones, plus each one's unlock state for the kid being viewed. */
export const listMilestones = async (actor: Actor, kidId?: string) => {
  const milestones = await Milestone.find({ familyId: familyOf(actor), active: true }).sort({ points: 1 });
  const kid = actor.role === 'kid' || kidId ? await resolveKid(actor, kidId) : null;
  const claimed = kid ? new Set((await MilestoneClaim.find({ kidId: kid._id }).select('milestoneId')).map((c) => String(c.milestoneId))) : new Set<string>();
  return {
    assistPoints: kid?.assistPoints ?? null,
    level: kid ? levelFor(kid.xp).level : null,
    milestones: milestones.map((m) => ({ ...shape(m), unlocked: claimed.has(String(m._id)) })),
  };
};

export const createMilestone = async (actor: Actor, body: z.infer<typeof milestoneBody>) => {
  // Helper prizes are part of Kapital Plus; level prizes are free for everyone.
  if (body.kind !== 'level') await assertPlanFeature(actor, 'assists');
  return { milestone: shape(await Milestone.create({ ...body, familyId: familyOf(actor) })) };
};

export const updateMilestone = async (actor: Actor, id: string, body: Partial<z.infer<typeof milestoneBody>>) => ({
  milestone: shape(await updateScoped(Milestone, actor, id, body, 'Milestone')),
});

export const archiveMilestone = (actor: Actor, id: string) => updateScoped(Milestone, actor, id, { active: false }, 'Milestone');

