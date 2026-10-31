// Money lessons: which lessons a kid sees (by age band and the family's lesson mode),
// grown-up assignments with coin rewards, and grading quizzes. Content and grading
// rules live in @kk/shared (learn.ts); XP goes through game.ts, coins through money.ts.
import type { Types } from 'mongoose';
import { ageBand, ageFromBirthYear, findLesson, gradeQuiz, LESSON_XP, lessonsFor } from '@kk/shared';
import { HttpError, notFound } from '../http.js';
import { Family, LessonAssignment, LessonProgress } from '../models.js';
import { assertFeature, resolveKid, type Actor } from './access.js';
import { awardXp } from './game.js';
import { move } from './money.js';

/** Coins a lesson pays a kid: the grown-up's pick for that lesson, else the family default. */
const rewardFor = (assignment: { rewardCents?: number | null } | undefined, familyDefault: number) =>
  assignment?.rewardCents ?? familyDefault;

/** Whether a kid may open a lesson: the whole shelf in 'open' mode, else only a grown-up's picks. */
const kidMaySee = (learnMode: string | undefined, assigned: boolean) => (learnMode ?? 'open') === 'open' || assigned;

/**
 * The lessons for a kid's age band, each with done / assigned / reward. In 'assigned'
 * mode a kid only sees what a grown-up picked; a grown-up always sees the whole shelf.
 */
export const listLessons = async (actor: Actor, kidId?: string) => {
  const kid = await resolveKid(actor, kidId);
  const age = ageFromBirthYear(kid.birthYear);
  const band = ageBand(age);
  const [family, progress, assignments] = await Promise.all([
    Family.findById(kid.familyId).select('lessonRewardCents learnMode'),
    LessonProgress.find({ kidId: kid._id }).select('lessonId'),
    LessonAssignment.find({ kidId: kid._id }),
  ]);
  const done = new Set(progress.map((p) => p.lessonId));
  const byLesson = new Map(assignments.map((a) => [a.lessonId, a]));
  const learnMode = (family?.learnMode ?? 'open') as 'open' | 'assigned';
  const lessons = lessonsFor(band)
    .map((l) => ({
      ...l,
      done: done.has(l.id),
      assigned: byLesson.has(l.id),
      rewardCents: rewardFor(byLesson.get(l.id), family?.lessonRewardCents ?? 0),
    }))
    .filter((l) => actor.role === 'parent' || kidMaySee(learnMode, l.assigned));
  return { age, band, learnMode, lessons };
};

/** A grown-up picks a lesson for kids, optionally with its own coin reward. */
export const assignLesson = async (actor: Actor, lessonId: string, kidIds: string[], rewardCents: number | null) => {
  if (!findLesson(lessonId)) throw notFound('Lesson not found');
  const kids = await Promise.all(kidIds.map((id) => resolveKid(actor, id)));
  await Promise.all(
    kids.map((kid) =>
      LessonAssignment.updateOne(
        { kidId: kid._id, lessonId },
        { $set: { rewardCents }, $setOnInsert: { familyId: kid.familyId, kidId: kid._id, lessonId } },
        { upsert: true },
      ),
    ),
  );
};

export const unassignLesson = async (actor: Actor, lessonId: string, kidId: string) => {
  const kid = await resolveKid(actor, kidId);
  await LessonAssignment.deleteOne({ kidId: kid._id, lessonId });
};

/**
 * Grade a kid's quiz. All answers right finishes the lesson: XP and any coin reward
 * pay once (unique progress row). A retry after finishing is fine but pays nothing more.
 */
export const completeLesson = async (actor: Actor, lessonId: string, answers: number[]) => {
  if (actor.role !== 'kid') throw new HttpError(403, 'Lessons are for kids!');
  await assertFeature(actor, 'learn');
  const kid = await resolveKid(actor);
  const version = findLesson(lessonId)?.versions[ageBand(ageFromBirthYear(kid.birthYear))];
  if (!version) throw notFound('Lesson not found');
  const [family, assignment] = await Promise.all([
    Family.findById(kid.familyId).select('lessonRewardCents learnMode'),
    LessonAssignment.findOne({ kidId: kid._id, lessonId }),
  ]);
  if (!kidMaySee(family?.learnMode, !!assignment)) throw notFound('Lesson not found');
  const correct = version.quiz.map((q, i) => q.answer === answers[i]);
  const nothing = { correct, xp: 0, levelUp: null, bonusCents: 0, paidCents: 0 };
  if (!gradeQuiz(version, answers)) return { passed: false, ...nothing };
  const paidCents = rewardFor(assignment ?? undefined, family?.lessonRewardCents ?? 0);
  try {
    await LessonProgress.create({ familyId: kid.familyId, kidId: kid._id, lessonId, paidCents });
  } catch (err) {
    if ((err as { code?: number }).code === 11000) return { passed: true, ...nothing };
    throw err;
  }
  await payLesson(kid.familyId, kid._id, paidCents, version.title);
  return { passed: true, correct, paidCents, ...(await awardXp(kid._id, LESSON_XP)) };
};

const payLesson = (familyId: Types.ObjectId, kidId: Types.ObjectId, cents: number, title: string) =>
  cents > 0 ? move({ familyId, kidId, amountCents: cents, kind: 'lesson', label: `Lesson: ${title}` }) : Promise.resolve();
