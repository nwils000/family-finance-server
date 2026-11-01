// Resets the local database to a demo family. Never run against production.
import mongoose from 'mongoose';
import { defaultRewardCents, LEGAL_VERSIONS, toDateKey } from '@kk/shared';
import { config } from '../config.js';
import { Family, Quest, QuestRun, Reward, User } from '../models.js';
import { hashPassword, hashPin } from '../services/accounts.js';
import { ensureAccounts, move, transfer } from '../services/money.js';

// Only ever on a local machine: anything hosted (or an unknown NODE_ENV) is refused.
if (config.isHosted) throw new Error(`Refusing to seed a ${config.appEnv} database`);
await mongoose.connect(config.mongoUrl);
await mongoose.connection.dropDatabase();

const family = await Family.create({ name: 'The Demo Family', code: 'DEMO42' });
const familyId = family._id;
await User.create({
  familyId,
  role: 'parent',
  name: 'Sam',
  avatar: 'owl',
  email: 'demo@kidkapital.app',
  passwordHash: await hashPassword('password123'),
  // Verified, so the demo grown-up can add kids and invite grown-ups right away.
  emailVerifiedAt: new Date(),
  // Agreed to the current documents, so the demo signs in without the re-accept sheet.
  legalAccepted: { ...LEGAL_VERSIONS, at: new Date() },
});
const mk = async (name: string, avatar: string, pin: string) => {
  // Demo kids are made by the operator, so they carry consent and are never locked.
  const kidConsent = { at: new Date(), method: 'operator', noticeVersion: LEGAL_VERSIONS.privacy };
  const kid = await User.create({ familyId, role: 'kid', name, avatar, pinHash: await hashPin(pin), kidConsent });
  await ensureAccounts(familyId, kid._id);
  return kid;
};
const maya = await mk('Maya', 'fox', '1234');
const leo = await mk('Leo', 'dino', '5678');

const today = toDateKey(new Date());
const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toDateKey(d);
};
const quest = (kidId: unknown, title: string, icon: string, stars: number, repeat: object) =>
  Quest.create({ familyId, kidId, title, icon, stars, rewardCents: defaultRewardCents(stars, family.starValueCents), repeat, startKey: daysAgo(10) });

const mayaBed = await quest(maya._id, 'Make your bed', 'bed', 1, { kind: 'daily' });
await quest(maya._id, 'Feed Biscuit', 'dog', 2, { kind: 'daily' });
await quest(maya._id, 'Do the dishes', 'dishes', 3, { kind: 'weekly', days: [1, 3, 5] });
await quest(maya._id, 'Read for 20 minutes', 'reading', 2, { kind: 'daily' });
await quest(maya._id, 'Water the plants', 'plant', 1, { kind: 'weekly', days: [0, 2, 4, 6] });
const leoTrash = await quest(leo._id, 'Take out the trash', 'trash', 3, { kind: 'daily' });
await quest(leo._id, 'Tidy your toys', 'toys', 2, { kind: 'daily' });
await quest(leo._id, 'Brush your teeth', 'toothbrush', 1, { kind: 'daily' });
await quest(leo._id, 'Wash the car', 'carwash', 5, { kind: 'once', date: today });

// A few days of history so streaks, balances and the activity feed have life.
for (const n of [1, 2, 3]) {
  await QuestRun.create({ familyId, questId: mayaBed._id, kidId: maya._id, dateKey: daysAgo(n), status: 'approved', paidCents: 25 });
  await move({ familyId, kidId: maya._id, amountCents: 25, kind: 'quest', label: 'Make your bed' });
}
await move({ familyId, kidId: maya._id, amountCents: 500, kind: 'gift', label: 'Birthday money from Grandma' });
await move({ familyId, kidId: leo._id, amountCents: 300, kind: 'gift', label: 'Welcome bonus!' });
await transfer({ familyId, kidId: maya._id }, 'wallet', 'piggy', 200, 'Into Piggy bank');
await QuestRun.create({ familyId, questId: leoTrash._id, kidId: leo._id, dateKey: daysAgo(1), status: 'done' });

await Reward.insertMany([
  { familyId, title: 'Ice cream trip', icon: 'icecream', priceCents: 300 },
  { familyId, title: '30 min video games', icon: 'gamepad', priceCents: 150 },
  { familyId, title: 'Pick the movie', icon: 'movie', priceCents: 200 },
  { familyId, title: 'Pizza night', icon: 'pizza', priceCents: 500 },
  { familyId, title: 'Stay up 30 min late', icon: 'moon', priceCents: 250 },
  { familyId, title: 'Sleepover', icon: 'tent', priceCents: 1000 },
]);

console.log(`Seeded. Parent: demo@kidkapital.app / password123. Family code DEMO42. Maya PIN 1234, Leo PIN 5678.`);
await mongoose.disconnect();
