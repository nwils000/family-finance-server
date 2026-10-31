// Feature-level building blocks shared by the kid and grown-up screens. One
// QuestCard, one RewardCard, one ActivityList: never a second copy per role.
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { isTransfer, WEEKDAYS, type Repeat } from '@kk/shared';
import { IconCalendar, IconCheck, IconClock, IconEdit, PiggyBank, QuestIcon, RewardIcon, Rocket, Wallet } from '@/art';
import { Card, KidAvatar, Money, Pill, Stars, Text } from '@/components/ui';
import { cn } from '@/lib/cn';
import { popIn } from '@/lib/motion';
import type { ActivityItem, KidRef, Quest, Reward, RunStatus } from '@/lib/types';

/** Shown on tappable cards so grown-ups can tell they open an editor. */
function EditHint({ className }: { className?: string }) {
  return (
    <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-line bg-surface-soft text-ink-soft', className)} aria-hidden>
      <IconEdit size={16} />
    </span>
  );
}

/** "Every day", "Mon, Wed, Fri", "Just once". The one place a repeat is described. */
export const describeRepeat = (r: Repeat) => {
  if (r.kind === 'daily') return 'Every day';
  if (r.kind === 'once') return 'Just once';
  if (r.days.length === 7) return 'Every day';
  if (r.days.length === 5 && [1, 2, 3, 4, 5].every((d) => r.days.includes(d))) return 'Weekdays';
  return [...r.days].sort().map((d) => WEEKDAYS[d]).join(', ');
};

const STATUS: Record<RunStatus, { label: string; tone: 'brand' | 'good' | 'bad' }> = {
  done: { label: 'Waiting for a thumbs up', tone: 'brand' },
  approved: { label: 'Paid!', tone: 'good' },
  rejected: { label: 'Try again next time', tone: 'bad' },
};

export function QuestCard({
  quest,
  status,
  kid,
  action,
  footer,
  trusted,
  onClick,
}: {
  quest: Pick<Quest, 'title' | 'icon' | 'stars' | 'rewardCents'> & { repeat?: Repeat };
  status?: RunStatus | null;
  kid?: KidRef;
  action?: ReactNode;
  /** Extra row under the card, like the helper picker. */
  footer?: ReactNode;
  /** Trusted: pays on "I did it!" without a grown-up check. */
  trusted?: boolean;
  onClick?: () => void;
}) {
  const finished = status === 'done' || status === 'approved';
  return (
    <motion.div variants={popIn} layout>
      <Card
        pad="sm"
        tone={status === 'approved' ? 'good' : 'plain'}
        onClick={onClick}
        className={cn('flex flex-col gap-2', onClick && 'press cursor-pointer')}
      >
        <div className="flex items-center gap-3">
        <span className="relative shrink-0">
          <QuestIcon id={quest.icon} title={quest.title} size={60} className={cn(finished && 'opacity-60')} />
          {finished && (
            <motion.span
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink bg-good text-white"
            >
              <IconCheck size={16} />
            </motion.span>
          )}
        </span>
        <div className="min-w-0 flex-1">
          <Text tone="ink" bold className={cn('line-clamp-2 break-words font-display text-lg leading-tight', status === 'approved' && 'line-through decoration-2 opacity-70')}>
            {quest.title}
          </Text>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <Stars value={quest.stars} size={15} />
            <Money cents={quest.rewardCents} size="sm" />
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {kid && (
              <span className="inline-flex items-center gap-1">
                <KidAvatar avatar={kid.avatar} size={20} />
                <Text size="xs" bold>{kid.name}</Text>
              </span>
            )}
            {quest.repeat && (
              <Text size="xs" tone="faint" as="span" className="inline-flex items-center gap-1">
                <IconCalendar size={14} />
                {describeRepeat(quest.repeat)}
              </Text>
            )}
            {trusted && status !== 'approved' && (
              <Pill tone="good" icon={<IconCheck size={12} />}>
                Trusted
              </Pill>
            )}
            {status && <Pill tone={STATUS[status].tone}>{STATUS[status].label}</Pill>}
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : onClick && <EditHint />}
        </div>
        {footer}
      </Card>
    </motion.div>
  );
}

export function RewardCard({
  reward,
  action,
  footer,
  dim,
  onClick,
}: {
  reward: Pick<Reward, 'title' | 'icon' | 'priceCents'>;
  action?: ReactNode;
  footer?: ReactNode;
  dim?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.div variants={popIn} layout>
      <Card pad="sm" onClick={onClick} className={cn('relative flex h-full flex-col items-center gap-2 text-center', onClick && 'press cursor-pointer')}>
        <motion.span whileHover={{ rotate: [0, -6, 6, 0] }} transition={{ duration: 0.5 }} className={cn(dim && 'opacity-50 grayscale')}>
          <RewardIcon id={reward.icon} title={reward.title} size={84} />
        </motion.span>
        <Text tone="ink" bold className="font-display leading-tight">
          {reward.title}
        </Text>
        <Money cents={reward.priceCents} size="sm" />
        {footer}
        {action && <div className="mt-auto w-full pt-1">{action}</div>}
        {!action && onClick && <EditHint className="absolute right-2 top-2" />}
      </Card>
    </motion.div>
  );
}

const POT_ART = { wallet: Wallet, piggy: PiggyBank, rocket: Rocket } as const;

const when = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  return sameDay
    ? d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export function ActivityList({ items, kids }: { items: ActivityItem[]; kids?: KidRef[] }) {
  const kidById = new Map(kids?.map((k) => [k.id, k]));
  return (
    <Card pad="none" className="divide-y-2 divide-line overflow-hidden">
      {items.map((t) => {
        const Art = POT_ART[t.pot];
        const kid = kidById.get(t.kidId);
        return (
          <div key={t.id} className="flex items-center gap-3 px-3 py-2.5">
            <span className="relative shrink-0">
              <Art size={40} />
              {kid && <KidAvatar avatar={kid.avatar} size={20} className="absolute -bottom-1 -right-1" />}
            </span>
            <div className="min-w-0 flex-1">
              <Text tone="ink" bold size="sm" className="truncate">
                {t.label}
              </Text>
              <Text size="xs" tone="faint" className="inline-flex items-center gap-1">
                <IconClock size={12} />
                {when(t.createdAt)}
                {kid && ` - ${kid.name}`}
              </Text>
            </div>
            {/* A move between the kid's own pots is neither earned nor spent: no sign, no color. */}
            <Money cents={t.amountCents} size="sm" coin={false} signed={!isTransfer(t.kind)} />
          </div>
        );
      })}
    </Card>
  );
}
