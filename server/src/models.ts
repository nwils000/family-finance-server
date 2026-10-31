import mongoose, { Schema, Types, type InferSchemaType } from 'mongoose';
import {
  ACCOUNT_KINDS, AVATARS, DEFAULT_FEATURES, EFFORT_BOOST, FEATURES, HAT_IDS, MAX_STARS, MIN_STARS, QUEST_ICONS, REWARD_ICONS, THEMES, TXN_KINDS,
} from '@kk/shared';

const { model } = mongoose;
const id = Schema.Types.ObjectId;
const opts = { timestamps: true } as const;

const familySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    code: { type: String, required: true, unique: true },
    starValueCents: { type: Number, default: 25, min: 0 },
    piggyRatePct: { type: Number, default: 2, min: 0, max: 50 },
    rocketMinPct: { type: Number, default: -8, min: -50, max: 0 },
    rocketMaxPct: { type: Number, default: 12, min: 0, max: 100 },
    theme: { type: String, enum: THEMES, default: 'grape' },
    // Grown-up incentives: coins for each lesson finished, and for each level reached.
    lessonRewardCents: { type: Number, default: 0, min: 0 },
    levelUpBonusCents: { type: Number, default: 0, min: 0 },
    // 'open': kids see the whole library for their age; 'assigned': only lessons a grown-up picked.
    learnMode: { type: String, enum: ['open', 'assigned'], default: 'open' },
    /** Last time anyone in the family signed in or renewed a session (auth.ts issueSession), at most daily. Drives the retention limit. */
    lastActiveAt: { type: Date, default: () => new Date(), index: true },
    features: {
      type: new Schema(Object.fromEntries(FEATURES.map((f) => [f, { type: Boolean, default: DEFAULT_FEATURES[f] }])), { _id: false }),
      default: () => ({ ...DEFAULT_FEATURES }),
    },
  },
  opts,
);
export const Family = model('Family', familySchema);

const userSchema = new Schema(
  {
    familyId: { type: id, ref: 'Family', required: true, index: true },
    role: { type: String, enum: ['parent', 'kid'], required: true },
    name: { type: String, required: true, trim: true, maxlength: 40 },
    avatar: { type: String, enum: AVATARS, default: 'fox' },
    // Parents sign in with email + password, kids with the family code + a PIN.
    email: { type: String, lowercase: true, trim: true, sparse: true, unique: true },
    passwordHash: String,
    // When a grown-up proved they own `email` (emailed link, or a provider-verified
    // Google/Apple sign-in). Adding kids and inviting grown-ups wait for it.
    emailVerifiedAt: { type: Date, default: null },
    // Which Terms and Privacy Policy versions this grown-up agreed to, and when (@kk/shared LEGAL_VERSIONS).
    legalAccepted: { type: { terms: String, privacy: String, at: Date }, default: null },
    pinHash: String,
    // Lockout state, changed only by services/accounts.ts verifySecret with atomic
    // updates. failedLogins counts attempts since the last success or lock;
    // lockouts counts locks ever (kids escalate 5 min, 1 h, 24 h) and only a
    // grown-up changing the PIN clears it.
    failedLogins: { type: Number, default: 0 },
    lockedUntil: Date,
    lockouts: { type: Number, default: 0 },
    // Wallet balance. Only ever changed through services/money.ts.
    balanceCents: { type: Number, default: 0 },
    // Gamification (kids only).
    xp: { type: Number, default: 0, min: 0 },
    // Grown-up controls per kid: their own coins per star (null = family default)
    // and how much their effort counts toward team goals.
    starValueCents: { type: Number, default: null, min: 0 },
    effortBoost: { type: Number, default: EFFORT_BOOST.default, min: EFFORT_BOOST.min, max: EFFORT_BOOST.max },
    // Lifetime helper points; only ever changed in services/game.ts.
    assistPoints: { type: Number, default: 0, min: 0 },
    // Trusted kid: every quest pays out on "I did it!" without a grown-up check.
    trusted: { type: Boolean, default: false },
    // Stored as a birth year (not an age) so lessons grow up with the kid.
    birthYear: { type: Number, default: null, min: 1990 },
    hat: { type: String, enum: HAT_IDS, default: 'none' },
    goal: {
      type: new Schema({ title: String, icon: { type: String, enum: [...REWARD_ICONS, null], default: null }, targetCents: Number }, { _id: false }),
      default: null,
    },
  },
  opts,
);
export const User = model('User', userSchema);
export type UserDoc = InferSchemaType<typeof userSchema> & { _id: Types.ObjectId };

