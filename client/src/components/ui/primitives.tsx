import React, { forwardRef, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import { formatCents, MAX_STARS, type Cents } from '@kk/shared';
import { Coin, Star } from '@/art';
import { cn } from '@/lib/cn';
import { play } from '@/lib/sound';

/* ---------- Button ---------- */

const BUTTON_VARIANTS = {
  primary: 'bg-brand text-white',
  coin: 'bg-coin text-ink',
  good: 'bg-good text-ink',
  danger: 'bg-bad text-white',
  secondary: 'bg-surface text-ink',
  ghost: 'bg-transparent text-ink-soft border-transparent shadow-none hover:bg-ink/5',
} as const;

const BUTTON_SIZES = {
  sm: 'h-9 px-3 text-sm gap-1.5 rounded-xl',
  md: 'h-12 px-5 text-base gap-2 rounded-2xl',
  lg: 'h-14 px-6 text-lg gap-2.5 rounded-2xl',
  icon: 'h-11 w-11 rounded-2xl',
  /** Grows with its text (quiz answers, long choices). */
  wrap: 'min-h-12 px-4 py-3 text-base gap-2 rounded-2xl text-left leading-snug',
} as const;

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: keyof typeof BUTTON_VARIANTS;
  size?: keyof typeof BUTTON_SIZES;
  block?: boolean;
  busy?: boolean;
  icon?: ReactNode;
  /** Plays the tap sound. On by default. */
  sound?: boolean;
}

/** The chunky 3D sticker button. Every clickable thing in the app is one of these. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', block, busy, icon, sound = true, className, children, disabled, onClick, type = 'button', ...rest },
  ref,
) {
  const flat = variant === 'ghost';
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || busy}
      onClick={(e) => {
        if (sound) play('tap');
        onClick?.(e);
      }}
      className={cn(
        'press inline-flex select-none items-center justify-center font-display font-semibold tracking-wide',
        !flat && 'border-[2.5px] border-ink shadow-chunky',
        'disabled:cursor-not-allowed disabled:opacity-50',
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        block && 'w-full',
        className,
      )}
      {...rest}
    >
      {busy ? <Spinner size={18} /> : icon}
      {children}
    </button>
  );
});

/* ---------- Card ---------- */

const CARD_TONES = {
  plain: 'bg-surface',
  soft: 'bg-surface-soft',
  brand: 'bg-brand-light',
  coin: 'bg-coin-light',
  good: 'bg-good-light',
  bad: 'bg-bad-light',
} as const;

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  tone?: keyof typeof CARD_TONES;
  pad?: 'none' | 'sm' | 'md' | 'lg';
  /** Thick sticker outline + hard shadow. Off for quieter nested cards. */
  sticker?: boolean;
}

const PADS = { none: '', sm: 'p-3', md: 'p-4', lg: 'p-6' } as const;

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { tone = 'plain', pad = 'md', sticker = true, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-blob',
        sticker ? 'border-[2.5px] border-ink shadow-chunky' : 'border-2 border-line',
        CARD_TONES[tone],
        PADS[pad],
        className,
      )}
      {...rest}
    />
  );
});

/* ---------- Type ---------- */

const HEADING_SIZES = { xl: 'text-4xl', lg: 'text-3xl', md: 'text-2xl', sm: 'text-xl', xs: 'text-lg' } as const;

export function Heading({
  level = 2,
  size = 'md',
  className,
  ...rest
}: ComponentPropsWithoutRef<'h2'> & { level?: 1 | 2 | 3 | 4; size?: keyof typeof HEADING_SIZES }) {
  const Tag = `h${level}` as ElementType;
  return <Tag className={cn('font-display font-bold leading-tight text-ink', HEADING_SIZES[size], className)} {...rest} />;
}

const TEXT_TONES = { ink: 'text-ink', soft: 'text-ink-soft', faint: 'text-ink-faint', brand: 'text-brand', good: 'text-good-deep', bad: 'text-bad-deep', inherit: '' } as const;
const TEXT_SIZES = { xs: 'text-xs', sm: 'text-sm', md: 'text-base', lg: 'text-lg' } as const;

