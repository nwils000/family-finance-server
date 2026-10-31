// Shapes the API returns. Mirrors the server's shape* functions.
import type {
  AgeBand,
  LessonArtId,
  LessonCategory,
  LessonVersion,
  AccountKind,
  AvatarId,
  BadgeId,
  Cents,
  Features,
  HatId,
  Plan,
  PlanRules,
  QuestIconId,
  Repeat,
  RewardIconId,
  Theme,
  TxnKind,
} from '@kk/shared';

export type Role = 'parent' | 'kid';

export interface User {
  id: string;
  familyId: string;
  role: Role;
  name: string;
  avatar: AvatarId;
  email: string | null;
  balanceCents: Cents;
  /** Grown-ups: whether the email is confirmed (adding kids waits for it). Always true for kids. */
  emailVerified: boolean;
  /** False for a Google/Apple-only grown-up, who sets a first password through a reset link. */
  hasPassword: boolean;
}

export interface Session {
  accessToken: string;
  user: User;
  refreshToken?: string;
}

export interface FamilySettings {
  id: string;
  name: string;
  code: string;
  starValueCents: Cents;
  piggyRatePct: number;
  rocketMinPct: number;
  rocketMaxPct: number;
  theme: Theme;
  features: Features;
  /** Coins for each lesson finished (0 = XP only). */
  lessonRewardCents: Cents;
  /** Coins for each level reached (0 = none). */
  levelUpBonusCents: Cents;
  /** 'open': kids see the whole library for their age; 'assigned': only lessons a grown-up picked. */
  learnMode: LearnMode;
}

export type LearnMode = 'open' | 'assigned';

export interface Goal {
  title: string;
  icon: RewardIconId | null;
  targetCents: Cents;
}

export interface Kid {
  id: string;
  name: string;
  avatar: AvatarId;
  balanceCents: Cents;
  piggyCents: Cents;
  rocketCents: Cents;
  xp: number;
  hat: HatId;
  /** The kid's own coins per star; null means the family default. */
  starValueCents: Cents | null;
  /** How much this kid's effort counts toward team goals. */
  effortBoost: number;
  assistPoints: number;
  /** Trusted kid: every quest pays on "I did it!" without a grown-up check. */
  trusted: boolean;
  /** Null until a grown-up sets it; lessons then default to the middle band. */
  age: number | null;
  lessonsDone: number;
  goal: Goal | null;
  streak: number;
  questsDone: number;
  badges: BadgeId[];
}

export interface Home {
  family: FamilySettings;
  parents: { id: string; name: string; avatar: AvatarId }[];
  kids: Kid[];
  /** Every kid's name and avatar, so a kid can tag who helped. */
  siblings: (KidRef & { hat: HatId })[];
}

export type RunStatus = 'done' | 'approved' | 'rejected';

export interface Quest {
  id: string;
  kidId: string;
  title: string;
  icon: QuestIconId | null;
  stars: number;
  rewardCents: Cents;
  repeat: Repeat;
  /** Trusted quest: pays on "I did it!" without a grown-up check. */
  autoApprove: boolean;
}

export interface DayQuest extends Quest {
  run: { id: string; status: RunStatus; helperIds: string[]; autoApproved?: boolean } | null;
}

export interface Day {
  date: string;
  chestOpened: boolean;
  quests: DayQuest[];
}

export interface Reward {
  id: string;
  title: string;
  icon: RewardIconId | null;
  priceCents: Cents;
}

export interface Purchase {
  id: string;
  kidId: string;
  title: string;
  icon: RewardIconId | null;
  priceCents: Cents;
  status: 'pending' | 'fulfilled' | 'declined';
  /** Bought in the shop, or unlocked with helper points. */
  source: 'shop' | 'milestone';
  createdAt: string;
}

export interface GrowAccount {
  kind: AccountKind;
  balanceCents: Cents;
  lastGrowthPct: number;
  nextGrowthAt: string;
}

export interface Grow {
  walletCents: Cents;
  piggyRatePct: number;
  rocketMinPct: number;
  rocketMaxPct: number;
  accounts: GrowAccount[];
}

export interface ActivityItem {
  id: string;
  kidId: string;
  amountCents: Cents;
  kind: TxnKind;
  label: string;
  pot: 'wallet' | AccountKind;
  createdAt: string;
}

export interface KidRef {
  id: string;
  name: string;
  avatar: AvatarId;
}

export interface Approvals {
  quests: { runId: string; dateKey: string; kid?: KidRef; title: string; icon: QuestIconId | null; stars: number; rewardCents: Cents; helpers: KidRef[] }[];
  purchases: { id: string; kid?: KidRef; title: string; icon: RewardIconId | null; priceCents: Cents; source: 'shop' | 'milestone' }[];
  teamPrizes: TeamGoal[];
}

export interface XpResult {
  xp: number;
  levelUp: number | null;
  /** Coins the family's level-up bonus paid for the levels just reached. */
  bonusCents: Cents;
}

export interface TeamGoal {
  id: string;
  title: string;
  icon: RewardIconId | null;
  targetPoints: number;
  progress: number;
  status: 'active' | 'reached' | 'handed';
  kidIds: string[];
  contributions: { kidId: string; points: number; share: number }[];
}

export interface Milestone {
  id: string;
  /** 'helper': unlocks at this many helper points. 'level': unlocks on reaching this level. */
  kind: 'helper' | 'level';
  title: string;
  icon: RewardIconId | null;
  points: number;
  unlocked: boolean;
}

/* ---------- Accounts and Kapital Plus ---------- */

export interface SocialProviders {
  google: { clientId: string } | null;
  apple: { clientId: string; redirectUri: string } | null;
  appleNative: boolean;
}
/** Social sign-in may join a family by code or name a new one. */
export interface SocialExtras {
  /** A grown-up invite link token: join that family instead of starting one. */
  invite?: string;
  familyName?: string;
  /** Agreed to the Terms and Privacy Policy; the server needs it only when this sign-in creates the account. */
  acceptLegal?: boolean;
}

export interface BillingStatus {
  plan: Plan;
  planName: string;
  rules: PlanRules;
  status: 'active' | 'past_due' | 'cancelled' | 'inactive';
  source: 'stripe' | 'revenuecat' | 'manual' | null;
  renewsAt: string | null;
  cancelAtPeriodEnd: boolean;
  usage: { kids: number };
  web: { checkout: boolean; portal: boolean };
}

export interface LessonListItem {
  id: string;
  art: LessonArtId;
  category: LessonCategory;
  version: LessonVersion;
  done: boolean;
  /** Picked by a grown-up. */
  assigned: boolean;
  /** Coins for finishing it (0 = XP only). */
  rewardCents: Cents;
}

export interface LessonList {
  age: number | null;
  band: AgeBand;
  learnMode: LearnMode;
  lessons: LessonListItem[];
}

export interface LessonResult extends XpResult {
  passed: boolean;
  /** Right or wrong, per question. */
  correct: boolean[];
  paidCents: Cents;
}