const refreshTokenSchema = new Schema({
  userId: { type: id, required: true, index: true },
  tokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, expires: 0 },
});
export const RefreshToken = model('RefreshToken', refreshTokenSchema);

const questSchema = new Schema(
  {
    familyId: { type: id, required: true, index: true },
    kidId: { type: id, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 60 },
    icon: { type: String, enum: [...QUEST_ICONS, null], default: null },
    stars: { type: Number, min: MIN_STARS, max: MAX_STARS, required: true },
    rewardCents: { type: Number, min: 0, required: true },
    repeat: { type: Schema.Types.Mixed, required: true },
    startKey: { type: String, required: true },
    active: { type: Boolean, default: true },
    // Trusted quest: pays out on "I did it!" without a grown-up check.
    autoApprove: { type: Boolean, default: false },
  },
  opts,
);
export const Quest = model('Quest', questSchema);

const questRunSchema = new Schema(
  {
    familyId: { type: id, required: true, index: true },
    questId: { type: id, ref: 'Quest', required: true },
    kidId: { type: id, required: true },
    dateKey: { type: String, required: true },
    status: { type: String, enum: ['done', 'approved', 'rejected'], required: true },
    paidCents: { type: Number, default: 0 },
    // Siblings who helped. They earn assist points on approval; the doer keeps all the coins.
    helperIds: { type: [id], default: [] },
    // Approved by trust (no grown-up check), so grown-ups can tell in the history.
    autoApproved: { type: Boolean, default: false },
  },
  opts,
);
questRunSchema.index({ questId: 1, dateKey: 1 }, { unique: true });
questRunSchema.index({ familyId: 1, status: 1 });
export const QuestRun = model('QuestRun', questRunSchema);

const rewardSchema = new Schema(
  {
    familyId: { type: id, required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 60 },
    icon: { type: String, enum: [...REWARD_ICONS, null], default: null },
    priceCents: { type: Number, min: 1, required: true },
    active: { type: Boolean, default: true },
  },
  opts,
);
export const Reward = model('Reward', rewardSchema);

const purchaseSchema = new Schema(
  {
    familyId: { type: id, required: true, index: true },
    kidId: { type: id, ref: 'User', required: true },
    // Where the prize came from: bought in the shop, or unlocked by helper points.
    source: { type: String, enum: ['shop', 'milestone'], default: 'shop' },
    rewardId: { type: id, ref: 'Reward' },
    milestoneId: { type: id, ref: 'Milestone' },
    // Snapshot so editing a reward later never changes a past purchase.
    title: String,
    icon: String,
    priceCents: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'fulfilled', 'declined'], default: 'pending' },
  },
  opts,
);
export const Purchase = model('Purchase', purchaseSchema);

const accountSchema = new Schema(
  {
    familyId: { type: id, required: true, index: true },
    kidId: { type: id, ref: 'User', required: true },
    kind: { type: String, enum: ACCOUNT_KINDS, required: true },
    balanceCents: { type: Number, default: 0, min: 0 },
    lastGrowthAt: { type: Date, default: () => new Date() },
    lastGrowthPct: { type: Number, default: 0 },
  },
  opts,
);
accountSchema.index({ kidId: 1, kind: 1 }, { unique: true });
export const Account = model('Account', accountSchema);

