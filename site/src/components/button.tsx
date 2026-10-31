import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/**
 * The chunky sticker button as a link, with the app's exact classes
 * (client/src/components/ui/primitives.tsx Button). Kept apart from ui.tsx,
 * with no art or @kk/shared import, so the client nav can use it without
 * pulling the art library and the lesson content into the browser bundle.
 */
export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ');

const BUTTON_VARIANTS = {
  primary: 'bg-brand text-white',
  coin: 'bg-coin text-ink',
  good: 'bg-good text-ink',
  secondary: 'bg-surface text-ink',
  ghost: 'bg-transparent text-ink-soft border-transparent shadow-none hover:bg-ink/5',
} as const;

const BUTTON_SIZES = {
  sm: 'min-h-10 px-4 py-1.5 text-sm gap-1.5 rounded-xl',
  md: 'min-h-12 px-5 py-2 text-base gap-2 rounded-2xl',
  lg: 'min-h-14 px-7 py-2.5 text-lg gap-2.5 rounded-2xl',
} as const;

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  block,
  icon,
  className,
  children,
  ...rest
}: ComponentPropsWithoutRef<'a'> & {
  variant?: keyof typeof BUTTON_VARIANTS;
  size?: keyof typeof BUTTON_SIZES;
  block?: boolean;
  icon?: ReactNode;
}) {
  const flat = variant === 'ghost';
  return (
    <a
      className={cx(
        'press inline-flex select-none items-center justify-center text-center font-display font-semibold tracking-wide transition-[transform,box-shadow,background-color] hover:-translate-y-0.5',
        !flat && 'border-[2.5px] border-ink shadow-chunky',
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        // Never wider than its container: a long label wraps (balanced) instead of
        // pushing a card or column past a 320px phone. Short labels stay on one line.
        'max-w-full text-balance',
        block && 'w-full',
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </a>
  );
}

