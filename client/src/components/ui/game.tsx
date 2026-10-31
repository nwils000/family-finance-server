import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { levelFor, levelTitle, type AvatarId, type HatId } from '@kk/shared';
import { Avatar, FlameBig, Hat, LevelShield, Penny, XpStar, type PennyMood } from '@/art';
import { cn } from '@/lib/cn';
import { bouncy, gentle } from '@/lib/motion';
import { Card, Heading, ProgressBar, Text } from './primitives';
import { Chip } from './forms';

/* ---------- KidAvatar: an avatar wearing its hat ---------- */

export function KidAvatar({ avatar, hat = 'none', size = 56, ring, className }: { avatar: AvatarId; hat?: HatId; size?: number; ring?: boolean; className?: string }) {
  return (
    <span className={cn('relative inline-block shrink-0', className)} style={{ width: size, height: size }}>
      <Avatar id={avatar} size={size} ring={ring} />
      <Hat id={hat} size={size} className="absolute inset-0" />
    </span>
  );
}

/* ---------- Level + XP ---------- */

export function LevelProgress({ xp, compact }: { xp: number; compact?: boolean }) {
  const { level, intoLevel, levelSize, progress } = levelFor(xp);
  return (
    <div className="flex items-center gap-3">
      <motion.span key={level} initial={{ scale: 0.5, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={bouncy}>
        <LevelShield level={level} size={compact ? 40 : 52} />
      </motion.span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-baseline justify-between gap-2">
          <Text tone="ink" bold size={compact ? 'sm' : 'md'} className="truncate font-display">
            {levelTitle(level)}
          </Text>
          <Text size="xs" tone="faint" className="tabular shrink-0">
            {intoLevel}/{levelSize} XP
          </Text>
        </div>
        <ProgressBar value={progress} tone="brand" height={compact ? 'h-3' : 'h-4'} />
      </div>
    </div>
  );
}

/* ---------- Streak ---------- */

/** The streak flame, hotter as the streak grows. `count={false}` when the caller already says the number. */
export function StreakFlame({ streak, size = 44, count = true }: { streak: number; size?: number; count?: boolean }) {
  const intensity = streak >= 14 ? 3 : streak >= 7 ? 2 : streak >= 3 ? 1 : 0;
  return (
    <span className="inline-flex items-center gap-1" aria-label={`${streak} day streak`}>
      <span className={streak ? '' : 'opacity-40 grayscale'}>
        <FlameBig size={size} intensity={intensity} />
      </span>
      {count && <span className="font-display text-xl font-bold tabular">{streak}</span>}
    </span>
  );
}

/* ---------- Stat chip (top bar counters) ---------- */

export function StatChip({ icon, children, onClick, label }: { icon: ReactNode; children: ReactNode; onClick?: () => void; label: string }) {
  const Tag = onClick ? 'button' : 'span';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      aria-label={label}
      className={cn('inline-flex h-10 items-center gap-1.5 rounded-full border-[2.5px] border-ink bg-surface pl-1 pr-3 font-display font-bold shadow-chunky-sm', onClick && 'press')}
    >
      {icon}
      {children}
    </Tag>
  );
}

export const XpChip = ({ xp }: { xp: number }) => (
  <StatChip icon={<XpStar size={30} />} label={`Level ${levelFor(xp).level}`}>
    Lv {levelFor(xp).level}
  </StatChip>
);

/* ---------- Penny says ---------- */

/** The mascot with a speech bubble. Use it to explain things the playful way. */
export function PennySays({ mood = 'happy', children, size = 72, className }: { mood?: PennyMood; children: ReactNode; size?: number; className?: string }) {
  return (
    <div className={cn('flex items-end gap-2', className)}>
      <motion.span className="kk-bob shrink-0" initial={{ scale: 0, rotate: -15 }} animate={{ scale: 1, rotate: 0 }} transition={bouncy}>
        <Penny size={size} mood={mood} />
      </motion.span>
      <motion.div
        initial={{ opacity: 0, x: -8, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ ...gentle, delay: 0.1 }}
        className="relative mb-3 rounded-2xl rounded-bl-md border-[2.5px] border-ink bg-surface px-3.5 py-2.5 shadow-chunky-sm"
      >
        <Text tone="ink" size="sm" className="leading-snug">
          {children}
        </Text>
      </motion.div>
    </div>
  );
}

/* ---------- Empty state ---------- */

export function EmptyState({ art, title, children, action }: { art: ReactNode; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <Card tone="soft" sticker={false} className="flex flex-col items-center gap-2 py-8 text-center">
      <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={gentle} className="kk-bob">
        {art}
      </motion.span>
      <Heading size="xs">{title}</Heading>
      {children && <Text size="sm">{children}</Text>}
      {action && <div className="mt-2">{action}</div>}
    </Card>
  );
}

/* ---------- Section header ---------- */

export function SectionTitle({ children, action, icon }: { children: ReactNode; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="mb-3 mt-1 flex items-center justify-between gap-3">
      <Heading level={2} size="xs" className="flex items-center gap-2">
        {icon}
        {children}
      </Heading>
      {action}
    </div>
  );
}

/**
 * A row of kid chips: avatar + name, tap to toggle. Multi-select when `selected`
 * holds several ids; pass `all` to add an "Everyone" chip (on when nothing is selected).
 * The one way to pick kids: filters, team members, quest assignees and helpers.
 */
export function KidChips({
  kids,
  selected,
  onToggle,
  all,
  label,
}: {
  kids: { id: string; name: string; avatar: AvatarId; hat?: HatId }[];
  selected: string[];
  onToggle: (id: string | null) => void;
  all?: string;
  /** Optional lead-in text, e.g. "Who helped?". */
  label?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {label && (
        <Text as="span" size="xs" bold>
          {label}
        </Text>
      )}
      {all && (
        <Chip selected={selected.length === 0} onClick={() => onToggle(null)}>
          {all}
        </Chip>
      )}
      {kids.map((k) => (
        <Chip key={k.id} selected={selected.includes(k.id)} onClick={() => onToggle(k.id)} icon={<KidAvatar avatar={k.avatar} hat={k.hat} size={22} />}>
          {k.name}
        </Chip>
      ))}
    </div>
  );
}
