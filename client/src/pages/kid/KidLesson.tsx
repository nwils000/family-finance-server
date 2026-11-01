// One money lesson: read the illustrated pages, then answer the quiz one question
// at a time with instant feedback. The server grades the answers and pays XP (and any reward) once.
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { coinsText, LESSON_XP, type TryItTarget } from '@kk/shared';
import { IconBack, IconCheck, IconClose, LessonArt, Penny, XpStar } from '@/art';
import { Button, Card, EmptyState, Heading, Money, PennySays, ProgressBar, Text } from '@/components/ui';
import { afterXp } from '@/features/moments';
import { endpoints } from '@/lib/api';
import { celebrate } from '@/lib/celebrate';
import { cn } from '@/lib/cn';
import { bouncy, gentle } from '@/lib/motion';
import { MONEY_KEYS, qk, useAction, useLessons } from '@/lib/queries';
import type { LessonResult } from '@/lib/types';
import { Loading } from './kid-parts';

/** Where each "Try it" button goes. */
const TRY_IT_PATHS: Record<TryItTarget, string> = {
  quests: '/kid',
  shop: '/kid/shop',
  grow: '/kid/grow',
  goal: '/kid/grow',
};

export default function KidLesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { data } = useLessons();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<LessonResult | null>(null);
  const finish = useAction(endpoints.completeLesson, {
    invalidate: [qk.lessons(), ...MONEY_KEYS],
  });

  if (!data) return <Loading />;
  const lesson = data.lessons.find((l) => l.id === lessonId);
  if (!lesson) {
    return (
      <EmptyState
        art={<Penny size={100} mood="think" />}
        title="Lesson not found"
        action={<Button onClick={() => navigate('/kid/learn')}>Back to lessons</Button>}
      >
        This one is not in your lessons.
      </EmptyState>
    );
  }

  const { version } = lesson;
  const pages = version.pages.length;
  const total = pages + version.quiz.length;
  const inQuiz = step >= pages;
  const qIndex = step - pages;
  const question = inQuiz ? version.quiz[qIndex] : null;
  const picked = inQuiz ? answers[qIndex] : undefined;
  const answered = picked !== undefined;

  const pick = (choice: number, el: HTMLElement) => {
    if (answered || !question) return;
    setAnswers((a) => {
      const next = [...a];
      next[qIndex] = choice;
      return next;
    });
    celebrate(choice === question.answer ? 'done' : 'oops', el);
  };

  const submit = async () => {
    const res = await finish.run(lesson.id, answers);
    setResult(res);
    if (res.passed) {
      celebrate('levelUp');
      afterXp(res);
    }
  };

  const retry = () => {
    setAnswers([]);
    setResult(null);
    setStep(pages);
  };

  if (result) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 py-6 text-center">
        <motion.span initial={{ scale: 0.4, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} transition={bouncy}>
          <Penny size={140} mood={result.passed ? 'cheer' : 'think'} />
        </motion.span>
        <Heading size="lg">{result.passed ? 'Lesson complete!' : 'So close!'}</Heading>
        {result.passed ? (
          result.xp > 0 ? (
            <div className="flex flex-wrap justify-center gap-3">
              <Card tone="coin" className="flex items-center gap-2">
                <XpStar size={36} />
                <Text tone="ink" bold className="font-display text-2xl">
                  +{result.xp} XP
                </Text>
              </Card>
              {result.paidCents > 0 && (
                <Card tone="good" className="flex items-center gap-2">
                  <Text tone="ink" bold className="font-display text-2xl">
                    +
                  </Text>
                  <Money cents={result.paidCents} size="lg" />
                </Card>
              )}
            </div>
          ) : (
            <Text>You already earned the XP for this one. Great review!</Text>
          )
        ) : (
          <Text>
            You got {result.correct.filter(Boolean).length} of {result.correct.length}. Every answer has to be right to finish. Give it another go!
          </Text>
        )}
        <div className="flex w-full flex-col gap-2">
          {!result.passed && (
            <Button size="lg" block onClick={retry}>
              Try the quiz again
            </Button>
          )}
          {result.passed && version.tryIt && (
            <Button size="lg" variant="coin" block onClick={() => navigate(TRY_IT_PATHS[version.tryIt!.to])}>
              {version.tryIt.label}
            </Button>
          )}
          <Button variant={result.passed ? 'primary' : 'ghost'} block onClick={() => navigate('/kid/learn')}>
            Back to lessons
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" aria-label="Back to lessons" onClick={() => navigate('/kid/learn')}>
          <IconBack />
        </Button>
        <div className="min-w-0 flex-1">
          <Text tone="ink" bold className="truncate font-display">
            {version.title}
          </Text>
          <ProgressBar value={(step + (answered ? 1 : 0)) / total} tone="good" height="h-3" />
        </div>
      </div>

      {/* Enter only, like pages: an exit in AnimatePresence wait mode could stick on fast taps. */}
      <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0, transition: gentle }}>
        {!inQuiz ? (
          <Card className="flex flex-col gap-3">
            <div className="overflow-hidden rounded-2xl">
              <LessonArt id={version.pages[step].art ?? lesson.art} size="100%" />
            </div>
            <Heading level={2} size="md">
              {version.pages[step].heading}
            </Heading>
            {version.pages[step].body.split('\n\n').map((para, i) => (
              <Text key={i} tone="ink" size="lg" className="leading-relaxed">
                {para}
              </Text>
            ))}
          </Card>
        ) : (
          question && (
            <Card className="flex flex-col gap-3">
              <Text size="sm" bold>
                Question {qIndex + 1} of {version.quiz.length}
              </Text>
              <Heading level={2} size="sm">
                {question.prompt}
              </Heading>
              <div className="flex flex-col gap-2">
                {question.choices.map((choice, i) => {
                  const right = answered && i === question.answer;
                  const wrongPick = answered && i === picked && i !== question.answer;
                  return (
                    <Button
                      key={i}
                      size="wrap"
                      block
                      sound={false}
                      variant={right ? 'good' : wrongPick ? 'danger' : 'secondary'}
                      disabled={answered && !right && !wrongPick}
                      icon={right ? <IconCheck size={18} /> : wrongPick ? <IconClose size={18} /> : undefined}
                      className={cn('justify-start', answered && 'cursor-default')}
                      onClick={(e) => pick(i, e.currentTarget)}
                    >
                      {choice}
                    </Button>
                  );
                })}
              </div>
              {answered && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <PennySays mood={picked === question.answer ? 'cheer' : 'think'} size={56}>
                    {picked === question.answer ? 'Yes! ' : 'Not quite. '}
                    {question.why}
                  </PennySays>
                </motion.div>
              )}
            </Card>
          )
        )}
      </motion.div>

      <div className="flex gap-3">
        {step > 0 && !inQuiz && (
          <Button variant="secondary" className="flex-1" onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
        )}
        {!inQuiz && (
          <Button className="flex-1" onClick={() => setStep((s) => s + 1)}>
            {step === pages - 1 ? 'Quiz time!' : 'Next'}
          </Button>
        )}
        {inQuiz && answered && qIndex < version.quiz.length - 1 && (
          <Button block onClick={() => setStep((s) => s + 1)}>
            Next question
          </Button>
        )}
        {inQuiz && answered && qIndex === version.quiz.length - 1 && (
          <Button block size="wrap" variant="coin" busy={finish.busy} icon={<XpStar size={22} />} onClick={() => void submit()}>
            {lesson.done
              ? 'Finish review'
              : lesson.rewardCents > 0
                ? `Finish for +${LESSON_XP} XP and ${coinsText(lesson.rewardCents)}`
                : `Finish for +${LESSON_XP} XP`}
          </Button>
        )}
      </div>
    </div>
  );
}
