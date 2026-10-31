import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import mongoose from 'mongoose';
import request from 'supertest';
import { markVerified, useTestDb } from './testDb.js';
import { LESSON_XP, LESSONS, toDateKey } from '@kk/shared';
import { createApp } from '../app.js';
import { REUSE_GRACE_MS } from '../auth.js';
import { SpentRefreshToken } from '../models-account.js';
import { runGrowth } from '../services/growth.js';
import { Account, Purchase, RefreshToken, Txn, User } from '../models.js';
import { Entitlement } from '../models-account.js';
import { requireLocalDev } from '../security.js';

const app = createApp();
const today = toDateKey(new Date());

useTestDb('api');

const bearer = (t: string) => ({ Authorization: `Bearer ${t}` });

const makeFamily = async (tag: string) => {
  const signup = await request(app)
    .post('/api/auth/signup')
    .send({ name: 'Pat', email: `${tag}@x.com`, password: 'Password123!', familyName: tag, acceptLegal: true });
  expect(signup.status).toBe(200);
  const parent = signup.body.accessToken as string;
  await markVerified(`${tag}@x.com`);
  const kidRes = await request(app).post('/api/family/kids').set(bearer(parent)).send({ name: 'Kiddo', avatar: 'fox', pin: '1234' });
  const kidId = kidRes.body.kid.id as string;
  const fam = await request(app).get('/api/family').set(bearer(parent));
  const kidLogin = await request(app).post('/api/auth/kid-login').send({ code: fam.body.family.code, kidId, pin: '1234' });
  expect(kidLogin.status).toBe(200);
  return { parent, kid: kidLogin.body.accessToken as string, kidId, code: fam.body.family.code as string };
};

const makeQuest = async (parent: string, kidId: string, stars = 2) => {
  const res = await request(app)
    .post('/api/quests')
    .set(bearer(parent))
    .send({ kidIds: [kidId], title: 'Dishes', icon: 'dishes', stars, repeat: { kind: 'daily' } });
  return res.body.quests[0].id as string;
};

describe('auth', () => {
  it('rotates refresh tokens and rejects a replayed one', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .set('X-Client-Platform', 'native')
      .send({ name: 'A', email: 'a@x.com', password: 'Password123!', familyName: 'A', acceptLegal: true });
    const first = res.body.refreshToken;
    const r1 = await request(app).post('/api/auth/refresh').send({ refreshToken: first });
    expect(r1.status).toBe(200);
    // Inside the grace window a replay is a benign race (two tabs); after it, the token is dead.
    await SpentRefreshToken.collection.updateMany({}, { $set: { createdAt: new Date(Date.now() - REUSE_GRACE_MS - 1000) } });
    const replay = await request(app).post('/api/auth/refresh').send({ refreshToken: first });
    expect(replay.status).toBe(401);
  });

  it('locks a kid out after 5 wrong PINs', async () => {
    const f = await makeFamily('lock');
    for (let i = 0; i < 5; i++) {
      await request(app).post('/api/auth/kid-login').send({ code: f.code, kidId: f.kidId, pin: '0000' });
    }
    const res = await request(app).post('/api/auth/kid-login').send({ code: f.code, kidId: f.kidId, pin: '1234' });
    expect(res.status).toBe(429);
  });
});

describe('family isolation and roles', () => {
  it('a parent cannot see or touch another family', async () => {
    const a = await makeFamily('a');
    const b = await makeFamily('b');
    const questB = await makeQuest(b.parent, b.kidId);
    expect((await request(app).post(`/api/quests/${questB}/done`).set(bearer(a.parent)).send({ date: today, kidId: b.kidId })).status).toBe(404);
    expect((await request(app).post(`/api/family/kids/${b.kidId}/gift`).set(bearer(a.parent)).send({ amountCents: 100, label: 'x' })).status).toBe(404);
    expect((await request(app).get('/api/activity').query({ kidId: b.kidId }).set(bearer(a.parent))).status).toBe(404);
  });

  it('a kid cannot approve their own quest or pay themselves', async () => {
    const f = await makeFamily('k');
    const quest = await makeQuest(f.parent, f.kidId);
    const done = await request(app).post(`/api/quests/${quest}/done`).set(bearer(f.kid)).send({ date: today });
    expect((await request(app).post(`/api/runs/${done.body.run.id}/approve`).set(bearer(f.kid))).status).toBe(403);
    expect((await request(app).post(`/api/family/kids/${f.kidId}/gift`).set(bearer(f.kid)).send({ amountCents: 100, label: 'x' })).status).toBe(403);
  });
});

