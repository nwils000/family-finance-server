import type { ReactNode } from 'react';
import { PIN_LENGTH, QUEST_ICONS } from '@kk/shared';
import { Avatar, ChestClosed, CoinStack, GoalJar, PiggyBank, QuestIcon, RewardIcon, Rocket, SceneFamily, Star } from '@art';
import { Reveal } from './Reveal';
import { Card, SectionHeading, cx, type CardTone } from './ui';

type Step = { art: ReactNode; title: string; body: string };

const GROWN_UPS: Step[] = [
  {
    art: <SceneFamily size={104} />,
    title: 'Start your family',
    body: 'Sign up, add each kid with their own avatar and PIN, and invite a co-parent with a private link.',
  },
  {
    art: (
      <span className="flex -space-x-3">
        <QuestIcon id="dishes" size={64} />
        <RewardIcon id="icecream" size={64} />
      </span>
    ),
    title: 'Set quests and rewards',
    body: `Pick from ${QUEST_ICONS.length} quest stickers, give each one 1 to 5 stars, and choose the days it repeats. Stock the shop with rewards you are happy to hand over.`,
  },
  {
    art: (
      <span className="flex items-end gap-1">
        <Star size={40} />
        <Star size={52} />
        <Star size={40} />
      </span>
    ),
    title: 'Approve and cheer',
    body: 'One tap approves a finished quest and the coins land in their wallet. Trust a kid with a quest and it pays the moment they finish.',
  },
];

const KIDS: Step[] = [
  {
    art: (
      <span className="flex items-center gap-2">
        <Avatar id="unicorn" size={60} ring />
        <span className="flex gap-1">
          {Array.from({ length: PIN_LENGTH }, (_, i) => (
            <span key={i} className="h-4 w-4 rounded-full border-2 border-ink bg-brand" />
          ))}
        </span>
      </span>
    ),
    title: 'Sign in their way',
    body: `No email needed. Kids type the family code, tap their own avatar and enter a ${PIN_LENGTH}-digit PIN.`,
  },
  {
    art: (
      <span className="flex items-end gap-1">
        <CoinStack size={64} />
        <ChestClosed size={66} />
      </span>
    ),
    title: 'Do quests, earn coins',
    body: "Every finished quest earns coins and XP. Finish all of today's quests and the daily chest opens.",
  },
  {
    art: (
      <span className="flex items-end -space-x-2">
        <PiggyBank size={60} />
        <Rocket size={60} />
        <GoalJar size={56} fill={0.6} />
      </span>
    ),
    title: 'Spend, save or launch',
    body: 'Buy something from the family shop, save in the piggy bank, fill a dream goal jar, or try the rocket fund.',
  },
];

function Track({ who, tone, steps, accent }: { who: string; tone: CardTone; steps: Step[]; accent: string }) {
  return (
    <Card tone={tone} pad="lg" className="h-full">
      <h3 className="font-display text-2xl font-bold text-ink sm:text-3xl">{who}</h3>
      <ol className="mt-6 flex flex-col gap-6">
        {steps.map((s, i) => (
          <li key={s.title} className="flex gap-4">
            <span className={cx('flex h-10 w-10 flex-none items-center justify-center rounded-full border-[2.5px] border-ink font-display text-lg font-bold shadow-chunky-sm', accent)}>
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex h-[84px] items-end">{s.art}</div>
              <div className="font-display text-xl font-bold text-ink">{s.title}</div>
              <p className="mt-1 leading-relaxed text-ink-soft">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}

export function HowItWorks() {
  return (
    <section id="how" className="relative px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading
        eyebrow="How it works"
        title="Grown-ups set it up. Kids take it from there."
        subtitle="A few minutes of setup, then a daily loop kids drive themselves: do the quest, earn the coins, choose what to do with them."
      />
      <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-2 lg:gap-8">
        <Reveal>
          <Track who="For grown-ups" tone="brand" steps={GROWN_UPS} accent="bg-brand text-white" />
        </Reveal>
        <Reveal delay={0.08}>
          <Track who="For kids" tone="coin" steps={KIDS} accent="bg-coin text-ink" />
        </Reveal>
      </div>
    </section>
  );
}
