// Every endpoint, in one place. Routes only parse input and call a service;
// all logic and every database call lives in services/.
import { Router, type Request } from 'express';
import {
  authLimiter,
  familyAccessLimiter,
  familyPinLimiter,
  kidPinLimiter,
  linkCheckLimiter,
  loginEmailLimiter,
  loginLimiter,
  refreshLimiter,
  requireLocalDev,
  signupLimiter,
} from './security.js';
import { endSession, issueSession, publicUser, requireAuth, requireParent, rotateSession } from './auth.js';
import { formGuard } from './bot-protection.js';
import { config } from './config.js';
import { handle, parse } from './http.js';
import * as S from './schemas.js';
import * as accounts from './services/accounts.js';
import * as family from './services/family.js';
import * as game from './services/game.js';
import * as learn from './services/learn.js';
import * as milestones from './services/milestones.js';
import * as teamGoals from './services/teamGoals.js';
import * as grow from './services/grow.js';
import * as quests from './services/quests.js';
import * as shop from './services/shop.js';

const id = (req: Request) => parse(S.idParam, req.params).id;
const kidId = (req: Request) => parse(S.kidQuery, req.query).kidId;
const ok = async (p: Promise<unknown>) => {
  await p;
  return { ok: true };
};


export const routes = Router();

// Public: sign in and out
routes.post('/auth/signup', signupLimiter, formGuard('signup'), handle(async (req, res) => issueSession(req, res, await accounts.signup(parse(S.signupBody, req.body)))));
// A grown-up joins only with an invite link; the family code is for kids.
routes.post('/auth/invite/check', linkCheckLimiter, handle((req) => accounts.checkInvite(parse(S.inviteCheckBody, req.body).invite)));
routes.post('/auth/join', signupLimiter, formGuard('join'), handle(async (req, res) => issueSession(req, res, await accounts.joinFamily(parse(S.joinBody, req.body)))));
routes.post('/auth/login', loginEmailLimiter, loginLimiter, formGuard('login'), handle(async (req, res) => issueSession(req, res, await accounts.parentLogin(parse(S.loginBody, req.body)))));
routes.post('/auth/kid-login', authLimiter, familyPinLimiter, kidPinLimiter, formGuard('kidLogin'), handle(async (req, res) => issueSession(req, res, await accounts.kidLogin(parse(S.kidLoginBody, req.body)))));
routes.get('/auth/family/:code', authLimiter, handle((req) => accounts.familyPreview(parse(S.familyCode, req.params.code))));
// Dev-only quick login for the seeded demo family: local development with
// ENABLE_DEV_ENDPOINTS=true (npm run dev sets it), and a caller on this machine.
if (config.devEndpoints) {
  routes.get('/auth/dev/accounts', requireLocalDev, handle(() => accounts.devAccounts()));
  routes.post('/auth/dev/login', requireLocalDev, handle(async (req, res) => issueSession(req, res, await accounts.devLogin(parse(S.idParam, req.body).id))));
}
routes.post('/auth/refresh', refreshLimiter, handle((req, res) => rotateSession(req, res)));
routes.post('/auth/logout', handle((req, res) => ok(endSession(req, res))));

// Signed in from here on
routes.use(requireAuth);
const parent = requireParent;

routes.get('/auth/me', handle(async (req) => ({ user: publicUser(await accounts.getUser(req.auth.userId)) })));

routes.get('/family', handle((req) => family.getHome(req.auth)));
routes.post('/family/invites', parent, familyAccessLimiter, handle((req) => accounts.createInvite(req.auth)));
routes.post('/family/code/rotate', parent, familyAccessLimiter, handle((req) => accounts.rotateFamilyCode(req.auth)));
routes.patch('/family/settings', parent, handle((req) => family.updateSettings(req.auth, parse(S.settingsBody, req.body))));
routes.post('/family/kids', parent, handle((req) => family.addKid(req.auth, parse(S.kidBody, req.body))));
routes.patch('/family/kids/:id', parent, handle((req) => family.updateKid(req.auth, id(req), parse(S.kidUpdateBody, req.body))));
routes.delete('/family/kids/:id', parent, handle((req) => ok(family.removeKid(req.auth, id(req)))));
routes.post('/family/kids/:id/gift', parent, handle((req) => ok(family.giftKid(req.auth, id(req), parse(S.giftBody, req.body)))));