describe('dev quick login', () => {
  it('is not mounted outside local development with ENABLE_DEV_ENDPOINTS', async () => {
    const f = await makeFamily('devlogin');
    // Not mounted: the request falls through to the signed-in routes and finds nothing.
    expect((await request(app).get('/api/auth/dev/accounts').set(bearer(f.parent))).status).toBe(404);
    const login = await request(app).post('/api/auth/dev/login').set('X-Requested-With', 'XMLHttpRequest').send({ id: f.kidId });
    expect(login.status).toBe(401);
    expect(login.body.accessToken).toBeUndefined();
  });

  it('requireLocalDev refuses a caller that is not on this machine, whatever X-Forwarded-For says', () => {
    const run = (remoteAddress: string) => {
      let status = 0;
      let passed = false;
      const res = { status: (s: number) => ((status = s), { json: () => undefined }) };
      requireLocalDev({ socket: { remoteAddress } } as never, res as never, () => (passed = true));
      return passed ? 'next' : status;
    };
    // config.devEndpoints is off under test, so even loopback is refused here.
    expect(run('127.0.0.1')).toBe(404);
    expect(run('203.0.113.9')).toBe(404);
  });
});

describe('pictures are optional', () => {
  it('quests, rewards and goals can be made without one', async () => {
    const f = await makeFamily('nopic');
    const q = await request(app).post('/api/quests').set(bearer(f.parent))
      .send({ kidIds: [f.kidId], title: 'Practice yoga', icon: null, stars: 2, repeat: { kind: 'daily' } });
    expect(q.status).toBe(200);
    expect(q.body.quests[0].icon).toBeNull();
    const r = await request(app).post('/api/shop/rewards').set(bearer(f.parent)).send({ title: 'Extra story', icon: null, priceCents: 50 });
    expect(r.status).toBe(200);
    expect(r.body.reward.icon).toBeNull();
    const g = await request(app).patch('/api/game/goal').set(bearer(f.kid)).send({ goal: { title: 'Lego castle', icon: null, targetCents: 4000 } });
    expect(g.status).toBe(200);
  });
});

describe('removing a kid', () => {
  it('leaves no accounts or sessions behind', async () => {
    const f = await makeFamily('rm');
    await request(app).delete(`/api/family/kids/${f.kidId}`).set(bearer(f.parent));
    expect(await Account.countDocuments({ kidId: f.kidId })).toBe(0);
    expect(await RefreshToken.countDocuments({ userId: f.kidId })).toBe(0);
  });
});