const txnSchema = new Schema(
  {
    familyId: { type: id, required: true },
    kidId: { type: id, required: true },
    amountCents: { type: Number, required: true },
    kind: {
      type: String,
      enum: TXN_KINDS,
      required: true,
    },
    label: { type: String, required: true },
    // Which pot the amount landed in: the wallet or a growth account.
    pot: { type: String, enum: ['wallet', ...ACCOUNT_KINDS], default: 'wallet' },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
txnSchema.index({ familyId: 1, kidId: 1, createdAt: -1 });
export const Txn = model('Txn', txnSchema);

/** One chest per kid per day; the unique index makes opening it twice impossible. */
const chestOpenSchema = new Schema(
  {
    familyId: { type: id, required: true },
    kidId: { type: id, required: true },
    dateKey: { type: String, required: true },
    xp: { type: Number, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
chestOpenSchema.index({ kidId: 1, dateKey: 1 }, { unique: true });
export const ChestOpen = model('ChestOpen', chestOpenSchema);

/** A prize the whole family works toward together. Progress is effort points, not coins. */
const teamGoalSchema = new Schema(
  {
    familyId: { type: id, required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 60 },
    icon: { type: String, enum: [...REWARD_ICONS, null], default: null },
    targetPoints: { type: Number, required: true, min: 1 },
    kidIds: { type: [id], required: true },
    // kidId -> points; only changed through services/teamGoals.ts.
    contributions: { type: Map, of: Number, default: () => new Map() },
    progress: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'reached', 'handed', 'archived'], default: 'active' },
    reachedAt: Date,
  },
  opts,
);
export const TeamGoal = model('TeamGoal', teamGoalSchema);

/** A prize a kid unlocks by collecting helper points. */
const milestoneSchema = new Schema(
  {
    familyId: { type: id, required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 60 },
    icon: { type: String, enum: [...REWARD_ICONS, null], default: null },
    // 'helper': unlocks at this many helper points. 'level': unlocks on reaching this level.
    kind: { type: String, enum: ['helper', 'level'], default: 'helper' },
    points: { type: Number, required: true, min: 1 },
    active: { type: Boolean, default: true },
  },
  opts,
);
export const Milestone = model('Milestone', milestoneSchema);

/** Each kid unlocks each milestone once; the unique index makes a double unlock impossible. */
const milestoneClaimSchema = new Schema(
  { familyId: { type: id, required: true }, kidId: { type: id, required: true }, milestoneId: { type: id, required: true } },
  { timestamps: { createdAt: true, updatedAt: false } },
);
milestoneClaimSchema.index({ kidId: 1, milestoneId: 1 }, { unique: true });
export const MilestoneClaim = model('MilestoneClaim', milestoneClaimSchema);

/** One row per finished lesson; the unique index makes its XP payable only once. */
const lessonProgressSchema = new Schema(
  { familyId: { type: id, required: true }, kidId: { type: id, required: true }, lessonId: { type: String, required: true } },
  { timestamps: { createdAt: true, updatedAt: false } },
);
lessonProgressSchema.add({ paidCents: { type: Number, default: 0 } });
lessonProgressSchema.index({ kidId: 1, lessonId: 1 }, { unique: true });
export const LessonProgress = model('LessonProgress', lessonProgressSchema);

/** A lesson a grown-up picked for a kid, with an optional coin reward (null = family default). */
const lessonAssignmentSchema = new Schema(
  {
    familyId: { type: id, required: true, index: true },
    kidId: { type: id, required: true },
    lessonId: { type: String, required: true },
    rewardCents: { type: Number, default: null, min: 0 },
  },
  opts,
);
lessonAssignmentSchema.index({ kidId: 1, lessonId: 1 }, { unique: true });
export const LessonAssignment = model('LessonAssignment', lessonAssignmentSchema);
