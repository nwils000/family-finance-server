// Today's quests: the kid's home base. Peek at yesterday or tomorrow, tap
// "I did it!", fill the progress bar and crack open the daily chest.
import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { autoApproves, CHEST_XP, formatCents, toDateKey } from '@kk/shared';
import { ChestClosed, ChestLocked, ChestOpen, IconCalendar, Penny, SceneAllDone, Sparkle, XpStar, type PennyMood } from '@/art';
import { Button, Card, EmptyState, Heading, PennySays, Pill, ProgressBar, SectionTitle, Segmented, StreakFlame, Text } from '@/components/ui';
import { QuestCard } from '@/features/cards';
import { HelperPicker } from '@/features/teamwork';
import { afterChest, afterXp } from '@/features/moments';
import { endpoints } from '@/lib/api';
import { celebrate } from '@/lib/celebrate';
import { bouncy, popIn, stagger } from '@/lib/motion';
import { useAction, useDay, useSelfKid } from '@/lib/queries';
import type { DayQuest } from '@/lib/types';
import { Loading } from './kid-parts';

type DayPick = 'yesterday' | 'today' | 'tomorrow';
const OFFSET: Record<DayPick, number> = { yesterday: -1, today: 0, tomorrow: 1 };
const DAY_OPTIONS: { value: DayPick; label: string }[] = [
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
];

const keyFor = (pick: DayPick) => {
  const d = new Date();
  d.setDate(d.getDate() + OFFSET[pick]);
  return toDateKey(d);
};

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

/** Waiting for a thumbs up or already paid both count as finished. */
const isFinished = (q: DayQuest) => q.run?.status === 'done' || q.run?.status === 'approved';

function pennyLine(pick: DayPick, total: number, finished: number): { mood: PennyMood; text: string } {
  if (!total) return { mood: 'sleepy', text: pick === 'tomorrow' ? 'Nothing planned for tomorrow yet. Rest up!' : 'No quests here. Time to relax!' };
  if (pick === 'tomorrow') return { mood: 'wow', text: `Sneak peek! ${total} quest${total === 1 ? '' : 's'} coming tomorrow.` };
  if (finished === total) return { mood: 'cheer', text: 'You did every single quest. Superstar!' };
  if (finished === 0) return { mood: 'think', text: 'Which quest will you knock out first?' };
  return { mood: 'happy', text: `Nice work! Just ${total - finished} more to go.` };
}

