// Teamwork UI shared by the kid and grown-up screens: team goal cards with each
// kid's contribution, the "Who helped?" picker, and the helper-points ladder.
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { HatId } from '@kk/shared';
import { IconCheck, IconLock, LevelShield, Star } from '@/art';
import { Card, Heading, KidAvatar, KidChips, Pill, ProgressBar, Text } from '@/components/ui';
import { cn } from '@/lib/cn';
import { popIn } from '@/lib/motion';
import type { KidRef, Milestone, TeamGoal } from '@/lib/types';
import { Sticker } from './stickers';

type KidLike = KidRef & { hat?: HatId };

const pct = (share: number) => `${Math.round(share * 100)}%`;
const pts = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

export function TeamGoalCard({ goal, kids, action, highlightKidId }: { goal: TeamGoal; kids: KidLike[]; action?: ReactNode; highlightKidId?: string }) {
  const byId = new Map(kids.map((k) => [k.id, k]));
  const reached = goal.status !== 'active';
  return (
    <motion.div variants={popIn} layout>
      <Card tone={reached ? 'coin' : 'plain'} className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Sticker kind="reward" id={goal.icon} title={goal.title} size={64} />
          <div className="min-w-0 flex-1">
            <Heading level={3} size="xs" className="break-words">
              {goal.title}
            </Heading>
            <Text size="sm">
              {reached ? 'You did it together!' : `${pts(goal.progress)} of ${goal.targetPoints} team points`}
            </Text>
          </div>
          {reached && <Pill tone="good" icon={<IconCheck size={14} />}>{goal.status === 'handed' ? 'Enjoyed' : 'Reached'}</Pill>}
        </div>
        <ProgressBar value={goal.progress / goal.targetPoints} tone={reached ? 'good' : 'coin'} />
        <div className="flex flex-wrap gap-2">
          {goal.contributions.map((c) => {
            const kid = byId.get(c.kidId);
            if (!kid) return null;
            return (
              <span
                key={c.kidId}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border-2 bg-surface py-0.5 pl-0.5 pr-2.5',
                  c.kidId === highlightKidId ? 'border-ink' : 'border-line',
                )}
              >
                <KidAvatar avatar={kid.avatar} hat={kid.hat} size={26} />
                <Text as="span" size="sm" tone="ink" bold>
                  {kid.name} {pct(c.share)}
                </Text>
              </span>
            );
          })}
        </div>
        {action}
      </Card>
    </motion.div>
  );
}

/** "Who helped?" Tap siblings to credit them; the doer still earns every coin. */
export function HelperPicker({ siblings, value, onToggle, disabled }: { siblings: KidLike[]; value: string[]; onToggle: (id: string) => void; disabled?: boolean }) {
  if (!siblings.length) return null;
  return <KidChips kids={siblings} selected={value} label="Who helped?" onToggle={(id) => id && !disabled && onToggle(id)} />;
}

/** A kid's helper points climbing toward each milestone prize. */
/** What a milestone asks for, in words. The one place helper and level prizes are described. */
export const milestoneGoal = (kind: Milestone['kind'], n: number) => (kind === 'level' ? `Reach level ${n}` : `${pts(n)} helper points`);

/** A kid's ladder of helper prizes (by helper points) or level prizes (by level). */
export function MilestoneLadder({ kind, value, milestones }: { kind: Milestone['kind']; value: number; milestones: Milestone[] }) {
  const next = milestones.find((m) => !m.unlocked && m.points > value);
  const togo = next ? next.points - value : 0;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {kind === 'level' ? <LevelShield level={value} size={32} /> : <Star size={28} />}
        <Text tone="ink" bold className="font-display text-lg">
          {kind === 'level' ? `Level ${value}` : `${pts(value)} helper points`}
        </Text>
      </div>
      {next && (
        <div className="flex flex-col gap-1">
          <Text size="sm">
            {kind === 'level' ? `${togo} more ${togo === 1 ? 'level' : 'levels'}` : `${pts(togo)} more ${togo === 1 ? 'point' : 'points'}`} to unlock {next.title}
          </Text>
          <ProgressBar value={value / next.points} tone="sky" />
        </div>
      )}
      <div className="grid gap-2 sm:grid-cols-2">
        {milestones.map((m) => (
          <Card key={m.id} pad="sm" sticker={false} tone={m.unlocked ? 'good' : 'plain'} className="flex items-center gap-3">
            <span className={cn('relative shrink-0', !m.unlocked && 'opacity-60 grayscale')}>
              <Sticker kind="reward" id={m.icon} title={m.title} size={44} />
              {!m.unlocked && (
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-ink bg-surface">
                  <IconLock size={12} />
                </span>
              )}
            </span>
            <div className="min-w-0">
              <Text tone="ink" bold size="sm" className="break-words">
                {m.title}
              </Text>
              <Text size="xs">{m.unlocked ? 'Unlocked!' : milestoneGoal(kind, m.points)}</Text>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
