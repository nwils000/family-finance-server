// Kapital Plus: the one table of what each plan allows. The server enforces it
// (server/src/services/billing.ts) and the client shows it (features/billing.tsx);
// neither keeps its own copy. One subscription covers the whole family.
// Modeled on Mentis shared/subscriptionConstants.ts PLAN_LIMITS.

export const PLANS = ['free', 'plus'] as const;
export type Plan = (typeof PLANS)[number];

export const PLAN_NAMES: Record<Plan, string> = { free: 'Free', plus: 'Kapital Plus' };

/** Things a family can have a counted number of. `null` means unlimited. */
export const PLAN_LIMIT_KEYS = ['kids', 'teamGoals'] as const;
export type PlanLimitKey = (typeof PLAN_LIMIT_KEYS)[number];

/** Whole features a plan switches on or off. Names match the family feature switches. */
export const PLAN_FEATURES = ['rocket', 'teamGoals', 'assists'] as const;
export type PlanFeature = (typeof PLAN_FEATURES)[number];

export interface PlanRules {
  limits: Record<PlanLimitKey, number | null>;
  features: Record<PlanFeature, boolean>;
}

/**
 * Free keeps the whole core loop: quests, shop, piggy bank, daily chest, savings
 * goals and co-parent invites. Plus adds room for bigger families and the extras.
 */
export const PLAN_LIMITS: Record<Plan, PlanRules> = {
  free: {
    limits: { kids: 2, teamGoals: 1 },
    features: { rocket: false, teamGoals: true, assists: false },
  },
  plus: {
    limits: { kids: null, teamGoals: null },
    features: { rocket: true, teamGoals: true, assists: true },
  },
};

export const planAllows = (plan: Plan, feature: PlanFeature) => PLAN_LIMITS[plan].features[feature];
export const planLimit = (plan: Plan, key: PlanLimitKey) => PLAN_LIMITS[plan].limits[key];
/** True when a family that already has `currentCount` of `key` may add one more. */
export const canAddMore = (plan: Plan, key: PlanLimitKey, currentCount: number) => {
  const limit = planLimit(plan, key);
  return limit === null || currentCount < limit;
};

/** The error code every plan refusal carries (HTTP 402). The client opens the upsell on it. */
export const PLAN_LIMIT_CODE = 'PLAN_LIMIT';

/** The RevenueCat entitlement id that means "this family has Plus". Must match the RevenueCat dashboard. */
export const PLUS_ENTITLEMENT = 'plus';
