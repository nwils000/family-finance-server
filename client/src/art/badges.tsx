import { useId, type ReactElement, type ReactNode } from 'react';
import { BADGE_RULES } from '@kk/shared';
import type { ArtProps } from './types';
import { sparklePath, starPath } from './decor';
import { CoinFace } from './money';

const INK = '#1F2547';

function scallopPath(cx: number, cy: number, r: number, n = 14): string {
  const pt = (a: number, rr: number) => `${(cx + rr * Math.cos(a)).toFixed(2)} ${(cy + rr * Math.sin(a)).toFixed(2)}`;
  const step = (Math.PI * 2) / n;
  let d = `M${pt(-Math.PI / 2, r)}`;
  for (let i = 0; i < n; i++) {
    const a0 = -Math.PI / 2 + i * step;
    d += ` Q${pt(a0 + step / 2, r * 1.16)} ${pt(a0 + step, r)}`;
  }
  return `${d} Z`;
}

const MEDAL = scallopPath(50, 42, 33);

type MedalColors = { main: string; shade: string; ribbon: string; ribbonShade: string; inner?: string };

function Medal({ size, className, rest, colors, children }: { size: number | string; className?: string; rest: Omit<ArtProps, 'size' | 'className'>; colors: MedalColors; children: ReactNode }) {
  const clip = `kk-medal-${useId().replace(/:/g, '')}`;
  const { main, shade, ribbon, ribbonShade, inner = '#FFF8EC' } = colors;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true" {...rest}>
      <defs>
        <clipPath id={clip}>
          <path d={MEDAL} />
        </clipPath>
      </defs>
      {/* ribbon tails */}
      <path d="M36 58 L24 95 L33 89 L40 97 L52 64 Z" fill={ribbon} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <path d="M64 58 L76 95 L67 89 L60 97 L48 64 Z" fill={ribbonShade} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <path d="M36 70 L42 72" stroke="#fff" strokeOpacity={0.4} strokeWidth={3} strokeLinecap="round" />
      {/* medal */}
      <g clipPath={`url(#${clip})`}>
        <rect x={0} y={0} width={100} height={100} fill={shade} />
        <path d={MEDAL} transform="translate(-2 -3)" fill={main} />
      </g>
      <path d={MEDAL} fill="none" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <circle cx={50} cy={42} r={24} fill={inner} stroke={INK} strokeWidth={2.6} />
      <path d="M31 33 A21 21 0 0 1 44 21.5" fill="none" stroke="#fff" strokeOpacity={0.6} strokeWidth={3} strokeLinecap="round" />
      {children}
    </svg>
  );
}

export function BadgeFirstQuest({ size = 64, className, ...rest }: ArtProps) {
  return (
    <Medal size={size} className={className} rest={rest} colors={{ main: '#2ED3A0', shade: '#1DB98A', ribbon: '#5B5BF7', ribbonShade: '#4747D9' }}>
      <path d="M33 60 Q50 48 67 60 Z" fill="#2ED3A0" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M44 55 V25" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      <g className="kk-wave">
        <path d="M45 26 C51 22 55 30 63 26 V40 C55 44 51 36 45 40 Z" fill="#FF6B6B" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      </g>
      <circle cx={44} cy={24} r={2.6} fill="#FFC83D" stroke={INK} strokeWidth={1.6} />
      <path className="kk-twinkle" d={sparklePath(64, 50, 4)} fill="#FFC83D" stroke={INK} strokeWidth={1.4} />
    </Medal>
  );
}

export function BadgeStreak({ size = 64, className, ...rest }: ArtProps) {
  return (
    <Medal size={size} className={className} rest={rest} colors={{ main: '#FF9F43', shade: '#F07A1A', ribbon: '#FF6B6B', ribbonShade: '#E84B5A' }}>
      <g className="kk-flicker">
      <path
        d="M50 61 C41 61 35 55 36 47 C37 40 43 37 44 29 C49 33 50 38 50 41 C53 37 55 31 54 23 C62 30 66 39 65 48 C64 56 58 61 50 61 Z"
        fill="#FF9F43"
        stroke={INK}
        strokeWidth={2.6}
        strokeLinejoin="round"
      />
      <g>
        <path d="M50 58 C45 58 42 54 43 50 C44 46 47 44 48 40 C52 44 53 46 54 44 C57 47 58 50 57 53 C56 56 53 58 50 58 Z" fill="#FFC83D" />
      </g>
      <g className="kk-blink">
        <circle cx={47} cy={51} r={1.4} fill={INK} />
        <circle cx={53} cy={51} r={1.4} fill={INK} />
      </g>
      <path d="M48 54 Q50 56 52 54" fill="none" stroke={INK} strokeWidth={1.5} strokeLinecap="round" />
      </g>
    </Medal>
  );
}

export function BadgeSaver({ size = 64, className, ...rest }: ArtProps) {
  return (
    <Medal size={size} className={className} rest={rest} colors={{ main: '#4CC9F0', shade: '#1FA2D2', ribbon: '#FFC83D', ribbonShade: '#F59E0B' }}>
      <ellipse cx={50} cy={60} rx={14} ry={2.5} fill={INK} opacity={0.12} />
      <CoinFace cx={50} cy={43} r={15} />
      <path className="kk-twinkle" d={sparklePath(66, 28, 4.5)} fill="#FFE68A" stroke={INK} strokeWidth={1.4} />
    </Medal>
  );
}

