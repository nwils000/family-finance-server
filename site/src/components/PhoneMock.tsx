import type { ReactNode } from 'react';
import { defaultRewardCents, levelTitle, type AvatarId, type QuestIconId, type RewardIconId } from '@kk/shared';
import {
  Avatar,
  IconCheck,
  IconGrow,
  IconHome,
  IconInbox,
  IconLearn,
  IconQuests,
  IconShop,
  LevelShield,
  PiggyBank,
  QuestIcon,
  RewardIcon,
  Rocket,
  Star,
} from '@art';
import { Money, cx } from './ui';

/**
 * Illustrated app screens, drawn from the real art and the real rules (quest
 * rewards from `defaultRewardCents`, level titles from `levelTitle`), so the
 * showcase matches the product without screenshots of anyone's data.
 */

/** The family star value the app ships with (server/src/models.ts starValueCents default). */
const STAR_VALUE = 25;

/** Positioning (relative / absolute) comes from the caller, never from here: a built-in
 * `relative` silently beat a caller's `absolute` in Tailwind's order.
 * The shape is an iPhone screen (19.5:9) whatever the content, with the tab bar pinned to the
 * bottom as in the app: sized by content, a screen with fewer rows came out short and squat. */
export function PhoneFrame({ children, className, label }: { children: ReactNode; className?: string; label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cx('aspect-[9/19.5] w-[290px] flex-none overflow-hidden rounded-[42px] border-[3px] border-ink bg-bg shadow-[0_6px_0_rgb(var(--ink)),0_30px_60px_-20px_rgb(var(--ink)/0.45)]', className)}
    >
      {/* The column lives on an inner box: a caller's display class (`hidden sm:block`) on the
          frame would otherwise switch off the flex that pins the tab bar. */}
      <div className="flex h-full flex-col">
        <div className="mx-auto mt-2.5 h-5 w-24 flex-none rounded-full bg-ink" />
        <div className="flex flex-1 flex-col px-4 pb-3 pt-3">{children}</div>
      </div>
    </div>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <span className="flex">
      {Array.from({ length: n }, (_, i) => (
        <Star key={i} size={13} />
      ))}
    </span>
  );
}

const KID_QUESTS: { icon: QuestIconId; title: string; stars: number; done?: boolean }[] = [
  { icon: 'bed', title: 'Make your bed', stars: 1, done: true },
  { icon: 'dog', title: 'Walk the dog', stars: 3 },
  { icon: 'reading', title: 'Read for 20 minutes', stars: 2 },
];

function TabBar({ active, tabs }: { active: number; tabs: ((p: { size: number; active?: boolean }) => ReactNode)[] }) {
  return (
    <div className="mt-auto flex justify-around rounded-2xl border-2 border-ink bg-surface px-2 py-1.5">
      {tabs.map((Tab, i) => (
        <span key={i} className={cx('flex h-9 w-9 items-center justify-center rounded-xl', i === active && 'bg-brand-light')}>
          <Tab size={24} active={i === active} />
        </span>
      ))}
    </div>
  );
}

export function KidPhone({ className }: { className?: string }) {
  const level = 4;
  return (
    <PhoneFrame className={className} label="The Kid Kapital kid home screen: wallet, today's quests, piggy bank and rocket fund">
      <div className="flex items-center gap-2.5">
        <Avatar id="fox" size={46} ring />
        <div className="min-w-0 flex-1">
          <div className="font-display text-lg font-bold leading-tight text-ink">Hi, Maya!</div>
          <div className="text-xs font-bold text-ink-soft">{levelTitle(level)}</div>
        </div>
        <LevelShield level={level} size={40} />
      </div>

      <div className="mt-3 rounded-[22px] border-[2.5px] border-ink bg-coin-light p-3 shadow-chunky-sm">
        <div className="text-xs font-extrabold uppercase tracking-wide text-ink-soft">My wallet</div>
        <Money cents={1250} className="text-3xl text-ink" />
      </div>

      <div className="mb-1.5 mt-3 font-display text-sm font-bold text-ink">Today&apos;s quests</div>
      <ul className="flex flex-col gap-1.5">
        {KID_QUESTS.map((q) => (
          <li key={q.icon} className={cx('flex items-center gap-2 rounded-2xl border-2 border-ink bg-surface px-2 py-1.5', q.done && 'bg-good-light')}>
            <QuestIcon id={q.icon} size={34} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-extrabold leading-tight text-ink">{q.title}</div>
              <Stars n={q.stars} />
            </div>
            {q.done ? (
              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink bg-good">
                <IconCheck size={14} />
              </span>
            ) : (
              <Money cents={defaultRewardCents(q.stars, STAR_VALUE)} className="text-[13px] text-ink" />
            )}
          </li>
        ))}
      </ul>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-2xl border-2 border-ink bg-brand-light p-2">
          <PiggyBank size={38} />
          <div className="text-[11px] font-extrabold text-ink-soft">Piggy bank</div>
          <Money cents={820} coin={false} className="text-sm text-ink" />
        </div>
        <div className="rounded-2xl border-2 border-ink bg-good-light p-2">
          <Rocket size={38} />
          <div className="text-[11px] font-extrabold text-ink-soft">Rocket fund</div>
          <Money cents={412} coin={false} className="text-sm text-ink" />
        </div>
      </div>

      <TabBar active={0} tabs={[IconHome, IconQuests, IconShop, IconGrow, IconLearn]} />
    </PhoneFrame>
  );
}

const INBOX: { avatar: AvatarId; who: string; text: string; quest?: QuestIconId; reward?: RewardIconId; cta: string }[] = [
  { avatar: 'panda', who: 'Leo', text: 'finished Feed the fish', quest: 'fish', cta: 'Approve' },
  { avatar: 'fox', who: 'Maya', text: 'wants Movie night', reward: 'movie', cta: 'Hand over' },
  { avatar: 'panda', who: 'Leo', text: 'finished Tidy your toys', quest: 'toys', cta: 'Approve' },
  { avatar: 'fox', who: 'Maya', text: 'finished Walk the dog', quest: 'dog', cta: 'Approve' },
];

export function ParentPhone({ className }: { className?: string }) {
  return (
    <PhoneFrame className={className} label="The Kid Kapital grown-up inbox: approve finished quests and hand over rewards">
      <div className="flex items-center justify-between">
        <div className="font-display text-lg font-bold text-ink">Inbox</div>
        <span className="rounded-full border-2 border-ink bg-coin px-2 text-xs font-extrabold text-ink">{INBOX.length} new</span>
      </div>
      <ul className="mt-2 flex flex-col gap-1.5">
        {INBOX.map((row, i) => (
          <li key={i} className="rounded-2xl border-2 border-ink bg-surface p-2">
            <div className="flex items-center gap-2">
              <Avatar id={row.avatar} size={30} />
              <div className="min-w-0 flex-1 text-[12px] font-bold leading-tight text-ink-soft">
                <span className="font-extrabold text-ink">{row.who}</span> {row.text}
              </div>
              {row.quest ? <QuestIcon id={row.quest} size={30} /> : row.reward ? <RewardIcon id={row.reward} size={30} /> : null}
            </div>
            <div className="mt-1.5 flex justify-end">
              <span className="rounded-xl border-2 border-ink bg-good px-2.5 py-0.5 font-display text-xs font-semibold text-ink shadow-chunky-sm">{row.cta}</span>
            </div>
          </li>
        ))}
      </ul>
      <TabBar active={0} tabs={[IconInbox, IconQuests, IconShop, IconLearn]} />
    </PhoneFrame>
  );
}
