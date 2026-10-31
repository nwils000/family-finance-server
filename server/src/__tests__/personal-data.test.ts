import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import mongoose, { Types } from 'mongoose';
import request from 'supertest';
import { INACTIVE_FAMILY_MONTHS, LEGAL_VERSIONS } from '@kk/shared';
import { createApp } from '../app.js';
import { useTestDb } from './testDb.js';
import { Account, Family, LessonProgress, Purchase, Quest, QuestRun, RefreshToken, TeamGoal, Txn, User } from '../models.js';
import { Entitlement } from '../models-account.js';
import { eraseFamily, eraseInactiveFamilies, eraseKid, eraseParent, exportFamily, FAMILY_DATA, KID_DATA, NOT_PERSONAL, USER_DATA } from '../services/personal-data.js';
import '../models-account.js';

useTestDb('personal-data');

/** A family with two grown-ups, two kids, and a trail of everyday data for kid A. */
const seed = async () => {
  const family = await Family.create({ name: 'Test', code: `T${Math.random().toString(36).slice(2, 7).toUpperCase()}` });
  const familyId = family._id;
  const [p1, p2] = await User.create([
    { familyId, role: 'parent', name: 'P1', email: `p1-${familyId}@x.com`, passwordHash: 'x' },
    { familyId, role: 'parent', name: 'P2', email: `p2-${familyId}@x.com`, passwordHash: 'x' },
  ]);
  const [a, b] = await User.create([
    { familyId, role: 'kid', name: 'A', avatar: 'fox', pinHash: 'x' },
    { familyId, role: 'kid', name: 'B', avatar: 'panda', pinHash: 'x' },
  ]);
  const quest = await Quest.create({ familyId, kidId: a._id, title: 'Dishes', stars: 2, rewardCents: 50, repeat: { kind: 'daily' }, startKey: '2026-01-01' });
  const questB = await Quest.create({ familyId, kidId: b._id, title: 'Bed', stars: 1, rewardCents: 25, repeat: { kind: 'daily' }, startKey: '2026-01-01' });
  await Promise.all([
    Account.create({ familyId, kidId: a._id, kind: 'piggy' }),
    Txn.create({ familyId, kidId: a._id, amountCents: 50, kind: 'quest', label: 'Dishes' }),
    QuestRun.create({ familyId, kidId: a._id, questId: quest._id, dateKey: '2026-01-02', status: 'approved' }),
    // B's quest run, where A helped: A's id must come off it.
    QuestRun.create({ familyId, kidId: b._id, questId: questB._id, dateKey: '2026-01-02', status: 'approved', helperIds: [a._id] }),
    Purchase.create({ familyId, kidId: a._id, title: 'Toy', priceCents: 100 }),
    LessonProgress.create({ familyId, kidId: a._id, lessonId: 'earn' }),
    RefreshToken.create({ userId: a._id, tokenHash: `h-${a._id}`, expiresAt: new Date(Date.now() + 86_400_000) }),
    TeamGoal.create({ familyId, title: 'Zoo', targetPoints: 100, kidIds: [a._id, b._id], contributions: { [String(a._id)]: 30, [String(b._id)]: 10 }, progress: 40 }),
  ]);
  return { familyId, p1, p2, a, b };
};

const kidRows = async (kidId: Types.ObjectId) =>
  (await Promise.all(KID_DATA.map((M) => (M as typeof Txn).countDocuments({ kidId })))).reduce((s, n) => s + n, 0);