describe('money', () => {
  it('cannot claim quests from long ago', async () => {
    const f = await makeFamily('old');
    const quest = await makeQuest(f.parent, f.kidId);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const res = await request(app).post(`/api/quests/${quest}/done`).set(bearer(f.kid)).send({ date: toDateKey(weekAgo) });
    expect(res.status).toBe(400);
  });

  it('approving a quest pays exactly once, in cents', async () => {
    const f = await makeFamily('pay');
    const quest = await makeQuest(f.parent, f.kidId, 3); // 3 stars x 25 cents
    const done = await request(app).post(`/api/quests/${quest}/done`).set(bearer(f.kid)).send({ date: today });
    const runId = done.body.run.id;
    const [a, b] = await Promise.all([
      request(app).post(`/api/runs/${runId}/approve`).set(bearer(f.parent)),
      request(app).post(`/api/runs/${runId}/approve`).set(bearer(f.parent)),
    ]);
    expect([a.status, b.status].sort()).toEqual([200, 404]);
    expect((await User.findById(f.kidId))!.balanceCents).toBe(75);
  });

  it('cannot spend more than the wallet holds, even concurrently', async () => {
    const f = await makeFamily('spend');
    await request(app).post(`/api/family/kids/${f.kidId}/gift`).set(bearer(f.parent)).send({ amountCents: 300, label: 'gift' });
    const reward = await request(app).post('/api/shop/rewards').set(bearer(f.parent)).send({ title: 'Toy', icon: 'toycar', priceCents: 200 });
    const buys = await Promise.all([1, 2, 3].map(() => request(app).post(`/api/shop/rewards/${reward.body.reward.id}/buy`).set(bearer(f.kid))));
    expect(buys.filter((r) => r.status === 200)).toHaveLength(1);
    expect((await User.findById(f.kidId))!.balanceCents).toBe(100);
  });

  it('declining a purchase refunds it', async () => {
    const f = await makeFamily('refund');
    await request(app).post(`/api/family/kids/${f.kidId}/gift`).set(bearer(f.parent)).send({ amountCents: 300, label: 'gift' });
    const reward = await request(app).post('/api/shop/rewards').set(bearer(f.parent)).send({ title: 'Toy', icon: 'toycar', priceCents: 200 });
    const buy = await request(app).post(`/api/shop/rewards/${reward.body.reward.id}/buy`).set(bearer(f.kid));
    await request(app).post(`/api/shop/purchases/${buy.body.purchase.id}/decline`).set(bearer(f.parent));
    expect((await User.findById(f.kidId))!.balanceCents).toBe(300);
  });

  it('growth pays each week once, however often the job runs', async () => {
    const f = await makeFamily('grow');
    await request(app).post(`/api/family/kids/${f.kidId}/gift`).set(bearer(f.parent)).send({ amountCents: 1000, label: 'gift' });
    await request(app).post('/api/grow/piggy/deposit').set(bearer(f.kid)).send({ amountCents: 1000 });
    const twoWeeksLater = new Date(Date.now() + 15 * 86_400_000);
    await runGrowth(twoWeeksLater);
    await runGrowth(twoWeeksLater);
    const piggy = await Account.findOne({ kidId: f.kidId, kind: 'piggy' });
    expect(piggy!.balanceCents).toBe(1040); // 2% then 2% on 1020 = 20 + 20
    expect(await Txn.countDocuments({ kidId: f.kidId, kind: 'growth' })).toBe(2);
  });

  it('the activity feed shows a move between pots once, not as two rows', async () => {
    const f = await makeFamily('feedonce');
    await request(app).post(`/api/family/kids/${f.kidId}/gift`).set(bearer(f.parent)).send({ amountCents: 500, label: 'gift' });
    await request(app).post('/api/grow/piggy/deposit').set(bearer(f.kid)).send({ amountCents: 200 });
    await request(app).post('/api/grow/piggy/withdraw').set(bearer(f.kid)).send({ amountCents: 50 });
    const feed = (await request(app).get('/api/activity').set(bearer(f.kid))).body.activity;
    expect(feed.map((t: { label: string; amountCents: number; pot: string }) => [t.label, t.amountCents, t.pot])).toEqual([
      ['Out of Piggy bank', 50, 'wallet'],
      ['Into Piggy bank', 200, 'piggy'],
      ['gift', 500, 'wallet'],
    ]);
    // The ledger still has both legs of each move.
    expect(await Txn.countDocuments({ kidId: f.kidId, kind: { $in: ['deposit', 'withdraw'] } })).toBe(4);
  });
});

