// Lesson illustrations: one small scene per money idea, shown on the lesson pages.
// Every scene sits on a 200x140 rounded tile; `size` sets the width (height is 0.7x).
import { useId, type ReactElement, type ReactNode } from 'react';
import type { LessonArtId } from '@kk/shared';
import type { ArtProps } from './types';
import { MORE_LESSON_ART_A } from './lesson-art-2';
import { MORE_LESSON_ART_B } from './lesson-art-3';
import {
  BROWN, CORAL, CREAM, GOLD, GRAPE, Hi, INDIGO, INK, InkText, MINT, NIGHT, ORANGE, PINK, SHADE, SKY, STEEL,
  Shadow, Twinkle, ink, thin, heartPath } from './sticker-kit';
import { CoinFace, PiggyBank, Rocket } from './money';
import { Penny } from './mascot';
import { Heart, Sun } from './decor';

const SKIN = '#FFD3B0';
const LEAF = '#1FB386';

type FrameProps = {
  size: number | string;
  className?: string;
  rest: Omit<ArtProps, 'size' | 'className'>;
  tint: string;
  children: ReactNode;
};

const useUid = () => useId().replace(/:/g, '');

/** The rounded, tinted tile every lesson scene is drawn on. */
function Frame({ size, className, rest, tint, children }: FrameProps) {
  const clip = `kk-lesson-${useUid()}`;
  return (
    <svg viewBox="0 0 200 140" width={size} height={typeof size === 'number' ? size * 0.7 : undefined} className={className} aria-hidden="true" {...rest}>
      <defs>
        <clipPath id={clip}>
          <rect x={3} y={3} width={194} height={134} rx={26} />
        </clipPath>
      </defs>
      <rect x={3} y={3} width={194} height={134} rx={26} fill={tint} />
      <g clipPath={`url(#${clip})`}>{children}</g>
      <rect x={3} y={3} width={194} height={134} rx={26} fill="none" stroke={INK} strokeOpacity={0.08} strokeWidth={2} />
    </svg>
  );
}

/** Soft colored ground under a scene. */
function Ground({ cy = 122, rx = 82, color = MINT }: { cy?: number; rx?: number; color?: string }) {
  return <ellipse cx={100} cy={cy} rx={rx} ry={8} fill={color} opacity={0.3} />;
}

/** A sleeve-colored arm ending in a round hand, in scene coordinates. */
function Arm({ x1, y1, x2, y2, color, s = 1 }: { x1: number; y1: number; x2: number; y2: number; color: string; s?: number }) {
  return (
    <g>
      <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={INK} strokeWidth={8 * s} strokeLinecap="round" />
      <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={color} strokeWidth={4.4 * s} strokeLinecap="round" />
      <circle cx={x2} cy={y2} r={3.8 * s} fill={SKIN} stroke={INK} strokeWidth={2.2 * s} />
    </g>
  );
}

/**
 * A chibi kid standing with feet at (x, y), about 62 units tall at s = 1.
 * With `arms` off the scene draws its own arms (shoulders at y - 31s, x +/- 10s).
 */
function Kid({
  x, y, s = 1, shirt = INDIGO, hair = BROWN, pants = NIGHT, arms = true, mood = 'happy',
}: { x: number; y: number; s?: number; shirt?: string; hair?: string; pants?: string; arms?: boolean; mood?: 'happy' | 'think' | 'wow' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Shadow cx={0} cy={0} rx={14} />
      <rect x={-8} y={-17} width={7} height={15} rx={3} fill={pants} {...thin} />
      <rect x={1} y={-17} width={7} height={15} rx={3} fill={pants} {...thin} />
      <ellipse cx={-5} cy={-2} rx={5} ry={3} fill={CORAL} {...thin} />
      <ellipse cx={5} cy={-2} rx={5} ry={3} fill={CORAL} {...thin} />
      {arms && (
        <g>
          <path d="M-10 -30 L-14 -18 M10 -30 L14 -18" stroke={INK} strokeWidth={8} strokeLinecap="round" />
          <path d="M-10 -30 L-14 -18 M10 -30 L14 -18" stroke={shirt} strokeWidth={4.4} strokeLinecap="round" />
          <circle cx={-14} cy={-17} r={3.8} fill={SKIN} stroke={INK} strokeWidth={2.2} />
          <circle cx={14} cy={-17} r={3.8} fill={SKIN} stroke={INK} strokeWidth={2.2} />
        </g>
      )}
      <rect x={-11} y={-36} width={22} height={22} rx={9} fill={shirt} {...ink} />
      <Hi cx={-5} cy={-30} rx={3.5} ry={2} rot={-30} />
      <circle cx={0} cy={-48} r={13} fill={SKIN} {...ink} />
      <path d="M-13.5 -48 C-14 -64 14 -64 13.5 -48 C9 -55 -2 -57 -13.5 -48 Z" fill={hair} {...thin} />
      {mood === 'think' ? (
        <g>
          <ellipse cx={-4} cy={-47} rx={1.8} ry={2.4} fill={INK} />
          <ellipse cx={5} cy={-47} rx={1.8} ry={2.4} fill={INK} />
          <path d="M-2.5 -41 H2.5" stroke={INK} strokeWidth={2} strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <ellipse cx={-4.5} cy={-47} rx={1.9} ry={2.5} fill={INK} />
          <ellipse cx={4.5} cy={-47} rx={1.9} ry={2.5} fill={INK} />
          <circle cx={-5.1} cy={-48} r={0.8} fill="#fff" />
          <circle cx={3.9} cy={-48} r={0.8} fill="#fff" />
          {mood === 'wow' ? (
            <ellipse cx={0} cy={-41} rx={2.2} ry={2.6} fill={INK} />
          ) : (
            <path d="M-3.2 -42 Q0 -38.8 3.2 -42" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
          )}
        </g>
      )}
      <ellipse cx={-8.5} cy={-43} rx={2.6} ry={1.6} fill={PINK} opacity={0.65} />
      <ellipse cx={8.5} cy={-43} rx={2.6} ry={1.6} fill={PINK} opacity={0.65} />
    </g>
  );
}