export default function KidHome() {
  const { kid, family, data: home } = useSelfKid();
  // Siblings who can be credited as helpers (never yourself).
  const siblings = family?.features.assists ? (home?.siblings ?? []).filter((s) => s.id !== kid?.id) : [];
  const [pick, setPick] = useState<DayPick>('today');
  const date = keyFor(pick);
  const day = useDay(date);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const done = useAction(endpoints.markDone);
  const undo = useAction(endpoints.undoDone);
  const chest = useAction(endpoints.openChest, { onSuccess: afterChest });
  const helpers = useAction(endpoints.setHelpers, { invalidate: [['day']] });
  const toggleHelper = (q: DayQuest, helperId: string) => {
    const current = q.run?.helperIds ?? [];
    const next = current.includes(helperId) ? current.filter((h) => h !== helperId) : [...current, helperId];
    void helpers.run(q.id, date, next);
  };

  const quests = day.data?.quests ?? [];
  const finished = quests.filter(isFinished).length;
  const sentBack = quests.some((q) => q.run?.status === 'rejected');
  const waiting = quests.filter((q) => q.run?.status === 'done').length;
  const line = pennyLine(pick, quests.length, finished);
  const isFuture = pick === 'tomorrow';

  const markDone = async (q: DayQuest, el: HTMLElement) => {
    setPendingId(q.id);
    try {
      const res = await done.run(q.id, date);
      // A trusted quest pays on the spot: coins and maybe a level up, not "waiting".
      if ('paidCents' in res) {
        celebrate('coins', el);
        afterXp(res);
        toast.success(`+${formatCents(res.paidCents)}! Trusted quest, paid right away.`);
      } else {
        celebrate('done', el);
      }
    } finally {
      setPendingId(null);
    }
  };

  const takeBack = async (q: DayQuest) => {
    setPendingId(q.id);
    try {
      await undo.run(q.id, date);
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <div className="flex flex-col gap-1">
        <Heading level={1} size="lg">
          {greeting()}, {kid?.name}!
        </Heading>
        <PennySays key={`${pick}-${line.mood}`} mood={line.mood}>
          {line.text}
        </PennySays>
      </div>

      <Segmented value={pick} onChange={setPick} options={DAY_OPTIONS} />

      {day.isLoading ? (
        <Loading />
      ) : !quests.length ? (
        <EmptyState art={pick === 'today' ? <SceneAllDone size={180} /> : <Penny size={120} mood="sleepy" />} title={pick === 'today' ? 'No quests today!' : 'Nothing here'}>
          {pick === 'today' ? 'Enjoy your free day. Check back tomorrow for new quests.' : 'Peek at another day to see your quests.'}
        </EmptyState>
      ) : (
        <>
          {!isFuture && <DailyProgress total={quests.length} finished={finished} />}

          <section>
            <SectionTitle icon={<IconCalendar size={22} />} action={isFuture && <Pill tone="brand">Coming soon</Pill>}>
              {pick === 'today' ? "Today's quests" : pick === 'yesterday' ? "Yesterday's quests" : "Tomorrow's quests"}
            </SectionTitle>
            <motion.div key={date} variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-3">
              {quests.map((q) => (
                <QuestCard
                  key={q.id}
                  quest={q}
                  status={q.run?.status ?? null}
                  trusted={!!kid && autoApproves(q, kid)}
                  footer={
                    q.run?.status === 'done' && siblings.length > 0 ? (
                      <HelperPicker siblings={siblings} value={q.run.helperIds} onToggle={(id) => toggleHelper(q, id)} disabled={helpers.busy} />
                    ) : null
                  }
                  action={
                    isFuture ? null : !q.run ? (
                      <Button variant="good" size="sm" busy={pendingId === q.id} onClick={(e) => void markDone(q, e.currentTarget)}>
                        I did it!
                      </Button>
                    ) : q.run.status === 'done' ? (
                      <Button variant="ghost" size="sm" busy={pendingId === q.id} onClick={() => void takeBack(q)}>
                        Undo
                      </Button>
                    ) : null
                  }
                />
              ))}
            </motion.div>
          </section>

          {family?.features.chest && !isFuture && (
            <ChestCard
              left={quests.length - finished}
              waiting={waiting}
              sentBack={sentBack}
              opened={!!day.data?.chestOpened}
              busy={chest.busy}
              onOpen={() => void chest.run(date)}
            />
          )}
        </>
      )}

      {kid && <StreakCallout streak={kid.streak} />}
    </div>
  );
}

function DailyProgress({ total, finished }: { total: number; finished: number }) {
  const all = finished === total;
  return (
    <Card tone={all ? 'good' : 'plain'} className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <Text tone="ink" bold className="font-display text-lg">
          {finished} of {total} quests
        </Text>
        {all && (
          <motion.span initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={bouncy} className="inline-flex items-center gap-1">
            <Sparkle size={22} />
            <Text tone="good" bold as="span">
              All done!
            </Text>
          </motion.span>
        )}
      </div>
      <ProgressBar value={total ? finished / total : 0} tone={all ? 'good' : 'brand'} height="h-5" />
    </Card>
  );
}

/** The chest mirrors the server rule: it opens only once a grown-up approved every quest that day. */
function ChestCard({ left, waiting, sentBack, opened, busy, onOpen }: { left: number; waiting: number; sentBack: boolean; opened: boolean; busy: boolean; onOpen: () => void }) {
  const ready = left === 0 && waiting === 0 && !sentBack && !opened;
  return (
    <motion.div variants={popIn} initial="hidden" animate="show">
      <Card tone={ready ? 'coin' : opened ? 'soft' : 'plain'} className="flex items-center gap-4">
        <span className="shrink-0">
          {opened ? (
            <ChestOpen size={96} className="opacity-50 grayscale-[40%]" />
          ) : ready ? (
            <motion.span
              className="inline-block"
              animate={{ rotate: [0, -8, 8, -6, 6, 0], scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 0.9, repeatDelay: 0.9 }}
            >
              <ChestClosed size={96} />
            </motion.span>
          ) : (
            <ChestLocked size={96} />
          )}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <Heading level={2} size="xs">
            Daily chest
          </Heading>
          {opened ? (
            <Text size="sm">You already opened this one. Come back tomorrow for another!</Text>
          ) : sentBack ? (
            <Text size="sm">A grown-up sent a quest back, so this chest stays locked. Try again tomorrow!</Text>
          ) : ready ? (
            <>
              <Text size="sm" tone="ink">
                A grown-up approved every quest. It is yours!
              </Text>
              <Button variant="coin" busy={busy} onClick={onOpen} icon={<XpStar size={24} />} className="self-start">
                Open it! +{CHEST_XP} XP
              </Button>
            </>
          ) : left === 0 ? (
            <>
              <Text size="sm">All done! It opens as soon as a grown-up gives your quests a thumbs up.</Text>
              <Pill tone="brand" className="self-start">
                {waiting} waiting for a check
              </Pill>
            </>
          ) : (
            <>
              <Text size="sm">Finish every quest, then a grown-up checks them to unlock it.</Text>
              <Pill tone="coin" className="self-start">
                {left} more to go
              </Pill>
            </>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function StreakCallout({ streak }: { streak: number }) {
  return (
    <Card tone={streak ? 'coin' : 'soft'} sticker={!!streak} className="flex items-center gap-3">
      <motion.span className="shrink-0" animate={streak ? { scale: [1, 1.08, 1] } : undefined} transition={{ repeat: Infinity, duration: 1.6 }}>
        <StreakFlame streak={streak} size={60} count={false} />
      </motion.span>
      <div className="min-w-0">
        <Heading level={2} size="xs">
          {streak ? `${streak} day streak!` : 'Start a streak!'}
        </Heading>
        <Text size="sm">{streak ? 'Keep it going. Finish a quest every day to make it grow.' : 'Finish a quest today to light your flame.'}</Text>
      </div>
    </Card>
  );
}