describe('game', () => {
  it('approval awards xp and reports a level up', async () => {
    const f = await makeFamily('xp');
    const quest = await makeQuest(f.parent, f.kidId, 5); // 50 xp, level 2 starts at 40
    const done = await request(app).post(`/api/quests/${quest}/done`).set(bearer(f.kid)).send({ date: today });
    const res = await request(app).post(`/api/runs/${done.body.run.id}/approve`).set(bearer(f.parent));
    expect(res.body).toMatchObject({ xp: 50, levelUp: 2 });
  });

  it('the chest opens once a day, only after a grown-up approves every quest', async () => {
    const f = await makeFamily('chest');
    const q1 = await makeQuest(f.parent, f.kidId);
    const q2 = await makeQuest(f.parent, f.kidId);
    const chest = () => request(app).post('/api/game/chest').set(bearer(f.kid)).send({ date: today });
    const r1 = await request(app).post(`/api/quests/${q1}/done`).set(bearer(f.kid)).send({ date: today });
    const r2 = await request(app).post(`/api/quests/${q2}/done`).set(bearer(f.kid)).send({ date: today });
    // Everything done but nothing approved yet: still locked.
    expect((await chest()).status).toBe(400);
    await request(app).post(`/api/runs/${r1.body.run.id}/approve`).set(bearer(f.parent));
    // One quest sent back: stays locked for the day.
    await request(app).post(`/api/runs/${r2.body.run.id}/reject`).set(bearer(f.parent));
    expect((await chest()).status).toBe(400);
  });

  it('the chest opens once a day after everything is approved', async () => {
    const f = await makeFamily('chest2');
    const q1 = await makeQuest(f.parent, f.kidId);
    const chest = () => request(app).post('/api/game/chest').set(bearer(f.kid)).send({ date: today });
    const r1 = await request(app).post(`/api/quests/${q1}/done`).set(bearer(f.kid)).send({ date: today });
    await request(app).post(`/api/runs/${r1.body.run.id}/approve`).set(bearer(f.parent));
    expect((await chest()).status).toBe(200);
    expect((await request(app).post('/api/game/chest').set(bearer(f.kid)).send({ date: today })).status).toBe(409);
  });

  it('locked hats are refused and switched-off features are enforced by the server', async () => {
    const f = await makeFamily('hat');
    expect((await request(app).patch('/api/game/hat').set(bearer(f.kid)).send({ hat: 'crown' })).status).toBe(403);
    await request(app).patch('/api/family/settings').set(bearer(f.parent)).send({ features: { piggy: false } });
    await request(app).post(`/api/family/kids/${f.kidId}/gift`).set(bearer(f.parent)).send({ amountCents: 100, label: 'g' });
    expect((await request(app).post('/api/grow/piggy/deposit').set(bearer(f.kid)).send({ amountCents: 50 })).status).toBe(403);
    const fam = await request(app).get('/api/family').set(bearer(f.parent));
    expect(fam.body.family.features).toMatchObject({ piggy: false, rocket: true });
  });
});

