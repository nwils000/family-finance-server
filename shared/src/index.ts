// Rules shared by the client and the server. Each one lives here and only here.

/**
 * Every amount in the system is an integer (still named cents in the data). It is shown as that
 * many COINS, never as dollars: coins are pretend, and a family that ties them to real allowance
 * pays outside the app (Terms). One coin is one stored unit.
 */
export type Cents = number;

/** An amount as a plain number of coins: "1,250", "-40". `<Money>` draws the coin beside it. */
export const formatCoins = (cents: Cents): string => {
  const n = Math.round(cents);
  return `${n < 0 ? '-' : ''}${Math.abs(n).toLocaleString('en-US')}`;
};

/** An amount in a sentence: "1 coin", "125 coins". */
export const coinsText = (cents: Cents): string => `${formatCoins(cents)} ${Math.abs(Math.round(cents)) === 1 ? 'coin' : 'coins'}`;

export const AVATARS = [
  'fox', 'panda', 'frog', 'cat', 'bunny', 'bear', 'owl', 'unicorn', 'dino', 'octopus',
] as const;
export type AvatarId = (typeof AVATARS)[number];

/** Quest stickers, grouped for the picker. Ids are stored in the database: add, never rename. */
export const QUEST_ICON_GROUPS = {
  chores: ['bed', 'dishes', 'trash', 'laundry', 'broom', 'vacuum', 'table', 'toys', 'carwash', 'dust', 'mop', 'windows', 'bathroom', 'counters', 'dishwasher', 'fold', 'putaway', 'recycling', 'groceries', 'cook', 'lunch', 'backpack', 'organize'],
  outside: ['plant', 'leaves', 'lawn', 'snow', 'garden', 'outside', 'bike', 'sports', 'swim', 'exercise', 'dance'],
  'self-care': ['toothbrush', 'shower', 'dressed', 'hair', 'handwash', 'bedtime', 'wakeup', 'veggies', 'water', 'noscreens'],
  learning: ['homework', 'reading', 'music', 'math', 'writing', 'science', 'language', 'coding', 'puzzle', 'drawing'],
  kindness: ['sibling', 'kindness', 'call', 'thankyou', 'share'],
  pets: ['dog', 'petfood', 'fish', 'litter', 'groom'],
} as const;
export const QUEST_ICONS = Object.values(QUEST_ICON_GROUPS).flat() as unknown as readonly [QuestIconId, ...QuestIconId[]];
export type QuestIconId = (typeof QUEST_ICON_GROUPS)[keyof typeof QUEST_ICON_GROUPS][number];

/** Reward and goal stickers, grouped for the picker. Ids are stored in the database: add, never rename. */
export const REWARD_ICON_GROUPS = {
  treats: ['icecream', 'pizza', 'candy', 'donut', 'cookie', 'cake', 'burger', 'smoothie', 'restaurant'],
  fun: ['gamepad', 'movie', 'tablet', 'headphones', 'moon', 'tent', 'boardgame', 'puzzle', 'mic', 'playdate', 'pickdinner'],
  stuff: ['toycar', 'book', 'teddy', 'art', 'gift', 'blocks', 'doll', 'ball', 'sneakers', 'clothes', 'robot', 'skateboard', 'scooter', 'camera', 'phone', 'kite'],
  outings: ['park', 'bike', 'zoo', 'themepark', 'pool', 'beach', 'trip', 'tickets', 'bowling', 'museum'],
  'big goals': ['college', 'charity', 'newpet'],
} as const;
export const REWARD_ICONS = Object.values(REWARD_ICON_GROUPS).flat() as unknown as readonly [RewardIconId, ...RewardIconId[]];
export type RewardIconId = (typeof REWARD_ICON_GROUPS)[keyof typeof REWARD_ICON_GROUPS][number];

/** Difficulty is 1 to 5 stars. A quest's default reward is stars x the family's star value. */
export const MIN_STARS = 1;
export const MAX_STARS = 5;

/**
 * Trust: a quest pays out the moment the kid taps "I did it!" (no grown-up check) when
 * the grown-up trusts that quest, or trusts that kid with every quest.
 */
export const autoApproves = (quest: { autoApprove?: boolean | null }, kid: { trusted?: boolean | null }) =>
  !!quest.autoApprove || !!kid.trusted;

/** A quest's reward when the grown-up does not set a custom one. */
export const defaultRewardCents = (stars: number, starValueCents: Cents) => stars * starValueCents;

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export type Repeat =
  | { kind: 'once'; date: string } // YYYY-MM-DD
  | { kind: 'daily' }
  | { kind: 'weekly'; days: number[] }; // 0 = Sunday

/** Local calendar date as YYYY-MM-DD. */
export const toDateKey = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** The one rule for "is this quest due on this day". */
export const isDueOn = (repeat: Repeat, dateKey: string, createdKey: string): boolean => {
  if (dateKey < createdKey && repeat.kind !== 'once') return false;
  if (repeat.kind === 'once') return repeat.date === dateKey;
  if (repeat.kind === 'daily') return true;
  const [y, m, d] = dateKey.split('-').map(Number);
  return repeat.days.includes(new Date(y, m - 1, d).getDay());
};

