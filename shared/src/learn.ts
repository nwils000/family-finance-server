// Money lessons: the one source for lesson content, age bands and grading rules.
// The client renders lessons from here and the server grades quizzes from here,
// so a lesson can never say one thing on screen and be graded against another.

export const AGE_BANDS = ['little', 'middle', 'teen'] as const;
export type AgeBand = (typeof AGE_BANDS)[number];

export const AGE_BAND_NAMES: Record<AgeBand, string> = { little: 'Ages 7 and under', middle: 'Ages 8 to 11', teen: 'Ages 12 and up' };

export const KID_AGE = { min: 3, max: 17 } as const;

/** A kid's age from their birth year (stored instead of age, so it grows with them). */
export const ageFromBirthYear = (birthYear: number | null | undefined, now = new Date()) =>
  birthYear ? now.getFullYear() - birthYear : null;

/** Which version of each lesson a kid sees. No age set reads as the middle band. */
export const ageBand = (age: number | null | undefined): AgeBand =>
  age == null ? 'middle' : age <= 7 ? 'little' : age <= 11 ? 'middle' : 'teen';

/** XP for finishing a lesson's quiz, once per lesson. */
export const LESSON_XP = 30;

/** Every illustration a lesson can use. Drawn in client/src/art/lesson-art.tsx. */
export const LESSON_ART = [
  'earn', 'needs-wants', 'save', 'interest', 'risk', 'give', 'budget', 'choice',
  'supply-demand', 'inflation', 'bank', 'taxes', 'scam',
  // Library expansion
  'money-basics', 'barter', 'jobs', 'business', 'paycheck', 'compare', 'ads', 'impulse',
  'emergency', 'cards', 'credit-score', 'stocks', 'index-fund', 'time-growth', 'crypto',
  'insurance', 'identity', 'goals', 'subscriptions', 'trade', 'contentment', 'net-worth',
] as const;

/** Lesson library shelves, in the order they appear. */
export const LESSON_CATEGORIES = [
  'basics', 'earning', 'spending', 'saving', 'banking', 'borrowing', 'investing', 'economy', 'protection', 'planning',
] as const;
export type LessonCategory = (typeof LESSON_CATEGORIES)[number];
export const LESSON_CATEGORY_NAMES: Record<LessonCategory, string> = {
  basics: 'Money basics',
  earning: 'Earning',
  spending: 'Spending smart',
  saving: 'Saving',
  banking: 'Banks and cards',
  borrowing: 'Borrowing and credit',
  investing: 'Investing',
  economy: 'How the economy works',
  protection: 'Staying safe',
  planning: 'Planning ahead',
};
export type LessonArtId = (typeof LESSON_ART)[number];

/** Where a lesson's "Try it" button sends the kid. */
export type TryItTarget = 'quests' | 'shop' | 'grow' | 'goal';

export interface LessonPage {
  heading: string;
  /** One or two short paragraphs, sized for the band (little: very short). */
  body: string;
  art?: LessonArtId;
}

export interface QuizQuestion {
  prompt: string;
  /** 2 to 4 choices. */
  choices: string[];
  /** Index of the right choice. */
  answer: number;
  /** One friendly sentence shown after answering, right or wrong. */
  why: string;
}

export interface LessonVersion {
  title: string;
  /** One line under the title on the lesson card. */
  blurb: string;
  /** 2 to 5 pages. */
  pages: LessonPage[];
  /** 2 to 4 questions. */
  quiz: QuizQuestion[];
  tryIt?: { label: string; to: TryItTarget };
}

export interface Lesson {
  id: string;
  art: LessonArtId;
  category: LessonCategory;
  /** A version per band the lesson suits. A band with no version does not see the lesson. */
  versions: Partial<Record<AgeBand, LessonVersion>>;
}

/** All right answers: a passing quiz needs every question correct (kids can retry). */
export const gradeQuiz = (version: LessonVersion, answers: number[]) =>
  version.quiz.length === answers.length && version.quiz.every((q, i) => q.answer === answers[i]);

import { CORE_LESSONS } from './lessons-content';
import { PACK_A } from './lessons-pack-a';
import { PACK_B } from './lessons-pack-b';
import { PACK_C } from './lessons-pack-c';
/** The whole library: the core lessons plus each expansion pack, in category order. */
export const LESSONS: Lesson[] = [...CORE_LESSONS, ...PACK_A, ...PACK_B, ...PACK_C].sort(
  (a, b) => LESSON_CATEGORIES.indexOf(a.category) - LESSON_CATEGORIES.indexOf(b.category),
);
export const lessonsFor = (band: AgeBand) =>
  LESSONS.filter((l) => l.versions[band]).map((l) => ({ id: l.id, art: l.art, category: l.category, version: l.versions[band]! }));
export const findLesson = (id: string) => LESSONS.find((l) => l.id === id);
/** The lesson that teaches a given idea, for "Learn how this works" links around the app. */
export const lessonIdForArt = (art: LessonArtId) => LESSONS.find((l) => l.art === art)?.id ?? null;