describe('teamwork', () => {
  const addKid = async (parent: string, name: string, pin: string) =>
    (await request(app).post('/api/family/kids').set(bearer(parent)).send({ name, avatar: 'frog', pin })).body.kid.id as string;
  const kidToken = async (code: string, kidId: string, pin: string) =>
    (await request(app).post('/api/auth/kid-login').send({ code, kidId, pin })).body.accessToken as string;

  it('a helper earns assist points and unlocks a milestone once; the doer keeps every coin', async () => {
    const f = await makeFamily('assist');
    const siblingId = await addKid(f.parent, 'Sib', '4321');
    // Free families get a 402 for helper milestones; Plus unlocks them.
    const free = await request(app).post('/api/milestones').set(bearer(f.parent)).send({ title: 'X', icon: null, points: 3 });
    expect(free.status).toBe(402);
    const familyId = (await User.findById(f.kidId))!.familyId;
    await Entitlement.create({ familyId, plan: 'plus', status: 'active', source: 'manual' });
    await request(app).post('/api/milestones').set(bearer(f.parent)).send({ title: 'Pick dinner', icon: 'pickdinner', points: 3 });
    for (let i = 0; i < 2; i++) {
      const quest = await makeQuest(f.parent, f.kidId, 3); // 3 stars = 3 assist points, 75 cents
      const done = await request(app).post(`/api/quests/${quest}/done`).set(bearer(f.kid)).send({ date: today, helperIds: [siblingId] });
      expect(done.body.run.helperIds).toEqual([siblingId]);
      await request(app).post(`/api/runs/${done.body.run.id}/approve`).set(bearer(f.parent));
    }
    expect((await User.findById(f.kidId))!.balanceCents).toBe(150);
    const sib = (await User.findById(siblingId))!;
    expect(sib.balanceCents).toBe(0);
    expect(sib.assistPoints).toBe(6);
    const prizes = await Purchase.find({ kidId: siblingId, source: 'milestone' });
    expect(prizes).toHaveLength(1);
    // A helper prize is not a shop purchase, so it must not earn the shopper badge.
    const fam = await request(app).get('/api/family').set(bearer(f.parent));
    expect(fam.body.kids.find((k: { id: string }) => k.id === siblingId).badges).not.toContain('shopper');
  });

  it('helpers must be siblings, never yourself or another family', async () => {
    const f = await makeFamily('assist2');
    const other = await makeFamily('assist3');
    const quest = await makeQuest(f.parent, f.kidId);
    const res = await request(app).post(`/api/quests/${quest}/done`).set(bearer(f.kid)).send({ date: today, helperIds: [other.kidId] });
    expect(res.status).toBe(404);
  });

  it('team goals weigh effort with each kid boost, not coins, and are reached once', async () => {
    const f = await makeFamily('team');
    const littleId = await addKid(f.parent, 'Little', '1111');
    // Little earns fewer coins per star but their effort counts double.
    await request(app).patch(`/api/family/kids/${littleId}`).set(bearer(f.parent)).send({ starValueCents: 10, effortBoost: 2 });
    const goal = await request(app).post('/api/team-goals').set(bearer(f.parent)).send({ title: 'Zoo trip', icon: 'zoo', targetPoints: 8, kidIds: [f.kidId, littleId] });
    expect(goal.status).toBe(200);
    const little = await kidToken(f.code, littleId, '1111');
    const run = async (kid: string, kidId: string) => {
      const quest = await makeQuest(f.parent, kidId, 2);
      const done = await request(app).post(`/api/quests/${quest}/done`).set(bearer(kid)).send({ date: today });
      return request(app).post(`/api/runs/${done.body.run.id}/approve`).set(bearer(f.parent));
    };
    const paid = await run(little, littleId);
    expect(paid.body.paidCents).toBe(20); // 2 stars x 10 cents, the kid's own star value
    await run(f.kid, f.kidId); // 2 points
    const mid = await request(app).get('/api/team-goals').set(bearer(f.parent));
    const shares = Object.fromEntries(mid.body.goals[0].contributions.map((c: { kidId: string; points: number }) => [c.kidId, c.points]));
    expect(shares[littleId]).toBe(4);
    expect(shares[f.kidId]).toBe(2);
    await run(little, littleId); // 4 more: 10 >= 8, reached
    const approvals = await request(app).get('/api/approvals').set(bearer(f.parent));
    expect(approvals.body.teamPrizes).toHaveLength(1);
    expect((await request(app).post(`/api/team-goals/${goal.body.goal.id}/hand-over`).set(bearer(f.parent))).status).toBe(200);
    expect((await request(app).post(`/api/team-goals/${goal.body.goal.id}/hand-over`).set(bearer(f.parent))).status).toBe(404);
  });
});