/** Coin seen from the side, top face at (cx, y), for stacks. */
function StackCoin({ cx, y, rx = 16, ry = 5, h = 6 }: { cx: number; y: number; rx?: number; ry?: number; h?: number }) {
  return (
    <g>
      <path d={`M${cx - rx} ${y} v${h} a${rx} ${ry} 0 0 0 ${rx * 2} 0 v${-h} Z`} fill={SHADE} {...ink} strokeWidth={2.5} />
      <ellipse cx={cx} cy={y} rx={rx} ry={ry} fill={GOLD} {...ink} strokeWidth={2.5} />
      <ellipse cx={cx} cy={y} rx={rx * 0.62} ry={ry * 0.55} fill="none" stroke={SHADE} strokeWidth={1.5} />
      <ellipse cx={cx - rx * 0.5} cy={y - ry * 0.25} rx={3.5} ry={1.3} fill="#fff" opacity={0.6} />
    </g>
  );
}

function CoinStackOf({ cx, base, n }: { cx: number; base: number; n: number }) {
  return (
    <g>
      <Shadow cx={cx} cy={base + 9} rx={20} />
      {Array.from({ length: n }, (_, i) => (
        <StackCoin key={i} cx={cx + (i % 2 ? 1.5 : -1)} y={base - i * 7} />
      ))}
    </g>
  );
}

/** Heart outline centered on (cx, cy), about 2s wide. */

/** Little speed / pop marks around a point. */
function PopLines({ cx, cy, r, angles }: { cx: number; cy: number; r: number; angles: number[] }) {
  return (
    <g stroke={INK} strokeWidth={2.5} strokeLinecap="round">
      {angles.map((a) => {
        const t = (a * Math.PI) / 180;
        const c = Math.cos(t);
        const sn = Math.sin(t);
        return <path key={a} d={`M${(cx + c * r).toFixed(1)} ${(cy + sn * r).toFixed(1)} L${(cx + c * (r + 6)).toFixed(1)} ${(cy + sn * (r + 6)).toFixed(1)}`} />;
      })}
    </g>
  );
}

/** Glass jar with coins at the bottom and an optional label plate. */
function Jar({
  cx, top, w, h, coins, lid, label, labelColor,
}: { cx: number; top: number; w: number; h: number; coins: number; lid: string; label?: string; labelColor?: string }) {
  const x = cx - w / 2;
  const bottom = top + h;
  const body = `M${x + 4} ${top + 6} H${x + w - 4} Q${x + w} ${top + 10} ${x + w} ${top + 18} V${bottom - 8} Q${x + w} ${bottom} ${x + w - 8} ${bottom} H${x + 8} Q${x} ${bottom} ${x} ${bottom - 8} V${top + 18} Q${x} ${top + 10} ${x + 4} ${top + 6} Z`;
  const perRow = Math.max(1, Math.floor((w - 8) / 12));
  return (
    <g>
      <Shadow cx={cx} cy={bottom + 2} rx={w / 2 + 2} />
      <path d={body} fill="#F2FBFF" />
      {Array.from({ length: coins }, (_, i) => {
        const row = Math.floor(i / perRow);
        const col = i % perRow;
        const inRow = Math.min(perRow, coins - row * perRow);
        const ccx = cx + (col - (inRow - 1) / 2) * 12 + (row % 2 ? 2 : 0);
        return <CoinFace key={i} cx={ccx} cy={bottom - 8 - row * 10} r={6} />;
      })}
      <path d={body} fill={SKY} fillOpacity={0.12} {...ink} />
      <path d={`M${x + 6} ${top + 20} V${bottom - 14}`} stroke="#fff" strokeOpacity={0.8} strokeWidth={3} strokeLinecap="round" />
      <rect x={x + 1} y={top - 2} width={w - 2} height={9} rx={3.5} fill={lid} {...ink} />
      <Hi cx={x + 10} cy={top + 1} rx={5} ry={1.4} />
      {label && (
        <g>
          <rect x={x + 3} y={top + 16} width={w - 6} height={15} rx={5} fill="#fff" {...thin} strokeWidth={2} />
          <InkText cx={cx} cy={top + 23.5} fontSize={10} fill={labelColor ?? INK} strokeWidth={2.2} letterSpacing={0.3}>
            {label}
          </InkText>
        </g>
      )}
    </g>
  );
}

/** Dashed guide path with an arrow head at its end, pointing along `angle` degrees. */
function DashArrow({ d, ex, ey, angle, color = INK }: { d: string; ex: number; ey: number; angle: number; color?: string }) {
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth={2.5} strokeDasharray="4 5" strokeLinecap="round" opacity={0.55} />
      <path
        d={`M${ex - 6} ${ey - 5} L${ex} ${ey} L${ex - 6} ${ey + 5}`}
        transform={`rotate(${angle} ${ex} ${ey})`}
        fill="none"
        stroke={color}
        strokeWidth={2.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.7}
      />
    </g>
  );
}

/* ------------------------------------------------------------------ scenes */

