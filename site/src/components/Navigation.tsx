'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import { APP_LINKS, SECTIONS } from '@/lib/site';
import { ButtonLink, SignupButton } from './button';

/**
 * Fixed top bar, after Mentis Navigation: translucent while the page scrolls
 * behind it, opaque when the drawer is open (a drawer is a surface people read).
 * Section links are absolute (`/#how`) so they also work from /privacy or a 404.
 *
 * The art arrives as props from the server (see SiteNav): importing `@art` into a
 * client component would pull @kk/shared, and with it the whole lesson library,
 * into the browser bundle.
 */
export function Navigation({ logo, closeIcon }: { logo: ReactNode; closeIcon: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-200 ${
        open ? 'border-b-2 border-ink bg-bg' : scrolled ? 'border-b-2 border-line bg-bg/90 backdrop-blur-md' : 'border-b-2 border-transparent'
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[72px] sm:px-6">
        <Link href="/" aria-label="Kid Kapital home" className="flex-none" onClick={() => setOpen(false)}>
          {logo}
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`/#${s.id}`} className="rounded-xl px-3 py-2 font-display font-semibold text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink">
              {s.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <ButtonLink href={APP_LINKS.login} variant="ghost" size="sm">
            Sign in
          </ButtonLink>
          <SignupButton variant="primary" size="sm">
            Start free
          </SignupButton>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="press flex h-11 w-11 items-center justify-center rounded-2xl border-[2.5px] border-ink bg-surface shadow-chunky-sm lg:hidden"
        >
          {open ? (
            closeIcon
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="rgb(var(--ink))" strokeWidth="2.8" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="h-[calc(100dvh-64px)] overflow-y-auto border-t-2 border-line bg-bg px-4 pb-8 pt-4 lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`/#${s.id}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-3 py-3 font-display text-xl font-semibold text-ink hover:bg-ink/5"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-3">
              <SignupButton variant="primary" size="lg" block>
                Start your family free
              </SignupButton>
              <ButtonLink href={APP_LINKS.login} variant="secondary" size="lg" block>
                Grown-up sign in
              </ButtonLink>
              <ButtonLink href={APP_LINKS.kidLogin} variant="coin" size="lg" block>
                Kid sign in
              </ButtonLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