describe('trust (auto-approve)', () => {
  const quest = async (parent: string, kidId: string, extra: object = {}) =>
    (await request(app).post('/api/quests').set(bearer(parent)).send({ kidIds: [kidId], title: 'Trash', icon: 'trash', stars: 2, repeat: { kind: 'daily' }, ...extra })).body.quests[0].id as string;
  const done = (kid: string, q: string) => request(app).post(`/api/quests/${q}/done`).set(bearer(kid)).send({ date: today });

  it('a trusted quest pays on "I did it!", once, and cannot be undone by the kid', async () => {
    const f = await makeFamily('trustq');
    const q = await quest(f.parent, f.kidId, { autoApprove: true });
    const res = await done(f.kid, q);
    expect(res.body.run.status).toBe('approved');
    expect(res.body.paidCents).toBe(50);
    expect((await done(f.kid, q)).status).toBe(409);
    expect((await request(app).post(`/api/quests/${q}/undo`).set(bearer(f.kid)).send({ date: today })).status).toBe(409);
    expect((await User.findById(f.kidId))!.balanceCents).toBe(50);
    expect((await request(app).get('/api/approvals').set(bearer(f.parent))).body.quests).toHaveLength(0);
  });

  it('trusting one kid auto-pays all their quests while a sibling still waits for a grown-up', async () => {
    const f = await makeFamily('trustk');
    const sibId = (await request(app).post('/api/family/kids').set(bearer(f.parent)).send({ name: 'Sib', avatar: 'frog', pin: '4321' })).body.kid.id;
    const sib = (await request(app).post('/api/auth/kid-login').send({ code: f.code, kidId: sibId, pin: '4321' })).body.accessToken;
    await request(app).patch(`/api/family/kids/${f.kidId}`).set(bearer(f.parent)).send({ trusted: true });
    const mine = await quest(f.parent, f.kidId);
    const theirs = await quest(f.parent, sibId);
    expect((await done(f.kid, mine)).body.run.status).toBe('approved');
    expect((await done(sib, theirs)).body.run.status).toBe('done');
    expect((await request(app).get('/api/approvals').set(bearer(f.parent))).body.quests).toHaveLength(1);
  });

  it('trusted quests count as approved for the daily chest', async () => {
    const f = await makeFamily('trustc');
    const q = await quest(f.parent, f.kidId, { autoApprove: true });
    await done(f.kid, q);
    expect((await request(app).post('/api/game/chest').set(bearer(f.kid)).send({ date: today })).status).toBe(200);
  });
});

describe('money school', () => {
  it('age picks the lesson band, the server grades, and XP pays once', async () => {
    const f = await makeFamily('learn');
    await request(app).patch(`/api/family/kids/${f.kidId}`).set(bearer(f.parent)).send({ age: 6 });
    const list = await request(app).get('/api/learn').set(bearer(f.kid));
    expect(list.body.age).toBe(6);
    expect(list.body.band).toBe('little');
    const lesson = LESSONS.find((l) => l.versions.little)!;
    const quiz = lesson.versions.little!.quiz;
    const wrong = quiz.map((q) => (q.answer + 1) % q.choices.length);
    const right = quiz.map((q) => q.answer);
    const finish = (answers: number[]) => request(app).post(`/api/learn/${lesson.id}/complete`).set(bearer(f.kid)).send({ answers });
    const miss = await finish(wrong);
    expect(miss.body).toMatchObject({ passed: false, xp: 0 });
    const pass = await finish(right);
    expect(pass.body).toMatchObject({ passed: true, xp: LESSON_XP });
    expect((await finish(right)).body).toMatchObject({ passed: true, xp: 0 });
    expect((await User.findById(f.kidId))!.xp).toBe(LESSON_XP);
  });

  it('older-kid lessons are not open to a little kid', async () => {
    const f = await makeFamily('learn2');
    await request(app).patch(`/api/family/kids/${f.kidId}`).set(bearer(f.parent)).send({ age: 6 });
    const teenOnly = LESSONS.find((l) => !l.versions.little)!;
    const res = await request(app).post(`/api/learn/${teenOnly.id}/complete`).set(bearer(f.kid)).send({ answers: [0] });
    expect(res.status).toBe(404);
  });
});