export function LessonArtEarn({ size = 200, className, ...rest }: ArtProps) {
  // broom handle runs from (64, 58) to (124, 112)
  const at = (t: number) => [64 + 60 * t, 58 + 54 * t] as const;
  const [h1x, h1y] = at(0.33);
  const [h2x, h2y] = at(0.55);
  return (
    <Frame size={size} className={className} rest={rest} tint="#DDF6EA">
      <Ground cy={122} />
      {/* leaf pile */}
      {[
        [138, 118, -20, ORANGE], [150, 116, 25, CORAL], [144, 112, 5, GOLD], [158, 119, -10, ORANGE], [132, 121, 30, GOLD],
      ].map(([x, y, r, c], i) => (
        <ellipse key={i} cx={x as number} cy={y as number} rx={7} ry={3.6} transform={`rotate(${r} ${x} ${y})`} fill={c as string} {...thin} strokeWidth={2} />
      ))}
      <Kid x={76} y={124} s={1.15} shirt={CORAL} hair={NIGHT} arms={false} />
      {/* broom */}
      <path d="M64 58 L122 110" stroke={INK} strokeWidth={7} strokeLinecap="round" />
      <path d="M64 58 L122 110" stroke={BROWN} strokeWidth={3.6} strokeLinecap="round" />
      <path d="M112 118 L118 104 L132 111 L134 124 Z" fill={GOLD} {...ink} />
      <path d="M118 120 L123 109 M124 121 L127 111 M129 122 L130 113" stroke={SHADE} strokeWidth={1.8} strokeLinecap="round" />
      <rect x={115} y={102} width={14} height={6} rx={2.5} transform="rotate(28 122 105)" fill={CORAL} {...thin} />
      <circle cx={108} cy={124} r={3} fill="#fff" opacity={0.8} />
      <circle cx={102} cy={121} r={2} fill="#fff" opacity={0.7} />
      {/* arms on top of the handle */}
      <Arm x1={68} y1={88} x2={h1x} y2={h1y} color={CORAL} s={1.1} />
      <Arm x1={86} y1={88} x2={h2x} y2={h2y} color={CORAL} s={1.1} />
      {/* reward coin pops out */}
      <path d="M144 106 Q136 80 148 62" fill="none" stroke={INK} strokeWidth={2.5} strokeDasharray="3 5" strokeLinecap="round" opacity={0.45} />
      <PopLines cx={154} cy={42} r={20} angles={[-150, -110, -70, -30, 10]} />
      <CoinFace cx={154} cy={42} r={16} />
      <InkText cx={182} cy={66} fontSize={16} fill={MINT} strokeWidth={3.2}>
        +1
      </InkText>
      <Twinkle cx={124} cy={30} r={6} />
      <Twinkle cx={182} cy={22} r={5} fill="#fff" />
    </Frame>
  );
}

export function LessonArtNeedsWants({ size = 200, className, ...rest }: ArtProps) {
  return (
    <Frame size={size} className={className} rest={rest} tint="#E6E6FF">
      <Ground cy={124} rx={60} color={INDIGO} />
      {/* stand */}
      <rect x={97} y={42} width={6} height={74} rx={2} fill={BROWN} {...ink} />
      <path d="M76 125 L124 125 L114 113 L86 113 Z" fill={BROWN} {...ink} />
      {/* beam, tipped toward the needs */}
      <g transform="rotate(-7 100 44)">
        <rect x={38} y={40} width={124} height={8} rx={4} fill={STEEL} {...ink} />
        <Hi cx={60} cy={42.5} rx={10} ry={1.4} />
      </g>
      <circle cx={100} cy={44} r={6} fill={GOLD} {...ink} />
      {/* strings: left end (40, 51), right end (160, 37) */}
      <path d="M40 51 L23 88 M40 51 L57 88 M160 37 L143 74 M160 37 L177 74" stroke={INK} strokeWidth={2} />
      {/* needs: apple + little house */}
      <circle cx={31} cy={80} r={8} fill={CORAL} {...thin} />
      <Hi cx={28} cy={77} rx={2.5} ry={1.6} rot={-30} />
      <path d="M31 72 q1 -4 4 -5" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <ellipse cx={35.5} cy={70} rx={3.5} ry={2} transform="rotate(-25 35.5 70)" fill={MINT} stroke={INK} strokeWidth={1.6} />
      <rect x={42} y={73} width={14} height={15} rx={1.5} fill={CREAM} {...thin} />
      <path d="M39.5 75 L49 66 L58.5 75 Z" fill={INDIGO} {...thin} />
      <rect x={47} y={80} width={4.5} height={8} rx={1} fill={BROWN} stroke={INK} strokeWidth={1.6} />
      {/* wants: game controller */}
      <path d="M146 64 C146 56 152 54 160 56 C168 54 174 56 174 64 C175 70 172 75 168 72 C165 69 155 69 152 72 C148 75 145 70 146 64 Z" fill={GRAPE} {...thin} />
      <path d="M151 60 v6 M148 63 h6" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" />
      <circle cx={166} cy={60} r={1.9} fill={GOLD} stroke={INK} strokeWidth={1.2} />
      <circle cx={170} cy={63.5} r={1.9} fill={CORAL} stroke={INK} strokeWidth={1.2} />
      <Hi cx={154} cy={57.5} rx={3} ry={1.2} />
      {/* pans */}
      <path d="M20 88 H60 Q58 102 40 102 Q22 102 20 88 Z" fill={GOLD} {...ink} />
      <path d="M140 74 H180 Q178 88 160 88 Q142 88 140 74 Z" fill={GOLD} {...ink} />
      <Hi cx={30} cy={93} rx={4} ry={1.5} />
      <Hi cx={150} cy={79} rx={4} ry={1.5} />
      <InkText cx={40} cy={115} fontSize={12} fill={MINT} strokeWidth={2.8} letterSpacing={0.5}>
        NEEDS
      </InkText>
      <InkText cx={160} cy={101} fontSize={12} fill={PINK} strokeWidth={2.8} letterSpacing={0.5}>
        WANTS
      </InkText>
      <Twinkle cx={184} cy={50} r={5} />
      <Twinkle cx={135} cy={52} r={3.5} fill="#fff" />
    </Frame>
  );
}

