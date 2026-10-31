import type { ReactNode } from 'react';
import { PAID_PLANS, PLAN_LIMITS, PLAN_NAMES, PLANS, type Plan } from '@kk/shared';
import { Coin, Gem } from '@art';
import { APP_LINKS } from '@/lib/site';
import { Reveal } from './Reveal';
import { ButtonLink, Card, Chip, SectionHeading, Tick } from './ui';

/**
 * Both cards are generated from PLAN_LIMITS (shared/src/plans.ts), the same
 * table the server enforces, so the page cannot promise more than the app
 * allows. There is no price constant yet, so no price is shown.
 */
const count = (n: number | null, one: string, many: string) => (n === null ? `Unlimited ${many}` : n === 1 ? `1 ${one}` : `Up to ${n} ${many}`);

const rows = (plan: Plan): { label: ReactNode; on: boolean }[] => {
  const { limits, features } = PLAN_LIMITS[plan];
  return [
    { label: count(limits.kids, 'kid', 'kids'), on: true },
    { label: count(limits.teamGoals, 'team goal', 'team goals'), on: features.teamGoals },
    { label: 'Rocket fund', on: features.rocket },
    { label: 'Helper points', on: features.assists },
  ];
};

/** In every plan: the core loop. */
const CORE = ['Quests and the family shop', 'Piggy bank and savings goals', 'Daily chest, XP, levels and badges', 'Money school', 'Co-parent invites'];

const PLAN_ART: Record<Plan, ReactNode> = { free: <Coin size={56} />, plus: <Gem size={56} /> };
const PLAN_BLURB: Record<Plan, string> = {
  free: 'The whole core loop, free.',
  plus: 'Room for a bigger family, and the extras.',
};

/** Everything a family gets while there are no paid plans: the core loop plus every extra. */
const EVERYTHING = [...CORE, 'As many kids as you like', 'Team goals', 'The rocket fund', 'Helper points'];

/** While Kid Kapital is free for everyone (PAID_PLANS off): one card, nothing to compare. */
function FreeForEveryone() {
  return (
    <section id="plans" className="px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading
        eyebrow="Pricing"
        title="Free. All of it."
        subtitle="Kid Kapital is free for every family right now: every feature, every kid, no card and no ads. Kids never see a price."
      />
      <Reveal className="mx-auto mt-12 max-w-xl">
        <Card tone="brand" pad="lg" className="flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <Coin size={56} />
            <Chip tone="good">No card needed</Chip>
          </div>
          <h3 className="mt-4 font-display text-3xl font-bold text-ink">Free for every family</h3>
          <ul className="mt-6 grid gap-x-6 gap-y-3 font-bold text-ink sm:grid-cols-2">
            {EVERYTHING.map((c) => (
              <Tick key={c}>{c}</Tick>
            ))}
          </ul>
          <div className="pt-8">
            <ButtonLink href={APP_LINKS.signup} size="lg" block>
              Start your family free
            </ButtonLink>
          </div>
        </Card>
      </Reveal>
    </section>
  );
}

export function Plans() {
  if (!PAID_PLANS) return <FreeForEveryone />;
  return (
    <section id="plans" className="px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading
        eyebrow="Plans"
        title="Start free. Grow when you want to."
        subtitle="One plan covers the whole family, every grown-up and every kid. Kids never see a plan, a price or an upgrade button."
      />

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
        {PLANS.map((plan, i) => {
          const plus = plan === 'plus';
          return (
            <Reveal key={plan} delay={i * 0.08} className="h-full">
              <Card tone={plus ? 'brand' : 'plain'} pad="lg" className="relative flex h-full flex-col">
                <div className="flex items-start justify-between gap-3">
                  {PLAN_ART[plan]}
                  {plus ? <Chip tone="coin">Pricing coming soon</Chip> : <Chip tone="good">No card needed</Chip>}
                </div>
                <h3 className="mt-4 font-display text-3xl font-bold text-ink">{PLAN_NAMES[plan]}</h3>
                <p className="mt-1 text-ink-soft">{PLAN_BLURB[plan]}</p>

                <ul className="mt-6 flex flex-col gap-3 font-bold text-ink">
                  {rows(plan).map((r, j) =>
                    r.on ? (
                      <Tick key={j}>{r.label}</Tick>
                    ) : (
                      <li key={j} className="flex items-start gap-2.5 text-ink-faint">
                        <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full border-2 border-line bg-surface-sunk text-sm">
                          <span className="h-0.5 w-2.5 rounded bg-ink-faint" />
                        </span>
                        <span className="line-through decoration-2">{r.label}</span>
                      </li>
                    ),
                  )}
                </ul>

                <div className="mt-6 border-t-2 border-dashed border-line pt-5">
                  <div className="text-sm font-extrabold uppercase tracking-wide text-ink-soft">{plus ? `Everything in ${PLAN_NAMES.free}` : 'Always included'}</div>
                  {!plus && (
                    <ul className="mt-3 flex flex-col gap-2 text-ink-soft">
                      {CORE.map((c) => (
                        <Tick key={c}>{c}</Tick>
                      ))}
                    </ul>
                  )}
                  {plus && <p className="mt-3 text-ink-soft">Quests, the shop, the piggy bank, savings goals, Money school and the rest, for every kid in the family.</p>}
                </div>

                <div className="mt-auto pt-7">
                  <ButtonLink href={APP_LINKS.signup} variant={plus ? 'secondary' : 'primary'} size="lg" block>
                    {plus ? 'Start free, upgrade any time' : 'Start your family free'}
                  </ButtonLink>
                </div>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