routes.get('/quests', handle((req) => quests.questsForDay(req.auth, parse(S.dayQuery, req.query).date)));
routes.get('/quests/all', parent, handle((req) => quests.allQuests(req.auth)));
routes.post('/quests', parent, handle((req) => quests.createQuests(req.auth, parse(S.newQuestBody, req.body))));
routes.patch('/quests/:id', parent, handle((req) => quests.updateQuest(req.auth, id(req), parse(S.questBody.partial(), req.body))));
routes.delete('/quests/:id', parent, handle((req) => ok(quests.archiveQuest(req.auth, id(req)))));
routes.post('/quests/:id/done', handle((req) => quests.markDone(req.auth, id(req), parse(S.questActionBody, req.body))));
routes.put('/quests/:id/helpers', handle((req) => quests.setHelpers(req.auth, id(req), parse(S.helpersBody, req.body))));
routes.post('/quests/:id/undo', handle((req) => ok(quests.undoDone(req.auth, id(req), parse(S.questActionBody, req.body)))));
routes.post('/runs/:id/approve', parent, handle((req) => quests.approveRun(req.auth, id(req))));
routes.post('/runs/:id/reject', parent, handle((req) => ok(quests.rejectRun(req.auth, id(req)))));

routes.get('/shop/rewards', handle((req) => shop.listRewards(req.auth)));
routes.post('/shop/rewards', parent, handle((req) => shop.createReward(req.auth, parse(S.rewardBody, req.body))));
routes.patch('/shop/rewards/:id', parent, handle((req) => shop.updateReward(req.auth, id(req), parse(S.rewardBody.partial(), req.body))));
routes.delete('/shop/rewards/:id', parent, handle((req) => ok(shop.archiveReward(req.auth, id(req)))));
routes.post('/shop/rewards/:id/buy', handle((req) => shop.buyReward(req.auth, id(req), parse(S.kidQuery, req.body ?? {}).kidId)));
routes.get('/shop/purchases', handle((req) => shop.listPurchases(req.auth)));
routes.post('/shop/purchases/:id/fulfill', parent, handle((req) => ok(shop.fulfillPurchase(req.auth, id(req)))));
routes.post('/shop/purchases/:id/decline', parent, handle((req) => ok(shop.declinePurchase(req.auth, id(req)))));

routes.get('/grow', handle((req) => grow.growOverview(req.auth, kidId(req))));
routes.post(
  '/grow/:kind/:direction',
  handle((req) => {
    const { kind, direction } = parse(S.growParams, req.params);
    const body = parse(S.transferBody, req.body);
    return ok(grow.moveGrowth(req.auth, kind, direction, body.amountCents, body.kidId));
  }),
);
routes.get('/activity', handle((req) => grow.activity(req.auth, kidId(req))));
routes.get('/approvals', parent, handle((req) => grow.approvals(req.auth)));

routes.post('/game/chest', handle((req) => game.openChest(req.auth, parse(S.dayQuery, req.body).date)));
routes.patch('/game/hat', handle((req) => {
  const body = parse(S.hatBody, req.body);
  return ok(game.setHat(req.auth, body.hat, body.kidId));
}));
routes.patch('/game/goal', handle((req) => {
  const body = parse(S.goalRequest, req.body);
  return ok(game.setGoal(req.auth, body.goal, body.kidId));
}));

routes.get('/team-goals', handle((req) => teamGoals.listTeamGoals(req.auth)));
routes.post('/team-goals', parent, handle((req) => teamGoals.createTeamGoal(req.auth, parse(S.teamGoalBody, req.body))));
routes.patch('/team-goals/:id', parent, handle((req) => teamGoals.updateTeamGoal(req.auth, id(req), parse(S.teamGoalBody.partial(), req.body))));
routes.delete('/team-goals/:id', parent, handle((req) => ok(teamGoals.archiveTeamGoal(req.auth, id(req)))));
routes.post('/team-goals/:id/hand-over', parent, handle((req) => ok(teamGoals.handOverTeamGoal(req.auth, id(req)))));

routes.get('/milestones', handle((req) => milestones.listMilestones(req.auth, kidId(req))));
routes.post('/milestones', parent, handle((req) => milestones.createMilestone(req.auth, parse(S.milestoneBody, req.body))));
routes.patch('/milestones/:id', parent, handle((req) => milestones.updateMilestone(req.auth, id(req), parse(S.milestoneBody.partial(), req.body))));
routes.delete('/milestones/:id', parent, handle((req) => ok(milestones.archiveMilestone(req.auth, id(req)))));

routes.get('/learn', handle((req) => learn.listLessons(req.auth, kidId(req))));
routes.post('/learn/:lessonId/assign', parent, handle((req) => {
  const body = parse(S.assignLessonBody, req.body);
  return ok(learn.assignLesson(req.auth, String(req.params.lessonId), body.kidIds, body.rewardCents));
}));
routes.post('/learn/:lessonId/unassign', parent, handle((req) => ok(learn.unassignLesson(req.auth, String(req.params.lessonId), parse(S.unassignLessonBody, req.body).kidId))));
routes.post('/learn/:lessonId/complete', handle((req) => learn.completeLesson(req.auth, String(req.params.lessonId), parse(S.lessonAnswersBody, req.body).answers)));
