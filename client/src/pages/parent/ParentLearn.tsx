// The grown-up side of Money school: the lesson library for each kid's age, which
// lessons a kid should do, and what finishing them pays. XP is paid either way.
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AGE_BAND_NAMES, LESSON_CATEGORIES, LESSON_CATEGORY_NAMES, LESSON_XP } from '@kk/shared';
import { Coin, IconCheck, LessonArt, Penny } from '@/art';
import { AmountPicker, Button, Card, EmptyState, KidChips, Money, PennySays, Pill, SectionTitle, Segmented, Sheet, Text, Toggle } from '@/components/ui';
import { endpoints } from '@/lib/api';
import { celebrate } from '@/lib/celebrate';
import { popIn, stagger } from '@/lib/motion';
import { qk, useAction, useHome, useLessons } from '@/lib/queries';
import type { FamilySettings, Kid, LearnMode, LessonListItem } from '@/lib/types';
import { PageIntro, useSheet } from './parts';

const MODES: { value: LearnMode; label: string }[] = [
  { value: 'open', label: 'Whole library' },
  { value: 'assigned', label: 'Only my picks' },
];

/** The family-wide lesson rules: default coin reward and which lessons kids see. */
function LearnRules({ family }: { family: FamilySettings }) {
  const save = useAction(endpoints.updateSettings, { invalidate: [qk.home, ['lessons']], success: 'Saved!' });
  const [reward, setReward] = useState(family.lessonRewardCents);
  const dirty = reward !== family.lessonRewardCents;
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Coin size={30} />
          <Text tone="ink" bold className="font-display">
            Each lesson finished pays
          </Text>
        </div>
        <AmountPicker value={reward} onChange={setReward} min={0} max={10_000} steps={[5, 25, 100]} />
        <Text size="xs" tone="faint" className="text-center">
          {reward === 0 ? `Lessons pay ${LESSON_XP} XP only.` : `Plus ${LESSON_XP} XP. Paid once per lesson, when every quiz answer is right.`} A lesson you pick can pay its own amount.
        </Text>
        <Button
          block
          disabled={!dirty}
          busy={save.busy && dirty}
          onClick={(e) => {
            const el = e.currentTarget;
            void save.run({ lessonRewardCents: reward }).then(() => celebrate('save', el)).catch(() => undefined);
          }}
        >
          {dirty ? 'Save lesson reward' : 'All saved'}
        </Button>
      </div>
      <div className="flex flex-col gap-2 border-t-2 border-line pt-4">
        <Text tone="ink" bold className="font-display">
          Kids can see
        </Text>
        <Segmented value={family.learnMode} options={MODES} onChange={(learnMode) => void save.run({ learnMode }).catch(() => undefined)} />
        <Text size="xs" tone="faint">
          {family.learnMode === 'open'
            ? 'Every lesson for their age. Lessons you pick show up first, in Picked for you.'
            : 'Only the lessons you pick for them below.'}
        </Text>
      </div>
    </Card>
  );
}

/** Pick or unpick one lesson for one kid, with an optional amount of its own. */
function AssignForm({ kid, lesson, familyReward, onDone }: { kid: Kid; lesson: LessonListItem; familyReward: number; onDone: () => void }) {
  const invalidate = [qk.lessons(kid.id)];
  const assign = useAction(endpoints.assignLesson, { invalidate, success: `Picked for ${kid.name}!` });
  const unassign = useAction(endpoints.unassignLesson, { invalidate, success: 'Removed' });
  const ownAmount = lesson.assigned && lesson.rewardCents !== familyReward;
  const [custom, setCustom] = useState(ownAmount);
  const [amount, setAmount] = useState(lesson.rewardCents || 100);
  const { version } = lesson;
  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-2xl">
        <LessonArt id={lesson.art} size="100%" />
      </div>
      <div>
        <Text tone="ink" bold className="font-display text-lg">
          {version.title}
        </Text>
        <Text size="sm">{version.blurb}</Text>
        <Text size="xs" tone="faint" className="mt-1">
          {version.pages.length} short pages, then a {version.quiz.length} question quiz.
        </Text>
      </div>
      <Card tone="soft" sticker={false} pad="sm" className="flex flex-col gap-1.5">
        {version.pages.map((p) => (
          <Text key={p.heading} size="sm" tone="ink">
            {p.heading}
          </Text>
        ))}
      </Card>
      {lesson.done ? (
        <Pill tone="good" icon={<IconCheck size={12} />} className="self-start">
          {kid.name} finished this one
        </Pill>
      ) : (
        <>
          <Card tone="brand" sticker={false} pad="sm" className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <Text tone="ink" bold>
                Its own reward
              </Text>
              <Toggle label="Its own reward" checked={custom} onChange={setCustom} />
            </div>
            {custom ? (
              <AmountPicker value={amount} onChange={setAmount} min={0} max={10_000} steps={[5, 25, 100]} />
            ) : (
              <Text size="xs">Pays the family lesson reward{familyReward > 0 ? '' : ' (XP only right now)'}.</Text>
            )}
          </Card>
          <Button
            size="lg"
            block
            busy={assign.busy}
            onClick={(e) => {
              const el = e.currentTarget;
              void assign
                .run(lesson.id, [kid.id], custom ? amount : null)
                .then(() => {
                  celebrate('save', el);
                  onDone();
                })
                .catch(() => undefined);
            }}
          >
            {lesson.assigned ? 'Save' : `Pick for ${kid.name}`}
          </Button>
        </>
      )}
      {lesson.assigned && (
        <Button variant="ghost" busy={unassign.busy} onClick={() => void unassign.run(lesson.id, kid.id).then(onDone).catch(() => undefined)}>
          Unpick this lesson
        </Button>
      )}
    </div>
  );
}