export function BadgeShopper({ size = 64, className, ...rest }: ArtProps) {
  return (
    <Medal size={size} className={className} rest={rest} colors={{ main: '#FF8FC7', shade: '#EE68AC', ribbon: '#9B5DE5', ribbonShade: '#7A3BCB' }}>
      <path d="M44 36 V32 C44 25 56 25 56 32 V36" fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
      <path d="M36 35 H64 L61 59 H39 Z" fill="#FF6B6B" stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
      <path d="M58 37 L56 57" stroke="#E84B5A" strokeWidth={3} strokeLinecap="round" />
      <path d={starPath(49, 47, 7, 3.3)} fill="#FFC83D" stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      <rect x={39} y={37} width={3} height={8} rx={1.5} fill="#fff" opacity={0.5} />
    </Medal>
  );
}

export function BadgeHelper({ size = 64, className, ...rest }: ArtProps) {
  return (
    <Medal size={size} className={className} rest={rest} colors={{ main: '#9B5DE5', shade: '#7A3BCB', ribbon: '#FF8FC7', ribbonShade: '#EE68AC' }}>
      <path
        d="M50 60 C42 54 34 49 34 40 C34 34 39 30 44 30 C47 30 49 32 50 34 C51 32 53 30 56 30 C61 30 66 34 66 40 C66 49 58 54 50 60 Z"
        fill="#FF6B6B"
        stroke={INK}
        strokeWidth={2.6}
        strokeLinejoin="round"
      />
      <ellipse cx={41} cy={37} rx={3.6} ry={2.2} transform="rotate(-35 41 37)" fill="#fff" opacity={0.6} />
      <g className="kk-blink">
        <circle cx={45.5} cy={43} r={1.6} fill={INK} />
        <circle cx={54.5} cy={43} r={1.6} fill={INK} />
      </g>
      <path d="M47 47 Q50 50 53 47" fill="none" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
      <path className="kk-twinkle" d={sparklePath(33, 54, 3.5)} fill="#FFC83D" stroke={INK} strokeWidth={1.2} />
      <path className="kk-twinkle kk-delay-2" d={sparklePath(67, 28, 3.5)} fill="#FFC83D" stroke={INK} strokeWidth={1.2} />
    </Medal>
  );
}

export function BadgeRocketeer({ size = 64, className, ...rest }: ArtProps) {
  return (
    <Medal size={size} className={className} rest={rest} colors={{ main: '#5B5BF7', shade: '#4747D9', ribbon: '#4CC9F0', ribbonShade: '#1FA2D2', inner: '#2B2F6B' }}>
      <g fill="#FFE68A">
        <circle cx={36} cy={34} r={1.3} />
        <circle cx={62} cy={54} r={1.1} />
        <circle cx={40} cy={56} r={1} />
        <path className="kk-twinkle" d={sparklePath(64, 30, 3.2)} />
      </g>
      <g transform="rotate(35 50 42)">
        <g className="kk-wiggle">
          <path d="M45 55 C45 60 48 63 50 67 C52 63 55 60 55 55 Z" fill="#FF9F43" />
          <path d="M47.5 55 C47.5 58 49 60 50 62 C51 60 52.5 58 52.5 55 Z" fill="#FFC83D" />
        </g>
        <path d="M43 44 C38 46 36 50 37 56 L44 52 Z M57 44 C62 46 64 50 63 56 L56 52 Z" fill="#FF6B6B" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        <path d="M50 22 C57 28 59 40 57 55 H43 C41 40 43 28 50 22 Z" fill="#fff" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
        <path d="M45.2 30 Q50 33 54.8 30 C53.5 27 52 24.5 50 22.8 C48 24.5 46.5 27 45.2 30 Z" fill="#FF6B6B" />
        <circle cx={50} cy={40} r={4.5} fill="#4CC9F0" stroke={INK} strokeWidth={2} />
        <circle cx={48.6} cy={38.6} r={1.3} fill="#fff" />
      </g>
    </Medal>
  );
}

export type BadgeId = 'first-quest' | 'streak' | 'saver' | 'shopper' | 'helper' | 'rocketeer';

export type BadgeInfo = {
  id: BadgeId;
  name: string;
  blurb: string;
  Art: (props: ArtProps) => ReactElement;
};

export const BADGES: BadgeInfo[] = [
  { id: 'first-quest', name: 'First Quest!', blurb: 'Got your very first quest approved', Art: BadgeFirstQuest },
  { id: 'streak', name: 'On Fire!', blurb: `Finished quests ${BADGE_RULES.streakDays} days in a row`, Art: BadgeStreak },
  { id: 'saver', name: 'Super Saver', blurb: 'Put coins in the piggy bank', Art: BadgeSaver },
  { id: 'shopper', name: 'Smart Shopper', blurb: 'Bought a reward from the family shop', Art: BadgeShopper },
  { id: 'helper', name: 'Helping Hero', blurb: `Got ${BADGE_RULES.helperQuests} quests approved`, Art: BadgeHelper },
  { id: 'rocketeer', name: 'Rocketeer', blurb: 'Put coins in the rocket fund', Art: BadgeRocketeer },
];
