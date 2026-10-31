// Full-screen celebrations for the big moments: levelling up, opening the chest,
// unlocking a hat. Anything can call showMoment(); one overlay renders them.
import { useEffect } from 'react';
import { create } from 'zustand';
import { AnimatePresence, motion } from 'framer-motion';
import { HATS, levelTitle, type HatId } from '@kk/shared';
import { ChestOpen, HatPreview, LevelShield, Sparkle, XpStar } from '@/art';
import { Button, Heading, Money, Text } from '@/components/ui';
import { celebrate } from '@/lib/celebrate';
import { bouncy } from '@/lib/motion';

export type Moment =
  | { kind: 'levelUp'; level: number; bonusCents: number }
  | { kind: 'chest'; xp: number };

const useMoments = create<{ queue: Moment[]; push: (m: Moment) => void; shift: () => void }>((set) => ({
  queue: [],
  push: (m) => set((s) => ({ queue: [...s.queue, m] })),
  shift: () => set((s) => ({ queue: s.queue.slice(1) })),
}));

export const showMoment = (m: Moment) => useMoments.getState().push(m);

/** After any XP award: queue a level-up party if one happened. */
export const afterXp = (r: { levelUp: number | null; bonusCents: number }) => {
  if (r.levelUp) showMoment({ kind: 'levelUp', level: r.levelUp, bonusCents: r.bonusCents });
};

/** Chest first, then the level party if the chest's XP crossed a level. */
export const afterChest = (r: { xp: number; levelUp: number | null; bonusCents: number }) => {
  showMoment({ kind: 'chest', xp: r.xp });
  afterXp(r);
};

const hatsAt = (level: number) => HATS.filter((h) => h.level === level).map((h) => h.id as HatId);

function MomentBody({ moment }: { moment: Moment }) {
  useEffect(() => {
    celebrate(moment.kind === 'chest' ? 'chest' : 'levelUp');
  }, [moment]);

  if (moment.kind === 'chest') {
    return (
      <>
        <motion.div initial={{ scale: 0.3, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={bouncy}>
          <ChestOpen size={200} />
        </motion.div>
        <Heading size="lg" className="text-white text-outline">
          Treasure!
        </Heading>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...bouncy, delay: 0.3 }} className="flex items-center gap-2 rounded-full border-[2.5px] border-ink bg-surface px-4 py-2 shadow-chunky">
          <XpStar size={36} />
          <span className="font-display text-2xl font-bold">+{moment.xp} XP</span>
        </motion.div>
        <Text tone="inherit" className="text-white/90">
          You finished every quest today. Come back tomorrow for another chest!
        </Text>
      </>
    );
  }
  const unlocked = hatsAt(moment.level);
  return (
    <>
      <motion.div className="relative" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={bouncy}>
        <LevelShield level={moment.level} size={180} />
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="absolute"
            style={{ left: `${[0, 85, 5, 80][i]}%`, top: `${[5, 0, 75, 70][i]}%` }}
            animate={{ scale: [0, 1.2, 0], rotate: [0, 90] }}
            transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.3 }}
          >
            <Sparkle size={32} />
          </motion.span>
        ))}
      </motion.div>
      <Heading size="lg" className="text-white text-outline">
        Level {moment.level}!
      </Heading>
      <Text tone="inherit" size="lg" bold className="font-display text-white">
        You are now a {levelTitle(moment.level)}
      </Text>
      {moment.bonusCents > 0 && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...bouncy, delay: 0.3 }} className="flex items-center gap-2 rounded-full border-[2.5px] border-ink bg-surface px-4 py-2 shadow-chunky">
          <span className="font-display text-xl font-bold">Level bonus</span>
          <Money cents={moment.bonusCents} size="md" />
        </motion.div>
      )}
      {unlocked.length > 0 && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...bouncy, delay: 0.4 }} className="flex items-center gap-3 rounded-2xl border-[2.5px] border-ink bg-surface px-4 py-2 shadow-chunky">
          {unlocked.map((h) => (
            <HatPreview key={h} id={h} size={56} />
          ))}
          <Text tone="ink" bold>
            New hat unlocked!
          </Text>
        </motion.div>
      )}
    </>
  );
}

export function MomentOverlay() {
  const { queue, shift } = useMoments();
  const current = queue[0];
  return (
    // Default (sync) mode: a moment fades out while the next fades in on top, so a fast
    // tap can never leave the queue stuck behind an unfinished exit.
    <AnimatePresence>
      {current && (
        <motion.div
          key={JSON.stringify(current)}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4 bg-ink/80 p-6 text-center backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, pointerEvents: 'none' }}
          // Only a tap on the backdrop itself: the button's tap would bubble here and
          // shift twice, skipping the next moment (a level up right after a chest).
          onClick={(e) => e.target === e.currentTarget && shift()}
        >
          <MomentBody moment={current} />
          <Button variant="coin" size="lg" className="mt-2" onClick={shift}>
            Awesome!
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
