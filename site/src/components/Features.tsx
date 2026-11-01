import type { ReactNode } from 'react';
import { BADGE_RULES, EFFORT_BOOST, HATS } from '@kk/shared';
import { BADGES, ChestOpen, GoalJar, Hat, Heart, LevelShield, PiggyBank, QuestIcon, RewardIcon, Rocket, Trophy, XpStar } from '@art';
import { Reveal } from './Reveal';
import { Card, SectionHeading, type CardTone } from './ui';

type Feature = { art: ReactNode; title: string; body: string; tone: CardTone; wide?: boolean };


const FEATURES: Feature[] = [
  {
    art: (
      <span className="flex -space-x-2">
        <QuestIcon id="dishes" size={60} />
        <QuestIcon id="dog" size={60} />
        <QuestIcon id="homework" size={60} />
      </span>
    ),
    title: 'Quests',
    body: 'Family jobs as bright quest cards with 1 to 5 stars. Daily, on chosen weekdays, or just once. The reward is stars times your family star value.',
    tone: 'plain',
  },
  {
    art: (
      <span className="flex -space-x-2">
        <RewardIcon id="icecream" size={60} />
        <RewardIcon id="movie" size={60} />
        <RewardIcon id="park" size={60} />
      </span>
    ),
    title: 'The family shop',
    body: 'Rewards you choose and price. Kids buy with their coins, a grown-up hands it over in real life. Decline and the coins go straight back.',
    tone: 'plain',
  },
  {
    art: <PiggyBank size={84} />,
    title: 'Piggy bank',
    body: 'Steady weekly interest at the rate you set. Kids see waiting pay off, one small bonus at a time.',
    tone: 'brand',
  },
  {
    art: <Rocket size={84} />,
    title: 'Rocket fund',
    body: 'Zooms up or dips down each week inside the range you set. A safe first taste of investing risk.',
    tone: 'good',
  },
  {
    art: <GoalJar size={80} fill={0.65} />,
    title: 'Dream goal jar',
    body: 'Pick a big thing, watch the jar fill. Saving feels real when you can see how close you are.',
    tone: 'coin',
  },
  {
    art: <Trophy size={80} />,
    title: 'Team goals',
    body: `Siblings earn a shared prize together. An effort boost (up to ${EFFORT_BOOST.max}x) lets a younger kid count fully, because team progress measures effort, not coins.`,
    tone: 'plain',
  },
  {
    art: <Heart size={76} />,
    title: 'Helper points',
    body: 'Help a brother or sister with their quest and earn helper points and a little XP. The doer keeps every coin.',
    tone: 'bad',
  },
  {
    art: (
      <span className="flex items-end gap-1">
        <LevelShield level={6} size={66} />
        <Hat id="crown" size={60} />
        <XpStar size={44} />
      </span>
    ),
    title: 'XP, levels and hats',
    body: `Every quest earns XP. Level up for bonus coins and level prizes, and unlock ${HATS.length - 1} hats along the way.`,
    tone: 'plain',
  },
  {
    art: <ChestOpen size={84} />,
    title: 'Daily chest',
    body: "Finish all of today's quests and the chest pops open with bonus XP. A small reason to finish the list.",
    tone: 'coin',
  },
];

export function Features() {
  return (
    <section id="features" className="relative border-y-[2.5px] border-ink bg-surface-soft px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading
        eyebrow="Everything in the box"
        title="Earning, spending and saving, all in one playful place"
        subtitle="Every piece is a real money idea dressed up as a game, and every piece can be switched off if your family does not want it."
      />

      <div className="mx-auto mt-12 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={(i % 3) * 0.05}>
            <Card tone={f.tone} className="flex h-full flex-col">
              <div className="flex h-[88px] items-end justify-between gap-2">
                {f.art}
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-ink">{f.title}</h3>
              <p className="mt-1.5 leading-relaxed text-ink-soft">{f.body}</p>
            </Card>
          </Reveal>
        ))}
      </div>

      {/* Badges strip: the real badge art and names. */}
      <div className="mx-auto mt-10 max-w-6xl">
        <Card pad="lg" className="flex flex-col items-center gap-6 lg:flex-row">
          <div className="lg:w-64 lg:flex-none">
            <h3 className="font-display text-2xl font-bold text-ink">Badges to collect</h3>
            <p className="mt-1 text-ink-soft">Little wins, noticed: a first quest, a {BADGE_RULES.streakDays}-day streak, a first save.</p>
          </div>
          <ul className="grid w-full grid-cols-3 gap-4 sm:grid-cols-6">
            {BADGES.map(({ id, name, Art }) => (
              <li key={id} className="flex flex-col items-center text-center">
                <Art size={64} />
                <span className="mt-1 text-sm font-extrabold leading-tight text-ink">{name}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
