// Motion presets. Reuse these instead of inventing new springs per component.
import type { Transition, Variants } from 'framer-motion';

export const spring: Transition = { type: 'spring', stiffness: 420, damping: 24 };
export const bouncy: Transition = { type: 'spring', stiffness: 520, damping: 14 };
export const gentle: Transition = { type: 'spring', stiffness: 200, damping: 22 };

/** Parent of a list: children pop in one after another. */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};

/** Child of a stagger list. */
export const popIn: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: spring },
};

/**
 * Pages and lesson steps animate IN only. An exit animation under AnimatePresence
 * wait mode got stuck when a second tap landed mid-exit (fast tab taps left a blank
 * page), so the keyed element just remounts and fades in. Pinned by guards.test.ts.
 */
export const pageIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: gentle },
};

export const tapScale = { whileTap: { scale: 0.94 }, transition: spring };