export function LessonArtSave({ size = 200, className, ...rest }: ArtProps) {
  return (
    <Frame size={size} className={className} rest={rest} tint="#FFE6F2">
      <Ground cy={124} rx={70} color={PINK} />
      <PiggyBank x={12} y={38} width={92} height={92} />
      {/* an extra coin on its way in */}
      <CoinFace cx={56} cy={22} r={8} />
      <path d="M48 10 v-3 M56 8 v-3 M64 10 v-3" stroke={INK} strokeWidth={2.2} strokeLinecap="round" opacity={0.5} />
      {/* thought bubble with the goal */}
      <circle cx={104} cy={66} r={3} fill="#fff" {...thin} strokeWidth={2} />
      <circle cx={113} cy={55} r={4.5} fill="#fff" {...thin} strokeWidth={2} />
      <path
        d="M122 46 C114 42 116 28 128 28 C130 18 146 14 154 22 C162 14 180 18 180 30 C192 32 192 50 182 54 C182 64 168 68 160 62 C152 70 134 68 132 60 C122 62 116 52 122 46 Z"
        fill="#fff"
        {...ink}
      />
      {/* bike */}
      <g>
        <circle cx={139} cy={50} r={9} fill="none" stroke={INK} strokeWidth={3} />
        <circle cx={168} cy={50} r={9} fill="none" stroke={INK} strokeWidth={3} />
        <circle cx={139} cy={50} r={1.8} fill={INK} />
        <circle cx={168} cy={50} r={1.8} fill={INK} />
        <path d="M139 50 L150 50 L162 36 M150 50 L146 36 L162 36 L168 50" fill="none" stroke={INK} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />
        <path d="M139 50 L150 50 L162 36 M150 50 L146 36 L162 36 L168 50" fill="none" stroke={CORAL} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />
        <rect x={140} y={31} width={11} height={4.5} rx={2.2} fill={NIGHT} />
        <path d="M162 36 L160 30 L166 28" fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Twinkle cx={186} cy={18} r={6} />
      <Twinkle cx={124} cy={22} r={4} fill="#fff" />
      <Twinkle cx={180} cy={70} r={3.5} fill={SKY} />
    </Frame>
  );
}

export function LessonArtInterest({ size = 200, className, ...rest }: ArtProps) {
  return (
    <Frame size={size} className={className} rest={rest} tint="#FFF3C4">
      <rect x={20} y={113} width={160} height={6} rx={3} fill={SHADE} opacity={0.25} />
      <CoinStackOf cx={52} base={104} n={2} />
      <CoinStackOf cx={100} base={104} n={4} />
      <CoinStackOf cx={148} base={104} n={6} />
      {/* sprout on the tallest stack */}
      <path d="M149 69 C149 62 150 56 149 50" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <path d="M149 69 C149 62 150 56 149 50" fill="none" stroke={LEAF} strokeWidth={2.4} strokeLinecap="round" />
      <path d="M149 56 C142 58 136 54 135 47 C142 45 148 49 149 56 Z" fill={MINT} {...thin} />
      <path d="M149 51 C155 52 161 48 162 41 C155 40 150 44 149 51 Z" fill={MINT} {...thin} />
      {['WEEK 1', 'WEEK 2', 'WEEK 3'].map((t, i) => (
        <InkText key={t} cx={52 + i * 48} cy={127} fontSize={9} fill="#fff" strokeWidth={2.4} letterSpacing={0.4}>
          {t}
        </InkText>
      ))}
      <DashArrow d="M44 72 Q72 46 108 52" ex={110} ey={52} angle={8} color={INDIGO} />
      {/* +2% tag */}
      <g transform="rotate(-8 44 30)">
        <path d="M22 20 H62 Q66 20 66 24 V36 Q66 40 62 40 H22 L14 30 Z" fill={MINT} {...ink} />
        <circle cx={21} cy={30} r={2.2} fill="#fff" stroke={INK} strokeWidth={1.6} />
        <InkText cx={44} cy={30} fontSize={14} fill="#fff" strokeWidth={3}>
          +2%
        </InkText>
      </g>
      <Twinkle cx={176} cy={46} r={6} />
      <Twinkle cx={124} cy={26} r={4} fill="#fff" />
    </Frame>
  );
}

export function LessonArtRisk({ size = 200, className, ...rest }: ArtProps) {
  const pts: [number, number][] = [[26, 106], [46, 84], [64, 98], [88, 70], [108, 86], [130, 58], [146, 66], [160, 46]];
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  return (
    <Frame size={size} className={className} rest={rest} tint="#DCF3FD">
      {[42, 70, 98].map((y) => (
        <path key={y} d={`M24 ${y} H180`} stroke={INDIGO} strokeOpacity={0.15} strokeWidth={2} strokeDasharray="5 5" />
      ))}
      <path d={`${line} V116 H26 Z`} fill={SKY} opacity={0.3} />
      <path d="M22 18 V116 H182" fill="none" {...ink} strokeOpacity={0.5} />
      <path d={line} fill="none" stroke={INK} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />
      <path d={line} fill="none" stroke={INDIGO} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
      {pts.slice(1, -1).map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r={3.2} fill="#fff" stroke={INK} strokeWidth={2} />
      ))}
      {/* a little parachute keeps a coin safe through the dip */}
      <path d="M48 46 Q64 22 80 46 Z" fill={CORAL} {...ink} />
      <path d="M58 46 Q60 32 64 28 Q68 32 70 46" fill="#fff" opacity={0.9} />
      <path d="M48 46 Q64 22 80 46 Q76 42 72 46 Q68 42 64 46 Q60 42 56 46 Q52 42 48 46 Z" fill="none" {...thin} />
      <path d="M49 46 L62 64 M64 46 L64 62 M79 46 L66 64" stroke={INK} strokeWidth={1.6} />
      <CoinFace cx={64} cy={68} r={7} />
      <Hi cx={56} cy={36} rx={3.5} ry={1.6} rot={-35} />
      <Rocket x={142} y={6} width={50} height={50} />
      <Twinkle cx={110} cy={28} r={4} fill="#fff" />
    </Frame>
  );
}

