// The one place celebrations are composed: confetti + sound + haptics, scaled
// to how big the moment is. Components call celebrate('done'), never the pieces.
import confetti from 'canvas-confetti';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { play } from './sound';

// Read the palette from the token block so confetti follows the theme.
const tokenColor = (name: string) => {
  const rgb = getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim().split(/\s+/);
  return `rgb(${rgb.join(',')})`;
};
const palette = () => ['brand', 'coin', 'good', 'sky', 'pink', 'grape'].map(tokenColor);

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const burst = (opts: confetti.Options) => {
  if (reduced()) return;
  void confetti({ colors: palette(), disableForReducedMotion: true, ...opts });
};

const haptic = {
  light: () => Haptics.impact({ style: ImpactStyle.Light }).catch(() => undefined),
  heavy: () => Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => undefined),
  success: () => Haptics.notification({ type: NotificationType.Success }).catch(() => undefined),
  error: () => Haptics.notification({ type: NotificationType.Error }).catch(() => undefined),
};

export type Moment = 'tap' | 'done' | 'coins' | 'buy' | 'levelUp' | 'chest' | 'oops' | 'save';

const MOMENTS: Record<Moment, (origin?: { x: number; y: number }) => void> = {
  tap: () => {
    play('tap');
    void haptic.light();
  },
  done: (origin) => {
    play('done');
    void haptic.success();
    burst({ particleCount: 40, spread: 70, startVelocity: 28, origin, scalar: 0.8 });
  },
  coins: (origin) => {
    play('coins');
    void haptic.success();
    burst({ particleCount: 50, spread: 90, origin, shapes: ['circle'], colors: [tokenColor('coin'), tokenColor('coin-deep')] });
  },
  buy: (origin) => {
    play('buy');
    void haptic.success();
    burst({ particleCount: 60, spread: 100, origin });
  },
  save: (origin) => {
    play('coin');
    void haptic.light();
    burst({ particleCount: 24, spread: 50, startVelocity: 20, origin, shapes: ['circle'], colors: [tokenColor('coin')] });
  },
  levelUp: () => {
    play('levelUp');
    void haptic.heavy();
    const end = Date.now() + 900;
    const frame = () => {
      burst({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0, y: 0.7 } });
      burst({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1, y: 0.7 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  },
  chest: () => {
    play('chest');
    void haptic.heavy();
    burst({ particleCount: 140, spread: 160, startVelocity: 42, origin: { x: 0.5, y: 0.5 }, scalar: 1.1 });
  },
  oops: () => {
    play('nope');
    void haptic.error();
  },
};

/** Fire a moment, optionally from an element (confetti starts there). */
export const celebrate = (moment: Moment, from?: Element | null) => {
  let origin: { x: number; y: number } | undefined;
  if (from) {
    const r = from.getBoundingClientRect();
    origin = { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight };
  }
  MOMENTS[moment](origin);
};
