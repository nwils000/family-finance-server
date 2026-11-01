import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { APP_LINKS, NEW_FAMILIES_OPEN, PRIVATE_PREVIEW_MESSAGE } from '@/lib/site';

/**
 * The chunky sticker button as a link, with the app's exact classes
 * (client/src/components/ui/primitives.tsx Button). Kept apart from ui.tsx,
 * with no art or @kk/shared index import, so the client nav can use it without
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

const buttonClass = ({ variant = 'primary', size = 'md', block, className }: ButtonLook & { className?: string }) =>
  cx(
    'press inline-flex select-none items-center justify-center text-center font-display font-semibold tracking-wide transition-[transform,box-shadow,background-color] hover:-translate-y-0.5',
    variant !== 'ghost' && 'border-[2.5px] border-ink shadow-chunky',
    BUTTON_VARIANTS[variant],
    BUTTON_SIZES[size],
    // Never wider than its container: a long label wraps (balanced) instead of
    // pushing a card or column past a 320px phone. Short labels stay on one line.
    'max-w-full text-balance',
    block && 'w-full',
    className,
  );

type ButtonLook = { variant?: keyof typeof BUTTON_VARIANTS; size?: keyof typeof BUTTON_SIZES; block?: boolean };

export function ButtonLink({ variant, size, block, icon, className, children, ...rest }: ComponentPropsWithoutRef<'a'> & ButtonLook & { icon?: ReactNode }) {
  return (
    <a className={buttonClass({ variant, size, block, className })} {...rest}>
      {icon}
      {children}
    </a>
  );
}

/**
 * Every "start a family" call to action on the site, and the only thing that links to signup.
 * While new families are not open (private preview: no parental consent step yet) it is a
 * plain "Coming soon" label with no link; guards.test.ts keeps signup and join links out of
 * every other file.
 */
export function SignupButton({ variant, size, block, className, children }: ButtonLook & { className?: string; children: ReactNode }) {
  if (!NEW_FAMILIES_OPEN) {
    return (
      <span aria-disabled="true" title={PRIVATE_PREVIEW_MESSAGE} className={cx(buttonClass({ variant: 'secondary', size, block, className }), 'cursor-default hover:translate-y-0')}>
        Coming soon
      </span>
    );
  }
  return (
    <ButtonLink href={APP_LINKS.signup} variant={variant} size={size} block={block} className={className}>
      {children}
    </ButtonLink>
  );
}