export function LessonArtGive({ size = 200, className, ...rest }: ArtProps) {
  return (
    <Frame size={size} className={className} rest={rest} tint="#FFE4E4">
      <Jar cx={100} top={74} w={60} h={52} coins={4} lid={CORAL} />
      <rect x={91} y={74} width={18} height={4} rx={2} fill={INK} />
      <Heart x={88} y={88} width={24} height={24} />
      {/* hands come in from both sides */}
      <g>
        <rect x={-4} y={44} width={48} height={16} rx={7} fill={INDIGO} {...ink} />
        <rect x={38} y={42} width={9} height={20} rx={4} fill="#fff" {...thin} />
        <ellipse cx={60} cy={53} rx={14} ry={8.5} transform="rotate(-12 60 53)" fill={SKIN} {...ink} />
        <rect x={156} y={44} width={48} height={16} rx={7} fill={MINT} {...ink} />
        <rect x={153} y={42} width={9} height={20} rx={4} fill="#fff" {...thin} />
        <ellipse cx={140} cy={53} rx={14} ry={8.5} transform="rotate(12 140 53)" fill={SKIN} {...ink} />
      </g>
      {/* the heart coin */}
      <path d={heartPath(100, 46, 17)} fill={SHADE} {...ink} />
      <path d={heartPath(99, 44.5, 14.5)} fill={GOLD} />
      <path d={heartPath(99, 45, 9.5)} fill="none" stroke={SHADE} strokeWidth={1.8} />
      <Hi cx={90} cy={38} rx={4} ry={2} rot={-40} />
      {/* thumbs over the heart */}
      <ellipse cx={72} cy={44} rx={4.5} ry={6} transform="rotate(30 72 44)" fill={SKIN} {...thin} />
      <ellipse cx={128} cy={44} rx={4.5} ry={6} transform="rotate(-30 128 44)" fill={SKIN} {...thin} />
      <path d="M100 66 v3" stroke={INK} strokeWidth={2.5} strokeLinecap="round" opacity={0.5} />
      <path d={heartPath(36, 92, 7)} fill={PINK} {...thin} strokeWidth={2} />
      <path d={heartPath(164, 90, 8)} fill={CORAL} {...thin} strokeWidth={2} />
      <path d={heartPath(150, 116, 5)} fill={PINK} {...thin} strokeWidth={1.8} />
      <Twinkle cx={100} cy={16} r={6} />
      <Twinkle cx={50} cy={116} r={4} fill="#fff" />
    </Frame>
  );
}

export function LessonArtBudget({ size = 200, className, ...rest }: ArtProps) {
  return (
    <Frame size={size} className={className} rest={rest} tint="#EFE4FF">
      <DashArrow d="M86 28 Q56 30 46 48" ex={46} ey={50} angle={110} color={GRAPE} />
      <DashArrow d="M100 38 V48" ex={100} ey={50} angle={90} color={GRAPE} />
      <DashArrow d="M114 28 Q144 30 154 48" ex={154} ey={50} angle={70} color={GRAPE} />
      <CoinFace cx={100} cy={24} r={12} />
      <Twinkle cx={122} cy={12} r={4} fill="#fff" />
      <Jar cx={44} top={60} w={50} h={62} coins={3} lid={CORAL} label="SPEND" labelColor={CORAL} />
      <Jar cx={100} top={60} w={50} h={62} coins={5} lid={MINT} label="SAVE" labelColor={MINT} />
      <Jar cx={156} top={60} w={50} h={62} coins={2} lid={PINK} label="GIVE" labelColor={PINK} />
      <Twinkle cx={180} cy={32} r={5} />
    </Frame>
  );
}

export function LessonArtChoice({ size = 200, className, ...rest }: ArtProps) {
  const road = 'M100 140 V106 Q100 92 74 78 L42 62 M100 106 Q100 92 126 78 L158 62';
  return (
    <Frame size={size} className={className} rest={rest} tint="#E9F7D4">
      <path d={road} fill="none" stroke={INK} strokeWidth={25} strokeLinejoin="round" strokeLinecap="round" />
      <path d={road} fill="none" stroke={CREAM} strokeWidth={19} strokeLinejoin="round" strokeLinecap="round" />
      <path d={road} fill="none" stroke={GOLD} strokeWidth={2.5} strokeDasharray="5 7" strokeLinecap="round" />
      {/* ice cream on the left path */}
      <g>
        <Shadow cx={38} cy={66} rx={10} />
        <path d="M29 42 L47 42 L38 64 Z" fill={GOLD} {...ink} />
        <path d="M33 47 L42 56 M43 47 L36 56" stroke={SHADE} strokeWidth={1.6} />
        <circle cx={38} cy={36} r={9.5} fill={PINK} {...ink} />
        <circle cx={38} cy={24} r={7.5} fill={MINT} {...ink} />
        <circle cx={40} cy={15} r={3.2} fill={CORAL} {...thin} strokeWidth={2} />
        <Hi cx={34} cy={33} rx={3} ry={1.6} rot={-30} />
      </g>
      {/* teddy bear on the right path */}
      <g>
        <Shadow cx={162} cy={66} rx={12} />
        <circle cx={154} cy={20} r={4.5} fill={BROWN} {...thin} />
        <circle cx={170} cy={20} r={4.5} fill={BROWN} {...thin} />
        <ellipse cx={162} cy={52} rx={11} ry={12} fill={BROWN} {...ink} />
        <ellipse cx={162} cy={54} rx={6} ry={6.5} fill={CREAM} />
        <circle cx={162} cy={30} r={10.5} fill={BROWN} {...ink} />
        <ellipse cx={162} cy={34} rx={4.5} ry={3.4} fill={CREAM} />
        <ellipse cx={162} cy={32.6} rx={1.6} ry={1.1} fill={INK} />
        <circle cx={158} cy={28} r={1.5} fill={INK} />
        <circle cx={166} cy={28} r={1.5} fill={INK} />
        <Hi cx={157} cy={24} rx={3} ry={1.5} rot={-30} />
      </g>
      <InkText cx={100} cy={52} fontSize={15} fill={GOLD} strokeWidth={3.2}>
        OR
      </InkText>
      <Kid x={100} y={134} s={0.92} shirt={SKY} hair={ORANGE} arms={false} mood="think" />
      <Arm x1={91} y1={106} x2={84} y2={117} color={SKY} s={0.92} />
      <Arm x1={109} y1={106} x2={118} y2={98} color={SKY} s={0.92} />
      <CoinFace cx={122} cy={92} r={6.5} />
      <InkText cx={74} cy={94} fontSize={16} fill="#fff" strokeWidth={3.2}>
        ?
      </InkText>
    </Frame>
  );
}

