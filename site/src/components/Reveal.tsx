'use client';

import { MotionConfig, motion } from 'framer-motion';
import { useEffect, useState, type ReactNode } from 'react';

/**
 * Scroll reveal, ported from Mentis `useCardReveal`: a short fade-up on
 * desktop, where a whole row enters together, and NO animation on a phone,
 * where cards cross the viewport one at a time and a staggered pop-in reads as
 * glitching. Reduced motion is handled once, by MotionProvider below (reading
 * the preference in each component made the server and client renders differ).
 *
 * Starts as "desktop" on purpose: the server has no viewport, and a mobile
 * render that flips to static after mount stays visible.
 */
export function useReveal() {
  const [desktop, setDesktop] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)');
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return (delay = 0) =>
    desktop
      ? {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-60px' },
          transition: { type: 'spring' as const, stiffness: 260, damping: 24, delay },
        }
      : { initial: false as const, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0 } };
}

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reveal = useReveal();
  return (
    <motion.div {...reveal(delay)} className={className}>
      {children}
    </motion.div>
  );
}

/** Honors the visitor's reduced-motion setting for every animation on the site. Mounted once in the layout. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** A sticker that bobs gently in place. Still under reduced motion. */
export function Floating({
  children,
  delay = 0,
  distance = 10,
  rotate = 6,
  className,
}: {
  children: ReactNode;
  delay?: number;
  distance?: number;
  rotate?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      aria-hidden="true"
      animate={{ y: [0, -distance, 0], rotate: [0, rotate, 0] }}
      transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  );
}

/** Entrance on first paint (the hero), the same spring as the reveal. */
export function Enter({
  children,
  delay = 0,
  className,
  from = { opacity: 0, y: 18 },
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  from?: { opacity?: number; y?: number; scale?: number; rotate?: number };
}) {
  return (
    <motion.div
      className={className}
      initial={from}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22, delay }}
    >
      {children}
    </motion.div>
  );
}