export function Text({
  tone = 'soft',
  size = 'md',
  bold,
  as: Tag = 'p',
  className,
  ...rest
}: React.HTMLAttributes<HTMLElement> & {
  tone?: keyof typeof TEXT_TONES;
  size?: keyof typeof TEXT_SIZES;
  bold?: boolean;
  as?: 'p' | 'span' | 'div' | 'label';
  htmlFor?: string;
}) {
  const El = Tag as ElementType;
  return <El className={cn(TEXT_TONES[tone], TEXT_SIZES[size], bold ? 'font-extrabold' : 'font-semibold', className)} {...rest} />;
}

/* ---------- Pill ---------- */

const PILL_TONES = {
  brand: 'bg-brand-light text-brand-deep',
  coin: 'bg-coin-light text-ink',
  good: 'bg-good-light text-good-deep',
  bad: 'bg-bad-light text-bad-deep',
  plain: 'bg-surface-sunk text-ink-soft',
  ink: 'bg-ink text-white',
} as const;

export function Pill({ tone = 'plain', icon, className, children }: { tone?: keyof typeof PILL_TONES; icon?: ReactNode; className?: string; children: ReactNode }) {
  return (
    // A pill is one short label: it never wraps or squeezes (a squeezed pill split "+30 XP" onto two lines).
    <span className={cn('inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 font-display text-sm font-semibold', PILL_TONES[tone], className)}>
      {icon}
      {children}
    </span>
  );
}

/* ---------- Spinner ---------- */

export function Spinner({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <motion.span
      className={cn('inline-block', className)}
      animate={{ rotateY: 360 }}
      transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
      aria-label="Loading"
      role="status"
    >
      <Coin size={size} />
    </motion.span>
  );
}

/* ---------- ProgressBar ---------- */

const BAR_TONES = { brand: 'bg-brand', coin: 'bg-coin', good: 'bg-good', sky: 'bg-sky' } as const;

export function ProgressBar({ value, tone = 'brand', height = 'h-4', className }: { value: number; tone?: keyof typeof BAR_TONES; height?: string; className?: string }) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div className={cn('w-full overflow-hidden rounded-full border-2 border-ink bg-surface-sunk', height, className)} role="progressbar" aria-valuenow={Math.round(pct)}>
      <motion.div
        className={cn('relative h-full rounded-full', BAR_TONES[tone])}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      >
        <span className="absolute inset-x-1 top-[2px] h-[30%] rounded-full bg-white/40" />
      </motion.div>
    </div>
  );
}

/* ---------- Money ---------- */

const MONEY_SIZES = { sm: 'text-base', md: 'text-xl', lg: 'text-3xl', xl: 'text-5xl' } as const;
const COIN_SIZES = { sm: 18, md: 24, lg: 34, xl: 52 } as const;

/** Every amount on screen. Counts up and down when the value changes. */
export function Money({
  cents,
  size = 'md',
  coin = true,
  signed,
  className,
}: {
  cents: Cents;
  size?: keyof typeof MONEY_SIZES;
  coin?: boolean;
  /** Show +/- and color the amount. */
  signed?: boolean;
  className?: string;
}) {
  const value = useMotionValue(cents);
  const smooth = useSpring(value, { stiffness: 140, damping: 22 });
  const text = useTransform(smooth, (v) => (signed && v > 0 ? '+' : '') + formatCents(Math.round(v)));
  useEffect(() => {
    const c = animate(value, cents, { duration: 0.6 });
    return c.stop;
  }, [cents, value]);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-display font-bold tabular',
        MONEY_SIZES[size],
        signed && (cents >= 0 ? 'text-good-deep' : 'text-bad-deep'),
        className,
      )}
    >
      {coin && <Coin size={COIN_SIZES[size]} />}
      <motion.span>{text}</motion.span>
    </span>
  );
}

/* ---------- Stars ---------- */

export function Stars({ value, size = 18, max = MAX_STARS, className }: { value: number; size?: number; max?: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} aria-label={`${value} of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <Star key={i} size={size} filled={i < value} />
      ))}
    </span>
  );
}