export function LessonArtSupplyDemand({ size = 200, className, ...rest }: ArtProps) {
  return (
    <Frame size={size} className={className} rest={rest} tint="#FFEBD6">
      <Ground cy={124} color={ORANGE} />
      {/* stand */}
      <rect x={18} y={36} width={6} height={56} rx={2} fill={BROWN} {...thin} />
      <rect x={90} y={36} width={6} height={56} rx={2} fill={BROWN} {...thin} />
      <path d="M12 26 H102 V40 H12 Z" fill="#fff" {...ink} />
      {[12, 30, 48, 66, 84].map((x) => (
        <rect key={x} x={x + 1.5} y={27.5} width={15} height={11} fill={GOLD} />
      ))}
      <path d="M12 26 H102 V40 H12 Z" fill="none" {...ink} />
      <path d="M12 40 q4.5 7 9 0 q4.5 7 9 0 q4.5 7 9 0 q4.5 7 9 0 q4.5 7 9 0 q4.5 7 9 0 q4.5 7 9 0 q4.5 7 9 0 q4.5 7 9 0 q4.5 7 9 0" fill={GOLD} {...thin} />
      <rect x={10} y={84} width={94} height={36} rx={5} fill={SKY} {...ink} />
      <Hi cx={22} cy={90} rx={6} ry={1.6} />
      <ellipse cx={57} cy={102} rx={10} ry={8} fill={GOLD} {...thin} />
      <path d="M57 96 V108 M51 102 H63 M53 98 L61 106 M61 98 L53 106" stroke={SHADE} strokeWidth={1.4} />
      {/* pitcher + cup */}
      <path d="M26 62 H44 L42 84 H28 Z" fill={GOLD} {...thin} />
      <path d="M26 62 H44 L43.5 68 H26.5 Z" fill="#fff" opacity={0.8} />
      <path d="M44 66 q8 2 0 12" fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
      <path d="M26 62 H44 L42 84 H28 Z" fill="none" {...thin} />
      <circle cx={33} cy={74} r={3} fill="#FFF3B0" stroke={SHADE} strokeWidth={1.3} />
      <path d="M47 74 H57 L55 84 H49 Z" fill={GOLD} {...thin} strokeWidth={2} />
      <path d="M53 74 L55 66" stroke={CORAL} strokeWidth={2} strokeLinecap="round" />
      {/* price tag hanging from the awning */}
      <path d="M76 46 V53" stroke={INK} strokeWidth={2} />
      <g transform="rotate(6 76 53)">
        <path d="M63 59 L76 51 L89 59 V80 H63 Z" fill={CREAM} {...thin} />
        <circle cx={76} cy={57.5} r={1.8} fill="#fff" stroke={INK} strokeWidth={1.3} />
        <CoinFace cx={70} cy={70} r={5} />
        <InkText cx={82} cy={70} fontSize={13} fill={GOLD} strokeWidth={2.6}>
          2
        </InkText>
      </g>
      {/* the line of customers */}
      <Kid x={126} y={122} s={0.8} shirt={GRAPE} hair={NIGHT} arms={false} mood="wow" />
      <Arm x1={118} y1={98} x2={110} y2={88} color={GRAPE} s={0.8} />
      <Arm x1={134} y1={98} x2={137} y2={108} color={GRAPE} s={0.8} />
      <CoinFace cx={108} cy={84} r={5} />
      <Kid x={152} y={122} s={0.76} shirt={MINT} hair={ORANGE} />
      <Kid x={176} y={122} s={0.72} shirt={CORAL} hair={BROWN} />
      <Twinkle cx={180} cy={26} r={5} />
      <Twinkle cx={120} cy={22} r={3.5} fill="#fff" />
    </Frame>
  );
}