/** Every kind of money movement in the activity log. */
export const TXN_KINDS = ['quest', 'purchase', 'refund', 'deposit', 'withdraw', 'growth', 'gift', 'lesson', 'bonus'] as const;
export type TxnKind = (typeof TXN_KINDS)[number];
/** Moves between a kid's own pots: not money earned or spent, so feeds show them once and neutral. */
export const TRANSFER_KINDS = ['deposit', 'withdraw'] as const satisfies readonly TxnKind[];
export const isTransfer = (kind: TxnKind) => (TRANSFER_KINDS as readonly TxnKind[]).includes(kind);

export const ACCOUNT_KINDS = ['piggy', 'rocket'] as const;
export type AccountKind = (typeof ACCOUNT_KINDS)[number];
export const POT_NAMES: Record<AccountKind, string> = { piggy: 'Piggy bank', rocket: 'Rocket fund' };
/** Growth is credited once per this many days. */
export const GROWTH_PERIOD_DAYS = 7;

export const PIN_LENGTH = 4;

// ---- Gamification: XP, levels, hats, features ----

/** XP for one approved quest. */
export const xpForStars = (stars: number) => stars * 10;
/** XP for opening the daily chest (all of today's quests finished). */
export const CHEST_XP = 25;

/** Total XP needed to reach a level: 0, 40, 120, 240, 400... */
export const xpForLevel = (level: number) => 20 * level * (level - 1);

export const levelFor = (xp: number) => {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level++;
  const floor = xpForLevel(level);
  const ceil = xpForLevel(level + 1);
  return { level, intoLevel: xp - floor, levelSize: ceil - floor, progress: (xp - floor) / (ceil - floor) };
};

const LEVEL_TITLES = [
  'Penny Rookie', 'Coin Collector', 'Piggy Pal', 'Savvy Saver', 'Quest Hero',
  'Money Maker', 'Budget Boss', 'Gold Getter', 'Treasure Hunter', 'Kapital Legend',
] as const;
export const levelTitle = (level: number) => LEVEL_TITLES[Math.min(Math.floor((level - 1) / 2), LEVEL_TITLES.length - 1)];

export const HATS = [
  { id: 'none', name: 'No hat', level: 1 },
  { id: 'party', name: 'Party hat', level: 2 },
  { id: 'cap', name: 'Ball cap', level: 3 },
  { id: 'bow', name: 'Big bow', level: 4 },
  { id: 'chef', name: 'Chef hat', level: 5 },
  { id: 'crown', name: 'Crown', level: 6 },
  { id: 'wizard', name: 'Wizard hat', level: 8 },
  { id: 'pirate', name: 'Pirate hat', level: 10 },
  { id: 'unicorn-horn', name: 'Unicorn horn', level: 12 },
  { id: 'astronaut', name: 'Space helmet', level: 15 },
] as const;
export type HatId = (typeof HATS)[number]['id'];
export const HAT_IDS = HATS.map((h) => h.id) as unknown as readonly [HatId, ...HatId[]];
export const hatUnlocked = (hat: HatId, level: number) => (HATS.find((h) => h.id === hat)?.level ?? Infinity) <= level;

/** Family switches grown-ups can flip. */
export const FEATURES = ['shop', 'piggy', 'rocket', 'chest', 'goals', 'teamGoals', 'assists', 'learn'] as const;
export type Feature = (typeof FEATURES)[number];
export type Features = Record<Feature, boolean>;
export const DEFAULT_FEATURES: Features = { shop: true, piggy: true, rocket: true, chest: true, goals: true, teamGoals: true, assists: true, learn: true };

/** Family theme colors (CSS token names on the client). */
export const THEMES = ['grape', 'sky', 'mint', 'coral', 'sunny'] as const;
export type Theme = (typeof THEMES)[number];

export const BADGE_IDS = ['first-quest', 'streak', 'saver', 'shopper', 'helper', 'rocketeer'] as const;
export type BadgeId = (typeof BADGE_IDS)[number];
/** The numbers behind the badges. Awarded in server/src/services/stats.ts, described in the art's BADGES. */
export const BADGE_RULES = { streakDays: 3, helperQuests: 10 } as const;

// ---- Teamwork: team goals and helper (assist) points ----

/**
 * A kid's effort boost multiplies the team-goal points their quests earn. Grown-ups
 * use it so a younger kid on a lower star value still counts fully toward a shared
 * prize: team progress measures effort (stars x boost), never coins earned.
 */
export const EFFORT_BOOST = { min: 0.5, max: 3, step: 0.25, default: 1 } as const;
export const teamPointsFor = (stars: number, boost: number) => Math.round(stars * boost * 100) / 100;

/** Helping a sibling earns assist points equal to the quest's stars, plus a little XP. The doer keeps every coin. */
export const assistPointsFor = (stars: number) => stars;
export const assistXpFor = (stars: number) => Math.ceil(xpForStars(stars) / 2);

/** Share of a team goal, 0..1, from contribution points. */
export const contributionShare = (mine: number, total: number) => (total > 0 ? mine / total : 0);

export * from './password';
export * from './learn';
export * from './legal';
export * from './creator';
export * from './form-guard';
