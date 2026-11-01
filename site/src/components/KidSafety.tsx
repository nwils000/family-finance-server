import type { ReactNode } from 'react';
import { PIN_LENGTH } from '@kk/shared';
import { Heart, IconEyeOff, IconLock, Penny, Wallet } from '@art';
import { Reveal } from './Reveal';
import { Card, SectionHeading, type CardTone } from './ui';

/**
 * Promises we can keep, stated plainly. No certifications or compliance
 * claims: only what the product and this site actually do.
 */
const PROMISES: { art: ReactNode; title: string; body: string; tone: CardTone }[] = [
  {
    art: <Heart size={56} />,
    title: 'No ads, ever',
    body: 'Kids never see an ad. Not a banner, not a sponsored quest, not a "special offer".',
    tone: 'bad',
  },
  {
    art: <IconLock size={52} />,
    title: 'Nothing to buy',
    body: "Kid Kapital doesn't ask for or accept payments, so kids never see a price, an upgrade screen or a store.",
    tone: 'brand',
  },
  {
    art: <Penny size={60} mood="wow" />,
    title: 'No email for kids',
    body: `Kids sign in with your family code, their avatar and a ${PIN_LENGTH}-digit PIN. Wrong guesses lock sign-in for a while.`,
    tone: 'coin',
  },
  {
    art: <Wallet size={56} />,
    title: 'No bank or card',
    body: 'Kid Kapital tracks pretend coins. It never connects to a bank account or card, and never holds, moves or pays out money.',
    tone: 'good',
  },
  {
    art: <IconEyeOff size={52} />,
    title: 'No trackers here',
    body: 'This website loads no analytics, no tracking cookies and no fonts or scripts from anyone else.',
    tone: 'plain',
  },
];

export function KidSafety() {
  return (
    <section id="safety" className="border-y-[2.5px] border-ink bg-good-light px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading
        eyebrow="Made for kids"
        title="A safe little world for their first money"
        subtitle="Kid Kapital is built for kids from the first screen. Grown-ups hold every key."
      />
      <ul className="mx-auto mt-12 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {PROMISES.map((p, i) => (
          <li key={p.title}>
            <Reveal delay={i * 0.04} className="h-full">
              <Card tone={p.tone} className="flex h-full flex-col">
                <div className="flex h-16 items-end">{p.art}</div>
                <h3 className="mt-3 font-display text-lg font-bold text-ink">{p.title}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{p.body}</p>
              </Card>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
