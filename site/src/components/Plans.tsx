import { Coin } from '@art';
import { APP_LINKS } from '@/lib/site';
import { Reveal } from './Reveal';
import { ButtonLink, Card, Chip, SectionHeading, Tick } from './ui';

/**
 * The price section: Kid Kapital is free and takes no payments (there is no billing code at
 * all), so there is one card and nothing to compare.
 */
const EVERYTHING = [
  'Quests and the family shop',
  'Piggy bank and savings goals',
  'Daily chest, XP, levels and badges',
  'Money school',
  'Co-parent invites',
  'As many kids as you like',
  'Team goals',
  'The rocket fund',
  'Helper points',
];

export function Plans() {
  return (
    <section id="plans" className="px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading
        eyebrow="Pricing"
        title="Free. All of it."
        subtitle="Kid Kapital is free for every family: every feature, every kid, no card and no ads. It doesn't ask for or accept payments, and kids never see a price."
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
