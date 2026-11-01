import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cx } from './button';
import { formatCents, type Cents } from '@kk/shared';
import { Coin, IconCheck } from '@art';

/**
 * The site's UI kit. Same look as the app's kit (client/src/components/ui/
 * primitives.tsx): the chunky ink outline, the hard drop shadow, Fredoka
 * headings. The app's components cannot be imported as-is (they play sounds
 * and resolve `@/lib` inside the client), so this kit copies their CLASSES,
 * which all resolve to the shared tokens in client/src/index.css.
 *
 * Every section composes from these; no hand-rolled buttons or cards.
 */

const CARD_TONES = {
  plain: 'bg-surface',
  soft: 'bg-surface-soft',
  brand: 'bg-brand-light',
  coin: 'bg-coin-light',
  good: 'bg-good-light',
  bad: 'bg-bad-light',
} as const;

export type CardTone = keyof typeof CARD_TONES;

export function Card({
  tone = 'plain',
  pad = 'md',
  sticker = true,
  className,
  ...rest
}: ComponentPropsWithoutRef<'div'> & { tone?: CardTone; pad?: 'none' | 'sm' | 'md' | 'lg'; sticker?: boolean }) {
  const pads = { none: '', sm: 'p-3', md: 'p-5', lg: 'p-6 sm:p-8' } as const;
  return (
    <div
      className={cx(
        'rounded-blob',
        sticker ? 'border-[2.5px] border-ink shadow-chunky' : 'border-2 border-line',
        CARD_TONES[tone],
        pads[pad],
        className,
      )}
      {...rest}
    />
  );
}

/** Eyebrow, title and subtitle for the top of a section. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'center' | 'left';
  className?: string;
}) {
  return (
    <div className={cx(align === 'center' ? 'mx-auto text-center' : 'text-left', 'max-w-3xl', className)}>
      {eyebrow && (
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-surface px-3 py-1 font-display text-sm font-semibold text-ink shadow-chunky-sm">
          {eyebrow}
        </span>
      )}
      <h2 className="text-balance font-display text-[2rem] font-bold leading-[1.1] text-ink sm:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-pretty text-lg leading-relaxed text-ink-soft sm:text-xl">{subtitle}</p>}
    </div>
  );
}

/** Every amount on the site goes through the app's formatter, as `<Money>` does in the app. */
export function Money({ cents, coin = true, className }: { cents: Cents; coin?: boolean; className?: string }) {
  return (
    <span className={cx('tabular inline-flex items-center gap-1 font-display font-bold', className)}>
      {coin && <Coin size="1.1em" />}
      {formatCents(cents)}
    </span>
  );
}

/** A ticked list item. */
export function Tick({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <li className={cx('flex items-start gap-2.5', className)}>
      <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full border-2 border-ink bg-good">
        <IconCheck size={14} />
      </span>
      <span>{children}</span>
    </li>
  );
}

/** Small rounded label. */
export function Chip({ children, tone = 'plain', className }: { children: ReactNode; tone?: CardTone; className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1 text-sm font-bold text-ink', CARD_TONES[tone], className)}>
      {children}
    </span>
  );
}

export { ButtonLink, SignupButton, cx } from './button';