describe('grown-up incentives', () => {
  const lessonFor = (band: 'little' | 'middle' | 'teen') => LESSONS.find((l) => l.versions[band])!;
  const pass = (kid: string, lesson: (typeof LESSONS)[number]) =>
    request(app).post(`/api/learn/${lesson.id}/complete`).set(bearer(kid)).send({ answers: lesson.versions.middle!.quiz.map((q) => q.answer) });

  it('lessons pay the family reward once, and an assignment can set its own amount', async () => {
    const f = await makeFamily('lessonpay');
    await request(app).patch('/api/family/settings').set(bearer(f.parent)).send({ lessonRewardCents: 25 });
    const [a, b] = LESSONS.filter((l) => l.versions.middle);
    await request(app).post(`/api/learn/${b.id}/assign`).set(bearer(f.parent)).send({ kidIds: [f.kidId], rewardCents: 100 });
    expect((await pass(f.kid, a)).body.paidCents).toBe(25);
    expect((await pass(f.kid, a)).body.paidCents).toBe(0); // second pass pays nothing more
    expect((await pass(f.kid, b)).body.paidCents).toBe(100);
    expect((await User.findById(f.kidId))!.balanceCents).toBe(125);
  });

  it('assigned-only mode shows kids just the lessons a grown-up picked', async () => {
    const f = await makeFamily('lessonmode');
    const lesson = lessonFor('middle');
    await request(app).patch('/api/family/settings').set(bearer(f.parent)).send({ learnMode: 'assigned' });
    expect((await request(app).get('/api/learn').set(bearer(f.kid))).body.lessons).toHaveLength(0);
    await request(app).post(`/api/learn/${lesson.id}/assign`).set(bearer(f.parent)).send({ kidIds: [f.kidId], rewardCents: null });
    const list = (await request(app).get('/api/learn').set(bearer(f.kid))).body.lessons;
    expect(list.map((l: { id: string }) => l.id)).toEqual([lesson.id]);
    // A lesson that was not picked cannot be finished (or paid) by going around the screen.
    const other = LESSONS.find((l) => l.versions.middle && l.id !== lesson.id)!;
    expect((await pass(f.kid, other)).status).toBe(404);
    // The grown-up still sees the whole shelf for that kid.
    expect((await request(app).get('/api/learn').query({ kidId: f.kidId }).set(bearer(f.parent))).body.lessons.length).toBeGreaterThan(1);
  });

  it('level ups pay the bonus once per level and unlock level prizes', async () => {
    const f = await makeFamily('levelpay');
    await request(app).patch('/api/family/settings').set(bearer(f.parent)).send({ levelUpBonusCents: 50 });
    const prize = await request(app).post('/api/milestones').set(bearer(f.parent)).send({ kind: 'level', title: 'Movie night', icon: 'movie', points: 3 });
    expect(prize.status).toBe(200); // level prizes are free, no Plus needed
    // 5 stars = 50 XP: level 2. Then 5 + 3 stars = 80 more XP: 130 XP, level 3.
    const bonuses: number[] = [];
    for (const stars of [5, 5, 3]) {
      const q = await makeQuest(f.parent, f.kidId, stars);
      const done = await request(app).post(`/api/quests/${q}/done`).set(bearer(f.kid)).send({ date: today });
      bonuses.push((await request(app).post(`/api/runs/${done.body.run.id}/approve`).set(bearer(f.parent))).body.bonusCents);
    }
    expect(bonuses).toEqual([50, 0, 50]); // the level up moment shows what was paid
    const kid = (await User.findById(f.kidId))!;
    // quest pay 125 + 125 + 75 (5, 5, 3 stars x 25) = 325, plus two level bonuses of 50
    expect(kid.balanceCents).toBe(425);
    expect(await Txn.countDocuments({ kidId: f.kidId, kind: 'bonus' })).toBe(2);
    const inbox = await request(app).get('/api/approvals').set(bearer(f.parent));
    expect(inbox.body.purchases.map((p: { title: string }) => p.title)).toContain('Movie night');
  });
});