export function LessonArtInflation({ size = 200, className, ...rest }: ArtProps) {
  const steps = [
    { x: 70, s: 0.8, n: '1' },
    { x: 116, s: 1, n: '2' },
    { x: 164, s: 1.25, n: '3' },
  ];
  return (
    <Frame size={size} className={className} rest={rest} tint="#E9F1FF">
      {/* calendar */}
      <g>
        <rect x={16} y={16} width={34} height={32} rx={5} fill="#fff" {...ink} />
        <path d="M16 26 V21 Q16 16 21 16 H45 Q50 16 50 21 V26 Z" fill={CORAL} {...ink} />
        <path d="M24 12 V19 M42 12 V19" stroke={INK} strokeWidth={3} strokeLinecap="round" />
        {[0, 1, 2].map((r) =>
          [0, 1, 2, 3].map((c) => (
            <rect key={`${r}${c}`} x={21 + c * 6.5} y={30 + r * 5.5} width={4} height={3.2} rx={1} fill={r === 2 && c === 3 ? CORAL : STEEL} />
          )),
        )}
      </g>
      <DashArrow d="M24 60 Q26 92 42 100" ex={44} ey={101} angle={20} color={INDIGO} />
      {steps.map(({ x, s, n }, i) => {
        const w = 28 * s;
        const h = 18 * s;
        const ty = 104;
        return (
          <g key={n}>
            {/* the same balloon every time */}
            <path d={`M${x} 52 q-4 10 2 18 q5 8 -2 ${ty - h / 2 - 72}`} fill="none" stroke={INK} strokeWidth={1.6} />
            <ellipse cx={x} cy={36} rx={12} ry={15} fill={i === 0 ? CORAL : i === 1 ? SKY : GRAPE} {...ink} />
            <path d={`M${x - 3} 54 L${x} 50 L${x + 3} 54 Z`} fill={INK} />
            <Hi cx={x - 5} cy={30} rx={3} ry={5} rot={20} />
            {/* the tag grows */}
            <path
              d={`M${x - w / 2 + 6} ${ty - h / 2} H${x + w / 2 - 3} Q${x + w / 2} ${ty - h / 2} ${x + w / 2} ${ty - h / 2 + 3} V${ty + h / 2 - 3} Q${x + w / 2} ${ty + h / 2} ${x + w / 2 - 3} ${ty + h / 2} H${x - w / 2 + 6} L${x - w / 2} ${ty} Z`}
              fill={GOLD}
              {...thin}
            />
            <circle cx={x - w / 2 + 6} cy={ty} r={1.6 * s} fill="#fff" stroke={INK} strokeWidth={1.3} />
            <InkText cx={x + 2.5 * s} cy={ty} fontSize={13 * s} fill="#fff" strokeWidth={2.8}>
              {n}
            </InkText>
            {i < 2 && (
              <path
                d={`M${x + 21 + i * 2} ${ty - 5} L${x + 26 + i * 2} ${ty} L${x + 21 + i * 2} ${ty + 5}`}
                fill="none"
                stroke={INDIGO}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </g>
        );
      })}
      <Shadow cx={116} cy={124} rx={64} />
      <Twinkle cx={186} cy={18} r={5} />
    </Frame>
  );
}

export function LessonArtBank({ size = 200, className, ...rest }: ArtProps) {
  return (
    <Frame size={size} className={className} rest={rest} tint="#E8ECF6">
      <Ground cy={124} rx={78} color={INDIGO} />
      {/* steps */}
      <rect x={52} y={114} width={124} height={9} rx={3} fill={STEEL} {...ink} />
      <rect x={58} y={107} width={112} height={8} rx={3} fill="#fff" {...ink} />
      {/* body + columns */}
      <rect x={62} y={56} width={104} height={52} fill={CREAM} {...ink} />
      {[70, 86, 142, 158].map((x) => (
        <g key={x}>
          <rect x={x - 5} y={58} width={10} height={48} rx={2} fill="#fff" {...thin} />
          <path d={`M${x - 1.5} 62 V102`} stroke={STEEL} strokeWidth={2} />
        </g>
      ))}
      {/* vault door */}
      <circle cx={114} cy={84} r={19} fill={STEEL} {...ink} />
      <circle cx={114} cy={84} r={13} fill="#fff" {...thin} />
      <g stroke={INK} strokeWidth={2.6} strokeLinecap="round">
        <path d="M114 74 V94 M104 84 H124 M107 77 L121 91 M121 77 L107 91" />
      </g>
      <circle cx={114} cy={84} r={4} fill={GOLD} stroke={INK} strokeWidth={2} />
      <Hi cx={104} cy={72} rx={4} ry={2} rot={-40} />
      {/* roof with a friendly face */}
      <rect x={56} y={48} width={116} height={10} rx={3} fill={STEEL} {...ink} />
      <path d="M58 48 L114 18 L170 48 Z" fill={INDIGO} {...ink} />
      <Hi cx={96} cy={32} rx={8} ry={2} rot={-28} />
      <ellipse cx={106} cy={38} rx={2.2} ry={2.8} fill={INK} />
      <ellipse cx={122} cy={38} rx={2.2} ry={2.8} fill={INK} />
      <circle cx={105.4} cy={37} r={0.9} fill="#fff" />
      <circle cx={121.4} cy={37} r={0.9} fill="#fff" />
      <path d="M110 42 Q114 45.5 118 42" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <ellipse cx={101} cy={42} rx={2.6} ry={1.5} fill={PINK} opacity={0.75} />
      <ellipse cx={127} cy={42} rx={2.6} ry={1.5} fill={PINK} opacity={0.75} />
      {/* coin heading in */}
      <DashArrow d="M44 70 Q68 62 86 78" ex={88} ey={80} angle={40} color={INDIGO} />
      <path d="M14 52 h8 M12 60 h8 M14 68 h8" stroke={INK} strokeWidth={2.5} strokeLinecap="round" opacity={0.45} />
      <CoinFace cx={34} cy={60} r={12} />
      <Twinkle cx={114} cy={10} r={5} />
      <Twinkle cx={184} cy={30} r={4} fill="#fff" />
    </Frame>
  );
}

export function LessonArtTaxes({ size = 200, className, ...rest }: ArtProps) {
  return (
    <Frame size={size} className={className} rest={rest} tint="#D9F4F1">
      <Sun x={146} y={6} width={44} height={44} />
      {/* coins arc into the town */}
      <path d="M22 40 Q60 6 100 30 Q118 40 116 56" fill="none" stroke={INK} strokeWidth={2.5} strokeDasharray="4 5" strokeLinecap="round" opacity={0.4} />
      <CoinFace cx={26} cy={34} r={9} />
      <CoinFace cx={60} cy={20} r={8} />
      <CoinFace cx={94} cy={26} r={7} />
      <g>
        <rect x={0} y={112} width={200} height={30} fill={MINT} opacity={0.35} />
        {/* road */}
        <rect x={-4} y={118} width={208} height={12} fill={NIGHT} opacity={0.75} />
        <path d="M6 124 H196" stroke={GOLD} strokeWidth={2.5} strokeDasharray="8 8" />
      </g>
      {/* school */}
      <g>
        <rect x={56} y={46} width={10} height={14} fill={CORAL} {...thin} />
        <path d="M61 46 V34" stroke={INK} strokeWidth={2} />
        <path d="M61 34 L71 37 L61 40 Z" fill={GOLD} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
        <rect x={28} y={66} width={66} height={50} rx={2} fill={CORAL} {...ink} />
        <path d="M24 68 L61 48 L98 68 Z" fill={BROWN} {...ink} />
        <circle cx={61} cy={61} r={4} fill="#fff" stroke={INK} strokeWidth={1.8} />
        <rect x={54} y={94} width={14} height={22} rx={2} fill={INDIGO} {...thin} />
        {[35, 75].map((x) => (
          <g key={x}>
            <rect x={x} y={76} width={12} height={10} rx={1.5} fill={SKY} {...thin} strokeWidth={2} />
            <rect x={x} y={96} width={12} height={10} rx={1.5} fill={SKY} {...thin} strokeWidth={2} />
          </g>
        ))}
        <Hi cx={40} cy={70} rx={6} ry={1.5} />
      </g>
      {/* park: tree, bench, flowers */}
      <g>
        <rect x={121} y={92} width={7} height={24} rx={2} fill={BROWN} {...thin} />
        <circle cx={124.5} cy={80} r={17} fill={MINT} {...ink} />
        <circle cx={118} cy={74} r={4} fill="#fff" opacity={0.35} />
        <circle cx={130} cy={86} r={2.4} fill={CORAL} stroke={INK} strokeWidth={1.4} />
        <circle cx={117} cy={86} r={2.4} fill={CORAL} stroke={INK} strokeWidth={1.4} />
        <rect x={146} y={102} width={30} height={5} rx={2} fill={ORANGE} {...thin} />
        <rect x={146} y={94} width={30} height={5} rx={2} fill={ORANGE} {...thin} />
        <path d="M150 107 V115 M172 107 V115" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
        {[[140, 112, PINK], [184, 111, GOLD]].map(([x, y, c]) => (
          <g key={x as number}>
            <path d={`M${x} ${y} V${(y as number) + 5}`} stroke={LEAF} strokeWidth={2} />
            <circle cx={x as number} cy={y as number} r={3} fill={c as string} stroke={INK} strokeWidth={1.5} />
          </g>
        ))}
      </g>
      <Twinkle cx={140} cy={58} r={4} fill="#fff" />
    </Frame>
  );
}

export function LessonArtScam({ size = 200, className, ...rest }: ArtProps) {
  return (
    <Frame size={size} className={className} rest={rest} tint="#F4EEE4">
      <Ground cy={124} color={GRAPE} />
      {/* the shouty bubble with a fishing hook */}
      <path d="M14 18 Q14 10 22 10 H108 Q116 10 116 18 V32 Q116 40 108 40 H50 L40 50 L40 40 H22 Q14 40 14 32 Z" fill="#fff" {...ink} />
      <InkText cx={65} cy={25} fontSize={14} fill={CORAL} strokeWidth={3}>
        YOU WON!!
      </InkText>
      <path d="M96 40 V56 Q96 64 90 64 Q84 64 84 58" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <path d="M96 40 V56 Q96 64 90 64 Q84 64 84 58" fill="none" stroke={STEEL} strokeWidth={2.2} strokeLinecap="round" />
      <path d="M84 58 L80 62" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      {/* the sneaky phone */}
      <Shadow cx={42} cy={124} rx={22} />
      <rect x={22} y={50} width={42} height={72} rx={9} fill={NIGHT} {...ink} />
      <rect x={27} y={58} width={32} height={54} rx={4} fill={SKY} />
      <Hi cx={34} cy={64} rx={4} ry={2} rot={-30} />
      <path d="M33 80 Q36.5 77 40 80 M46 80 Q49.5 77 53 80" fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
      <circle cx={37.5} cy={82} r={1.8} fill={INK} />
      <circle cx={50.5} cy={82} r={1.8} fill={INK} />
      <path d="M36 92 Q44 96 52 89" fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
      <rect x={38} y={115} width={10} height={3} rx={1.5} fill={STEEL} />
      {/* Penny stays safe behind a shield */}
      <Penny x={118} y={50} width={72} height={72} mood="happy" />
      <path d="M110 64 Q122 60 128 66 V84 Q128 100 110 108 Q92 100 92 84 V66 Q98 60 110 64 Z" fill={MINT} {...ink} />
      <path d="M110 68 Q118 65 123 69 V84 Q123 96 110 102 Z" fill={LEAF} opacity={0.35} />
      <path d="M101 85 L108 92 L120 76" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M101 85 L108 92 L120 76" fill="none" stroke="#fff" strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" />
      <Hi cx={99} cy={70} rx={4} ry={2} rot={-30} />
      <Twinkle cx={176} cy={34} r={5} />
      <Twinkle cx={134} cy={44} r={3.5} fill="#fff" />
    </Frame>
  );
}

/* ------------------------------------------------------------------ lookup */

const CORE_LESSON_ART = {
  earn: LessonArtEarn,
  'needs-wants': LessonArtNeedsWants,
  save: LessonArtSave,
  interest: LessonArtInterest,
  risk: LessonArtRisk,
  give: LessonArtGive,
  budget: LessonArtBudget,
  choice: LessonArtChoice,
  'supply-demand': LessonArtSupplyDemand,
  inflation: LessonArtInflation,
  bank: LessonArtBank,
  taxes: LessonArtTaxes,
  scam: LessonArtScam,
};

/** Every lesson scene. `satisfies` fails the build if a LESSON_ART id has no drawing. */
export const LESSON_ART_MAP = { ...CORE_LESSON_ART, ...MORE_LESSON_ART_A, ...MORE_LESSON_ART_B } satisfies Record<LessonArtId, (p: ArtProps) => ReactElement>;

/** Renders the illustration for a lesson page by its art id. */
export function LessonArt({ id, ...p }: Omit<ArtProps, 'id'> & { id: LessonArtId }) {
  // The map is complete at build time (satisfies above); the fallback only covers a dev
  // build caught between a new lesson landing and its drawing landing.
  const Art = (LESSON_ART_MAP as Record<string, ((q: ArtProps) => ReactElement) | undefined>)[id] ?? LessonArtEarn;
  return <Art {...p} />;
}