/** One kid's shelf: every lesson for their age band, grouped by topic. */
function Library({ kid, familyReward }: { kid: Kid; familyReward: number }) {
  const { data } = useLessons(kid.id);
  const sheet = useSheet<'lesson', LessonListItem>();
  if (!data) return null;
  const picked = data.lessons.filter((l) => l.assigned);
  const open = sheet.target ? data.lessons.find((l) => l.id === sheet.target!.id) ?? null : null;
  return (
    <div className="flex flex-col gap-5">
      <Card tone="soft" sticker={false} pad="sm" className="flex flex-wrap items-center gap-2">
        <Text tone="ink" bold>
          {AGE_BAND_NAMES[data.band]}
        </Text>
        <Pill tone="good">{data.lessons.filter((l) => l.done).length} done</Pill>
        <Pill tone="brand">{picked.length} picked</Pill>
        {data.age == null && <Text size="xs">Set {kid.name}'s age on the Family page for lessons made for them.</Text>}
      </Card>
      {LESSON_CATEGORIES.map((cat) => {
        const shelf = data.lessons.filter((l) => l.category === cat);
        if (!shelf.length) return null;
        return (
          <section key={cat}>
            <SectionTitle>{LESSON_CATEGORY_NAMES[cat]}</SectionTitle>
            <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {shelf.map((l) => (
                <motion.div key={l.id} variants={popIn}>
                  <Card pad="sm" tone={l.assigned ? 'brand' : 'plain'} onClick={() => sheet.show('lesson', l)} className="press flex h-full cursor-pointer items-center gap-3" role="button" aria-label={l.version.title}>
                    <span className="w-20 shrink-0 overflow-hidden rounded-xl">
                      <LessonArt id={l.art} size="100%" />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
                      <Text tone="ink" bold className="leading-tight">
                        {l.version.title}
                      </Text>
                      <div className="flex flex-wrap gap-1">
                        {l.done && (
                          <Pill tone="good" icon={<IconCheck size={12} />}>
                            Done
                          </Pill>
                        )}
                        {l.assigned && <Pill tone="brand">Picked</Pill>}
                        {l.rewardCents > 0 && (
                          <Pill tone="coin">
                            <Money cents={l.rewardCents} size="sm" />
                          </Pill>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </section>
        );
      })}
      <Sheet open={sheet.open === 'lesson'} onClose={sheet.close} title={`A lesson for ${kid.name}`}>
        {open && <AssignForm key={open.id} kid={kid} lesson={open} familyReward={familyReward} onDone={sheet.close} />}
      </Sheet>
    </div>
  );
}

export default function ParentLearn() {
  const { data } = useHome();
  const [kidId, setKidId] = useState<string | null>(null);
  if (!data) return null;
  const { family, kids } = data;
  const kid = kids.find((k) => k.id === kidId) ?? kids[0];

  return (
    <div className="flex flex-col gap-6">
      <PageIntro title="Money school" art={<LessonArt id="interest" size={96} />}>
        Short lessons with a quiz at the end. Pick the ones you want, and reward them if you like.
      </PageIntro>
      <LearnRules family={family} />
      {kid ? (
        <>
          <PennySays mood="think" size={56}>
            Every lesson pays {LESSON_XP} XP the first time a kid aces the quiz. Tap a lesson to preview it and pick it for {kid.name}.
          </PennySays>
          {kids.length > 1 && <KidChips kids={kids} selected={[kid.id]} onToggle={(id) => id && setKidId(id)} />}
          <Library key={kid.id} kid={kid} familyReward={family.lessonRewardCents} />
        </>
      ) : (
        <EmptyState art={<Penny size={100} mood="think" />} title="No kids yet">
          Add a kid on the Family page to pick lessons for them.
        </EmptyState>
      )}
    </div>
  );
}