describe('personal data', () => {
  it('every model holding kid, user or family data is erased, or says why not (a new model must pick a side)', () => {
    const covered = new Set([...KID_DATA, ...USER_DATA, ...FAMILY_DATA].map((M) => M.modelName));
    const exempt = new Set(Object.keys(NOT_PERSONAL));
    const holdsPersonal = Object.values(mongoose.models).filter((M) => ['kidId', 'userId', 'familyId'].some((k) => M.schema.path(k)));
    expect(holdsPersonal.map((M) => M.modelName).filter((n) => !covered.has(n) && !exempt.has(n))).toEqual([]);
  });

  it('removing a kid leaves nothing of theirs behind, and siblings keep their team progress', async () => {
    const { familyId, a, b } = await seed();
    expect(await kidRows(a._id)).toBeGreaterThan(0);
    await eraseKid(familyId, a._id);
    expect(await kidRows(a._id)).toBe(0);
    expect(await User.exists({ _id: a._id })).toBeNull();
    expect(await RefreshToken.countDocuments({ userId: a._id })).toBe(0);
    expect(await QuestRun.countDocuments({ helperIds: a._id })).toBe(0);
    const goal = (await TeamGoal.findOne({ familyId }))!;
    expect(goal.kidIds.map(String)).toEqual([String(b._id)]);
    expect(goal.contributions.get(String(a._id))).toBeUndefined();
    expect(goal.progress).toBe(40);
    // The sibling is untouched.
    expect(await kidRows(b._id)).toBeGreaterThan(0);
  });

  it('a grown-up leaving keeps the family while another grown-up remains; the last one deletes it', async () => {
    const { familyId, p1, p2 } = await seed();
    expect(await eraseParent(familyId, p1._id)).toEqual({ familyDeleted: false });
    expect(await Family.exists({ _id: familyId })).not.toBeNull();
    expect(await eraseParent(familyId, p2._id)).toEqual({ familyDeleted: true });
    expect(await Family.exists({ _id: familyId })).toBeNull();
    expect(await User.countDocuments({ familyId })).toBe(0);
    expect(await TeamGoal.countDocuments({ familyId })).toBe(0);
  });

  it('refuses to delete a family whose paid plan will charge again', async () => {
    const { familyId } = await seed();
    await Entitlement.create({ familyId, plan: 'plus', status: 'active', source: 'stripe', currentPeriodEnd: new Date(Date.now() + 86_400_000) });
    await expect(eraseFamily(familyId)).rejects.toMatchObject({ status: 409 });
    expect(await Family.exists({ _id: familyId })).not.toBeNull();
    // Once cancelled at period end, deletion goes ahead and forgets the plan row.
    await Entitlement.updateOne({ familyId }, { cancelAtPeriodEnd: true });
    await eraseFamily(familyId);
    expect(await Entitlement.exists({ familyId })).toBeNull();
  });

  it('export includes the family data and never a secret', async () => {
    const { familyId } = await seed();
    const out = await exportFamily(familyId);
    expect(out.members).toHaveLength(4);
    expect((out as unknown as Record<string, unknown[]>).Txn).toHaveLength(1);
    expect(JSON.stringify(out)).not.toMatch(/passwordHash|pinHash|tokenHash/);
  });

  it('deleting your account over HTTP re-checks the password and ends the session', async () => {
    const app = createApp();
    const signup = await request(app).post('/api/auth/signup').send({ name: 'Pat', email: 'del@x.com', password: 'Password123!', familyName: 'Del', acceptLegal: true });
    expect(signup.status).toBe(200);
    const auth = { Authorization: `Bearer ${signup.body.accessToken}` };
    const wrong = await request(app).post('/api/account/delete').set(auth).send({ password: 'nope' });
    expect(wrong.status).toBe(400);
    expect(await User.exists({ email: 'del@x.com' })).not.toBeNull();
    const ok = await request(app).post('/api/account/delete').set(auth).send({ password: 'Password123!' });
    expect(ok.status).toBe(200);
    expect(ok.body.familyDeleted).toBe(true);
    expect(await User.exists({ email: 'del@x.com' })).toBeNull();
    expect((await request(app).get('/api/auth/me').set(auth)).status).toBe(401);
  });

  it('only a grown-up can download the family data', async () => {
    const app = createApp();
    const signup = await request(app).post('/api/auth/signup').send({ name: 'Pat', email: 'exp@x.com', password: 'Password123!', familyName: 'Exp', acceptLegal: true });
    const res = await request(app).get('/api/account/export').set({ Authorization: `Bearer ${signup.body.accessToken}` });
    expect(res.status).toBe(200);
    expect(res.body.members[0].email).toBe('exp@x.com');
    expect(JSON.stringify(res.body)).not.toMatch(/Hash/);
  });

  it('retention: a family nobody signed in to for the published limit is erased whole; an active one stays', async () => {
    const monthsAgo = (m: number) => { const d = new Date(); d.setMonth(d.getMonth() - m); return d; };
    const stale = await seed();
    const fresh = await seed();
    const legacy = await seed();
    await Family.updateOne({ _id: stale.familyId }, { lastActiveAt: monthsAgo(INACTIVE_FAMILY_MONTHS + 1) });
    await Family.updateOne({ _id: fresh.familyId }, { lastActiveAt: monthsAgo(INACTIVE_FAMILY_MONTHS - 1) });
    // A family from before lastActiveAt existed counts from when it was created.
    await Family.collection.updateOne({ _id: legacy.familyId }, { $unset: { lastActiveAt: '' }, $set: { createdAt: monthsAgo(INACTIVE_FAMILY_MONTHS + 2) } });
    await eraseInactiveFamilies();
    expect(await Family.exists({ _id: stale.familyId })).toBeNull();
    expect(await User.countDocuments({ familyId: stale.familyId })).toBe(0);
    expect(await kidRows(stale.a._id)).toBe(0);
    expect(await Family.exists({ _id: legacy.familyId })).toBeNull();
    expect(await Family.exists({ _id: fresh.familyId })).not.toBeNull();
    expect(await kidRows(fresh.a._id)).toBeGreaterThan(0);
  });

  it('signing in counts as activity, so an active family is never erased', async () => {
    const app = createApp();
    const signup = await request(app).post('/api/auth/signup').send({ name: 'Pat', email: 'active@x.com', password: 'Password123!', familyName: 'Act', acceptLegal: true });
    const familyId = (await User.findOne({ email: 'active@x.com' }))!.familyId;
    await Family.updateOne({ _id: familyId }, { lastActiveAt: new Date(2000, 0, 1) });
    expect(signup.status).toBe(200);
    expect((await request(app).post('/api/auth/login').send({ email: 'active@x.com', password: 'Password123!' })).status).toBe(200);
    await new Promise((r) => setTimeout(r, 50)); // the activity note is not awaited by sign-in
    expect((await Family.findById(familyId))!.lastActiveAt!.getFullYear()).toBe(new Date().getFullYear());
    await eraseInactiveFamilies();
    expect(await Family.exists({ _id: familyId })).not.toBeNull();
  });

  it('no grown-up account exists without agreeing to the Terms and Privacy Policy, and the versions are kept', async () => {
    const app = createApp();
    const base = { name: 'Pat', email: 'legal@x.com', password: 'Password123!', familyName: 'Legal' };
    expect((await request(app).post('/api/auth/signup').send(base)).status).toBe(400);
    expect(await User.exists({ email: 'legal@x.com' })).toBeNull();
    expect((await request(app).post('/api/auth/signup').send({ ...base, acceptLegal: true })).status).toBe(200);
    const user = (await User.findOne({ email: 'legal@x.com' }))!;
    expect(user.legalAccepted).toMatchObject(LEGAL_VERSIONS);
  });
});
