// Every request body and query is parsed by one of these before it reaches a service.
import { z } from 'zod';
import {
  ACCOUNT_KINDS,
  AVATARS,
  EFFORT_BOOST,
  KID_AGE,
  FEATURES,
  HAT_IDS,
  THEMES,
  MAX_STARS,
  MIN_STARS,
  PASSWORD_MAX,
  PIN_LENGTH,
  passwordProblem,
  QUEST_ICONS,
  REWARD_ICONS,
  type Repeat,
} from '@kk/shared';
import { cents, dateKey, objectId } from './http.js';
import { linkToken } from './tokens.js';

export const email = z.string().trim().toLowerCase().email('That email looks off');
/** Every NEW grown-up password (signup, join, reset, change) passes the shared Mentis rules in @kk/shared. */
export const newPassword = z.string().max(PASSWORD_MAX).superRefine((pw, ctx) => {
  const problem = passwordProblem(pw);
  if (problem) ctx.addIssue({ code: z.ZodIssueCode.custom, message: problem });
});
const password = newPassword;
const personName = z.string().trim().min(1, 'Add a name').max(40);
const pin = z.string().regex(new RegExp(`^\\d{${PIN_LENGTH}}$`), `PIN is ${PIN_LENGTH} numbers`);
export const familyCode = z.string().trim().toUpperCase().length(6, 'Family codes are 6 characters');

/** Agreeing to the Terms and Privacy Policy as a parent or guardian; required to make a grown-up account. */
export const acceptLegal = z.literal(true, 'Please confirm you are a parent or guardian and agree to the Terms and Privacy Policy.');
export const signupBody = z.object({ name: personName, email, password, familyName: z.string().trim().min(1).max(60), acceptLegal });
/**
 * A grown-up joins an existing family only with a single-use invite link from a
 * grown-up already in it. The family code is for KIDS signing in and is never
 * enough to create a grown-up account (services/accounts.ts joinWithInvite).
 */
export const inviteToken = linkToken('That invite link is not valid');
export const joinBody = z.object({ name: personName, email, password, invite: inviteToken, acceptLegal });
export const inviteCheckBody = z.object({ invite: inviteToken });
export const loginBody = z.object({ email, password: z.string().min(1).max(PASSWORD_MAX) });
export const kidLoginBody = z.object({ code: familyCode, kidId: objectId, pin });

export const settingsBody = z
  .object({
    name: z.string().trim().min(1).max(60),
    starValueCents: cents,
    piggyRatePct: z.number().min(0).max(50),
    rocketMinPct: z.number().min(-50).max(0),
    rocketMaxPct: z.number().min(0).max(100),
    theme: z.enum(THEMES),
    lessonRewardCents: cents,
    levelUpBonusCents: cents,
    learnMode: z.enum(['open', 'assigned']),
    features: z.object(Object.fromEntries(FEATURES.map((f) => [f, z.boolean()])) as Record<(typeof FEATURES)[number], z.ZodBoolean>).partial(),
  })
  .partial();
export const kidBody = z.object({ name: personName, avatar: z.enum(AVATARS), pin, age: z.number().int().min(KID_AGE.min).max(KID_AGE.max).nullable().optional() });
/** Grown-up controls per kid, on top of name/avatar/PIN. */
export const kidUpdateBody = kidBody.partial().extend({
  starValueCents: cents.nullable().optional(),
  effortBoost: z.number().min(EFFORT_BOOST.min).max(EFFORT_BOOST.max).optional(),
  trusted: z.boolean().optional(),
});
export const giftBody = z.object({
  amountCents: z.number().int().min(-1_000_000).max(1_000_000).refine((n) => n !== 0, 'Pick an amount'),
  label: z.string().trim().min(1).max(60),
});

const repeat: z.ZodType<Repeat> = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('once'), date: dateKey }),
  z.object({ kind: z.literal('daily') }),
  z.object({ kind: z.literal('weekly'), days: z.array(z.number().int().min(0).max(6)).min(1, 'Pick at least one day') }),
]);
export const questBody = z.object({
  title: z.string().trim().min(1, 'Give the quest a name').max(60),
  // null = no picture; the app shows a letter tile instead.
  icon: z.enum(QUEST_ICONS).nullable(),
  stars: z.number().int().min(MIN_STARS).max(MAX_STARS),
  rewardCents: cents.optional(),
  repeat,
  autoApprove: z.boolean().optional(),
});
export const newQuestBody = questBody.extend({ kidIds: z.array(objectId).min(1, 'Pick at least one kid') });
export const dayQuery = z.object({ date: dateKey });
const helperIds = z.array(objectId).max(10);
export const questActionBody = z.object({ date: dateKey, kidId: objectId.optional(), helperIds: helperIds.optional() });
export const helpersBody = z.object({ date: dateKey, kidId: objectId.optional(), helperIds });

export const rewardBody = z.object({
  title: z.string().trim().min(1, 'Give the reward a name').max(60),
  icon: z.enum(REWARD_ICONS).nullable(),
  priceCents: z.number().int().min(1, 'Price must be at least 1 cent').max(1_000_000),
});

export const kidQuery = z.object({ kidId: objectId.optional() });
export const growParams = z.object({ kind: z.enum(ACCOUNT_KINDS), direction: z.enum(['deposit', 'withdraw']) });
export const transferBody = z.object({ amountCents: cents.min(1, 'Pick an amount'), kidId: objectId.optional() });
export const idParam = z.object({ id: objectId });

export const hatBody = z.object({ hat: z.enum(HAT_IDS), kidId: objectId.optional() });
export const goalBody = z
  .object({ title: z.string().trim().min(1).max(40), icon: z.enum(REWARD_ICONS).nullable(), targetCents: z.number().int().min(1).max(1_000_000) })
  .nullable();
export const goalRequest = z.object({ goal: goalBody, kidId: objectId.optional() });

export const teamGoalBody = z.object({
  title: z.string().trim().min(1, 'Name the prize').max(60),
  icon: z.enum(REWARD_ICONS).nullable(),
  targetPoints: z.number().int().min(1).max(100_000),
  kidIds: z.array(objectId).min(1, 'Pick at least one kid'),
});
export const milestoneBody = z.object({
  kind: z.enum(['helper', 'level']).default('helper'),
  title: z.string().trim().min(1, 'Name the prize').max(60),
  icon: z.enum(REWARD_ICONS).nullable(),
  points: z.number().int().min(1).max(100_000),
});

export const lessonAnswersBody = z.object({ answers: z.array(z.number().int().min(0).max(9)).min(1).max(10) });

export const assignLessonBody = z.object({
  kidIds: z.array(objectId).min(1, 'Pick at least one kid'),
  /** Null means "use the family's lesson reward". */
  rewardCents: cents.nullable(),
});
export const unassignLessonBody = z.object({ kidId: objectId });
