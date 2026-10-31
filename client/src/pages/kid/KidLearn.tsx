// The kid's Learn tab: short money lessons written for their age, grouped by topic,
// each ending in a quick quiz that pays XP (and any grown-up reward) the first time it is passed.
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AGE_BAND_NAMES, LESSON_CATEGORIES, LESSON_CATEGORY_NAMES, LESSON_XP } from '@kk/shared';
import { IconCheck, LessonArt, XpStar } from '@/art';
import { Card, Heading, Money, PennySays, Pill, ProgressBar, SectionTitle, Text } from '@/components/ui';
import { cn } from '@/lib/cn';
import { popIn, stagger } from '@/lib/motion';
import { useLessons } from '@/lib/queries';
import type { LessonListItem } from '@/lib/types';
import { Loading } from './kid-parts';

/** One lesson card: phones get a compact row with the art on the left, wider screens art on top. */
function LessonCard({ lesson: l, onOpen }: { lesson: LessonListItem; onOpen: () => void }) {
  return (
    <Card
      pad="sm"
      tone={l.done ? 'good' : l.assigned ? 'brand' : 'plain'}
      onClick={onOpen}
      className="press flex h-full cursor-pointer items-center gap-3 sm:flex-col sm:items-stretch sm:gap-2"
      role="button"
      aria-label={l.version.title}
    >
      <span className={cn('w-28 shrink-0 overflow-hidden rounded-2xl sm:w-auto', l.done && 'opacity-80')}>
        <LessonArt id={l.art} size="100%" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5 sm:px-1">
        <div className="min-w-0">
          <Text tone="ink" bold className="font-display text-lg leading-tight">
            {l.version.title}
          </Text>
          <Text size="sm">{l.version.blurb}</Text>
        </div>
        <div className="flex flex-wrap gap-1">
          {l.done ? (
            <Pill tone="good" icon={<IconCheck size={12} />}>
              Done
            </Pill>
          ) : (
            <>
              <Pill tone="brand" icon={<XpStar size={14} />}>
                +{LESSON_XP} XP
              </Pill>
              {l.rewardCents > 0 && (
                <Pill tone="coin">
                  +<Money cents={l.rewardCents} size="sm" />
                </Pill>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

function Shelf({ title, lessons }: { title: string; lessons: LessonListItem[] }) {
  const navigate = useNavigate();
  if (!lessons.length) return null;
  return (
    <section>
      <SectionTitle>{title}</SectionTitle>
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {lessons.map((l) => (
          <motion.div key={l.id} variants={popIn}>
            <LessonCard lesson={l} onOpen={() => navigate(`/kid/learn/${l.id}`)} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default function KidLearn() {
  const { data } = useLessons();
  if (!data) return <Loading />;
  const done = data.lessons.filter((l) => l.done).length;
  const total = data.lessons.length;
  // Picks a grown-up made come first; in "only my picks" mode they are the whole list.
  const picks = data.lessons.filter((l) => l.assigned && !l.done);
  const rest = data.learnMode === 'open' ? data.lessons.filter((l) => !picks.includes(l)) : data.lessons.filter((l) => l.done);

  return (
    <div className="flex flex-col gap-5">
      <Heading level={1} size="lg">
        Money school
      </Heading>
      <PennySays mood={done === total && total > 0 ? 'cheer' : 'think'}>
        {total === 0
          ? 'No lessons picked for you yet. Ask a grown-up to choose some!'
          : data.age == null
            ? 'Money works like a game with rules. Learn them and you win! Ask a grown-up to set your age for lessons made just for you.'
            : done === total
              ? 'You finished every lesson. You are a money whiz!'
              : 'Money works like a game with rules. Learn them and you win!'}
      </PennySays>

      {total > 0 && (
        <Card className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Text tone="ink" bold className="font-display text-lg">
              {done} of {total} lessons
            </Text>
            <Pill tone="brand" icon={<XpStar size={18} />}>
              +{LESSON_XP} XP each
            </Pill>
          </div>
          <ProgressBar value={done / total} tone="good" height="h-4" />
          <Text size="xs">Lessons for {AGE_BAND_NAMES[data.band].toLowerCase()}</Text>
        </Card>
      )}

      <Shelf title="Picked for you" lessons={picks} />
      {LESSON_CATEGORIES.map((cat) => (
        <Shelf key={cat} title={LESSON_CATEGORY_NAMES[cat]} lessons={rest.filter((l) => l.category === cat)} />
      ))}
    </div>
  );
}
