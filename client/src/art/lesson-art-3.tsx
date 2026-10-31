// Lesson illustrations, set B: investing, protection and big-picture money ideas.
// Same 200x140 rounded tile and drawing kit as lesson-art.tsx; `size` sets the width (height is 0.7x).
// The small scene helpers below mirror lesson-art.tsx's private ones (that file imports this one,
// so importing back from it would be circular).
import { useId, type ReactElement, type ReactNode } from 'react';
import type { LessonArtId } from '@kk/shared';
import type { ArtProps } from './types';
import {
  BROWN, CORAL, CREAM, GOLD, GRAPE, Hi, INDIGO, INK, InkText, MINT, NIGHT, ORANGE, PINK, SHADE, SKY, STEEL,
  Shadow, Twinkle, heartPath, ink, starPath, thin,
} from './sticker-kit';
import { CoinFace, PiggyBank, TreasureChest } from './money';

const SKIN = '#FFD3B0';
const LEAF = '#1FB386';
const WOOD = '#A86B32';

const useUid = () => useId().replace(/:/g, '');

/** The rounded, tinted tile every lesson scene is drawn on. */
function Frame({ size, className, rest, tint, children }: {
  size: number | string;
  className?: string;
  rest: Omit<ArtProps, 'size' | 'className'>;
  tint: string;
  children: ReactNode;
}) {
  const clip = `kk-lesson3-${useUid()}`;
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

/** A pizza slice pointing down, centered near (cx, cy), about 14s wide. */
function PizzaSlice({ cx, cy, s = 1 }: { cx: number; cy: number; s?: number }) {
  return (
    <g>
      <path d={`M${cx - 7 * s} ${cy - 5 * s} Q${cx} ${cy - 8 * s} ${cx + 7 * s} ${cy - 5 * s} L${cx} ${cy + 9 * s} Z`} fill={GOLD} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <path d={`M${cx - 7 * s} ${cy - 5 * s} Q${cx} ${cy - 8 * s} ${cx + 7 * s} ${cy - 5 * s}`} fill="none" stroke={BROWN} strokeWidth={2.6 * s} strokeLinecap="round" />
      <circle cx={cx - 2 * s} cy={cy - 1 * s} r={1.7 * s} fill={CORAL} />
      <circle cx={cx + 2.2 * s} cy={cy + 2.5 * s} r={1.5 * s} fill={CORAL} />
    </g>
  );
}

/** A face-up paper bill with a coral header, for "owe" piles. */
function BillPaper({ x, y, w = 26, h = 30, rot = 0 }: { x: number; y: number; w?: number; h?: number; rot?: number }) {
  const zig = Array.from({ length: 4 }, (_, i) => `L${x + w - (i * 2 + 1) * (w / 8)} ${y + h + 3} L${x + w - (i * 2 + 2) * (w / 8)} ${y + h}`).join(' ');
  return (
    <g transform={rot ? `rotate(${rot} ${x + w / 2} ${y + h / 2})` : undefined}>
      <path d={`M${x} ${y} H${x + w} V${y + h} ${zig} Z`} fill="#fff" {...thin} />
      <rect x={x + 3} y={y + 3} width={w - 6} height={6} rx={2} fill={CORAL} />
      <path d={`M${x + 4} ${y + 14} H${x + w - 4} M${x + 4} ${y + 20} H${x + w - 8}`} stroke={STEEL} strokeWidth={2.4} strokeLinecap="round" />
      <circle cx={x + w - 6} cy={y + h - 5} r={2.6} fill={CORAL} stroke={INK} strokeWidth={1.4} />
    </g>
  );
}

/* ------------------------------------------------------------------ scenes */

export function LessonArtStocks({ size = 200, className, ...rest }: ArtProps) {
  return (
    <Frame size={size} className={className} rest={rest} tint="#FFEBD6">
      <Ground cy={123} color={ORANGE} />
      {/* the pizza shop, three slices still together */}
      <g>
        <Shadow cx={48} cy={121} rx={36} />
        <rect x={16} y={52} width={60} height={68} fill={CREAM} {...ink} />
        <rect x={16} y={26} width={60} height={22} rx={5} fill={CORAL} {...ink} />
        <InkText cx={50} cy={37} fontSize={11} fill="#fff" strokeWidth={2.6} letterSpacing={0.4}>
          PIZZA
        </InkText>
        <PizzaSlice cx={25} cy={36} s={0.7} />
        <path d="M24 48 V52 M68 48 V52" stroke={INK} strokeWidth={2.5} />
        {[16, 26, 36, 46, 56, 66].map((x, i) => (
          <rect key={x} x={x} y={52} width={10} height={10} fill={i % 2 ? '#fff' : CORAL} />
        ))}
        <path d="M16 62 q5 5 10 0 q5 5 10 0 q5 5 10 0 q5 5 10 0 q5 5 10 0 q5 5 10 0" fill={GOLD} {...thin} strokeWidth={2} />
        <rect x={16} y={52} width={60} height={10} fill="none" {...thin} />
        <rect x={21} y={74} width={22} height={16} rx={3} fill={SKY} {...thin} />
        <PizzaSlice cx={32} cy={81} s={0.55} />
        <rect x={50} y={92} width={16} height={28} rx={2} fill={BROWN} {...thin} />
        <circle cx={62} cy={106} r={1.6} fill={GOLD} />
        <Hi cx={26} cy={30} rx={5} ry={1.5} />
        {/* cut lines: the shop is split into equal pieces */}
        <path d="M36 66 V120 M56 66 V120" stroke={INK} strokeWidth={2.2} strokeDasharray="4 4" opacity={0.4} />
      </g>
      {/* one slice pulled out: that is a share */}
      <g transform="translate(6 -7)">
        <rect x={78} y={26} width={20} height={22} rx={5} fill={CORAL} {...ink} />
        <PizzaSlice cx={88} cy={36} s={0.7} />
        <path d="M88 48 V52" stroke={INK} strokeWidth={2.5} />
        <rect x={78} y={52} width={20} height={68} fill={CREAM} {...ink} />
        <rect x={78} y={52} width={10} height={10} fill={CORAL} />
        <rect x={88} y={52} width={10} height={10} fill="#fff" />
        <path d="M78 62 q5 5 10 0 q5 5 10 0" fill={GOLD} {...thin} strokeWidth={2} />
        <rect x={78} y={52} width={20} height={10} fill="none" {...thin} />
        <rect x={82} y={76} width={12} height={14} rx={2.5} fill={SKY} {...thin} />
        <Hi cx={84} cy={80} rx={1.5} ry={3} />
      </g>
      <path d="M104 64 l6 -3 M104 72 h7 M104 80 l6 3" stroke={INK} strokeWidth={2.4} strokeLinecap="round" opacity={0.5} />
      {/* the little rising chart */}
      <g>
        <rect x={112} y={10} width={46} height={32} rx={6} fill="#fff" {...ink} />
        <path d="M118 16 V36 H152" fill="none" stroke={STEEL} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M120 33 L128 27 L135 30 L148 17" fill="none" stroke={INK} strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M120 33 L128 27 L135 30 L148 17" fill="none" stroke={MINT} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M142 17 L149 16 L148 23" fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* kid proudly holding a share certificate */}
      <Kid x={138} y={125} s={0.95} shirt={MINT} hair={NIGHT} arms={false} />
      <g transform="rotate(-6 172 66)">
        <rect x={152} y={50} width={40} height={30} rx={3} fill={CREAM} {...ink} />
        <rect x={156} y={54} width={32} height={22} rx={2} fill="none" stroke={GOLD} strokeWidth={1.8} strokeDasharray="3 2.5" />
        <PizzaSlice cx={165} cy={64} s={0.75} />
        <path d="M173 60 H184 M173 65 H182" stroke={STEEL} strokeWidth={2.2} strokeLinecap="round" />
        <path d={starPath(182, 72, 4.5, 2.4)} fill={CORAL} stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
      </g>
      <Arm x1={129} y1={95} x2={152} y2={80} color={MINT} s={0.95} />
      <Arm x1={147} y1={95} x2={186} y2={77} color={MINT} s={0.95} />
      <Twinkle cx={176} cy={22} r={5} />
      <Twinkle cx={100} cy={20} r={4} fill="#fff" />
    </Frame>
  );
}

type Logo = 'star' | 'circle' | 'heart' | 'bolt' | 'tri' | 'leaf' | 'square';

/** A tiny white company mark centered on (x, y). */
function EggLogo({ x, y, kind }: { x: number; y: number; kind: Logo }) {
  const p = { fill: '#fff', stroke: INK, strokeWidth: 1.4, strokeLinejoin: 'round' as const };
  switch (kind) {
    case 'star':
      return <path d={starPath(x, y, 5, 2.5)} {...p} />;
    case 'circle':
      return (
        <g>
          <circle cx={x} cy={y} r={4.2} {...p} />
          <circle cx={x} cy={y} r={1.6} fill={INK} />
        </g>
      );
    case 'heart':
      return <path d={heartPath(x, y, 4.5)} {...p} />;
    case 'bolt':
      return <path d={`M${x + 1} ${y - 6} L${x - 3.5} ${y + 1} H${x} L${x - 1} ${y + 6} L${x + 3.5} ${y - 1} H${x} Z`} {...p} />;
    case 'tri':
      return <path d={`M${x} ${y - 5} L${x + 5} ${y + 3.5} H${x - 5} Z`} {...p} />;
    case 'leaf':
      return <path d={`M${x - 4} ${y + 4} C${x - 5} ${y - 3} ${x} ${y - 5} ${x + 4.5} ${y - 4.5} C${x + 5} ${y + 1} ${x + 1} ${y + 5} ${x - 4} ${y + 4} Z`} {...p} />;
    case 'square':
      return <rect x={x - 3.8} y={y - 3.8} width={7.6} height={7.6} rx={1.8} {...p} />;
  }
}

export function LessonArtIndexFund({ size = 200, className, ...rest }: ArtProps) {
  const eggs: [number, number, string, Logo, number][] = [
    [62, 70, CORAL, 'star', -14],
    [82, 62, SKY, 'circle', -6],
    [104, 59, GOLD, 'heart', 0],
    [126, 62, GRAPE, 'bolt', 6],
    [144, 70, MINT, 'tri', 14],
    [74, 79, PINK, 'leaf', -8],
    [96, 76, ORANGE, 'square', 2],
    [118, 77, INDIGO, 'star', 8],
    [136, 80, CORAL, 'circle', 10],
  ];
  return (
    <Frame size={size} className={className} rest={rest} tint="#FFF3C4">
      <Ground cy={124} rx={70} color={SHADE} />
      {/* handle behind the eggs */}
      <path d="M46 82 C44 14 156 14 154 82" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" />
      <path d="M46 82 C44 14 156 14 154 82" fill="none" stroke={BROWN} strokeWidth={5.5} strokeLinecap="round" />
      <path d="M62 40 C74 28 90 24 100 24" fill="none" stroke="#fff" strokeOpacity={0.4} strokeWidth={2} strokeLinecap="round" />
      {/* basket mouth */}
      <ellipse cx={100} cy={84} rx={62} ry={12} fill={WOOD} {...ink} />
      {eggs.map(([x, y, c, logo, rot], i) => (
        <g key={i} transform={`rotate(${rot} ${x} ${y})`}>
          <path d={`M${x} ${y - 14} C${x + 8} ${y - 14} ${x + 11} ${y - 2} ${x + 11} ${y + 3} C${x + 11} ${y + 10} ${x + 6} ${y + 13} ${x} ${y + 13} C${x - 6} ${y + 13} ${x - 11} ${y + 10} ${x - 11} ${y + 3} C${x - 11} ${y - 2} ${x - 8} ${y - 14} ${x} ${y - 14} Z`} fill={c} {...thin} />
          <Hi cx={x - 4} cy={y - 6} rx={2} ry={3.5} rot={20} />
          <EggLogo x={x + 0.5} y={y + 2} kind={logo} />
        </g>
      ))}
      {/* basket front */}
      <path d="M38 84 Q100 104 162 84 L152 116 Q150 124 140 124 H60 Q50 124 48 116 Z" fill={BROWN} {...ink} />
      <g stroke={WOOD} strokeWidth={2} strokeLinecap="round" fill="none">
        <path d="M44 100 Q100 116 156 100 M47 110 Q100 124 153 110" />
        <path d="M62 97 L64 123 M80 100 L81 124 M100 101 V124 M120 100 L119 124 M138 97 L136 123" />
      </g>
      <path d="M38 84 Q100 104 162 84" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
      <path d="M38 84 Q100 104 162 84" fill="none" stroke={ORANGE} strokeWidth={4} strokeLinecap="round" />
      <Hi cx={58} cy={104} rx={6} ry={2} rot={20} />
      <Twinkle cx={30} cy={34} r={6} />
      <Twinkle cx={172} cy={30} r={4.5} fill="#fff" />
      <Twinkle cx={180} cy={70} r={3.5} fill={SKY} />
    </Frame>
  );
}

export function LessonArtTimeGrowth({ size = 200, className, ...rest }: ArtProps) {
  const big: [number, number, number][] = [[128, 66, 15], [168, 66, 15], [148, 48, 29]];
  const fruit: [number, number][] = [[134, 38], [158, 34], [148, 58], [168, 54], [128, 62], [174, 70], [142, 72]];
  return (
    <Frame size={size} className={className} rest={rest} tint="#E9F7D4">
      <rect x={0} y={112} width={200} height={30} fill={MINT} opacity={0.35} />
      <path d="M0 112 H200" stroke={LEAF} strokeWidth={2} opacity={0.5} />
      {/* 1: a tiny sapling */}
      <g>
        <ellipse cx={30} cy={112} rx={10} ry={4} fill={BROWN} {...thin} strokeWidth={2} />
        <path d="M30 111 C30 104 31 99 30 94" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
        <path d="M30 111 C30 104 31 99 30 94" fill="none" stroke={LEAF} strokeWidth={2.4} strokeLinecap="round" />
        <path d="M30 100 C24 102 19 99 18 93 C24 91 29 94 30 100 Z" fill={MINT} {...thin} strokeWidth={2} />
        <path d="M30 95 C35 96 40 92 41 87 C35 86 31 89 30 95 Z" fill={MINT} {...thin} strokeWidth={2} />
      </g>
      {/* 2: a young tree */}
      <g>
        <Shadow cx={76} cy={113} rx={14} />
        <rect x={73} y={80} width={7} height={33} rx={2} fill={BROWN} {...thin} />
        <circle cx={76.5} cy={70} r={17} fill={MINT} {...ink} />
        <circle cx={70} cy={64} r={4} fill="#fff" opacity={0.35} />
        <CoinFace cx={82} cy={74} r={4.5} />
      </g>
      {/* 3: the big tree, heavy with coins */}
      <g>
        <Shadow cx={148} cy={113} rx={26} />
        <path d="M140 113 Q144 104 143 76 H153 Q152 104 156 113 Z" fill={BROWN} {...ink} />
        <path d="M148 84 L141 76 M148 90 L156 80" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
        {big.map(([x, y, r]) => (
          <circle key={`s${x}`} cx={x} cy={y} r={r} fill="none" stroke={INK} strokeWidth={6} />
        ))}
        {big.map(([x, y, r]) => (
          <circle key={`f${x}`} cx={x} cy={y} r={r} fill={LEAF} />
        ))}
        <circle cx={148} cy={46} r={24} fill={MINT} />
        <circle cx={137} cy={33} r={6} fill="#fff" opacity={0.3} />
        {fruit.map(([x, y]) => (
          <CoinFace key={`${x}${y}`} cx={x} cy={y} r={6} />
        ))}
        <CoinFace cx={180} cy={104} r={6} />
        <path d="M176 88 v4 M184 89 v4" stroke={INK} strokeWidth={2} strokeLinecap="round" opacity={0.5} />
      </g>
      {/* time passing */}
      <DashArrow d="M44 98 H56" ex={58} ey={98} angle={0} color={INDIGO} />
      <DashArrow d="M98 98 H110" ex={112} ey={98} angle={0} color={INDIGO} />
      <Twinkle cx={30} cy={66} r={4} fill="#fff" />
      <Twinkle cx={102} cy={30} r={5} />
      <Twinkle cx={186} cy={26} r={5} />
    </Frame>
  );
}

/** Point on a cubic bezier. */
const cubic = (p: number[], t: number) => {
  const u = 1 - t;
  return [0, 1].map((k) => u * u * u * p[k] + 3 * u * u * t * p[k + 2] + 3 * u * t * t * p[k + 4] + t * t * t * p[k + 6]) as [number, number];
};

export function LessonArtCrypto({ size = 200, className, ...rest }: ArtProps) {
  const segs = [
    [-6, 104, 26, 104, 38, 46, 66, 46],
    [66, 46, 94, 46, 98, 112, 126, 112],
    [126, 112, 152, 112, 160, 56, 206, 48],
  ];
  const track = `M${segs[0][0]} ${segs[0][1]} ${segs.map((s) => `C${s.slice(2).join(' ')}`).join(' ')}`;
  const posts = segs.flatMap((s) => [0.3, 0.7].map((t) => cubic(s, t)));
  return (
    <Frame size={size} className={className} rest={rest} tint="#E6E6FF">
      {/* supports */}
      {posts.map(([x, y]) => (
        <g key={x}>
          <path d={`M${x} ${y} V142`} stroke={INK} strokeWidth={6} />
          <path d={`M${x} ${y} V142`} stroke={STEEL} strokeWidth={2.6} />
        </g>
      ))}
      {/* the coaster track */}
      <path d={track} fill="none" stroke={BROWN} strokeWidth={13} strokeDasharray="3 6" />
      <path d={track} fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
      <path d={track} fill="none" stroke={CORAL} strokeWidth={3.2} strokeLinecap="round" />
      {/* the shiny future coin riding over the top */}
      <path d="M30 18 h-10 M28 28 h-12 M30 38 h-8" stroke={INK} strokeWidth={2.5} strokeLinecap="round" opacity={0.45} />
      <g transform="rotate(-12 60 25)">
        <circle cx={60} cy={25} r={18} fill={GRAPE} {...ink} />
        <circle cx={60} cy={25} r={13} fill={SKY} stroke={INK} strokeWidth={2} />
        <path d="M60 17 L67 21 V29 L60 33 L53 29 V21 Z" fill="#fff" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        <path d="M60 21 L63.5 23 V27 L60 29 L56.5 27 V23 Z" fill={GOLD} />
        <path d="M47 25 H52 M68 25 H73 M60 12 V16 M60 34 V38" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
        <circle cx={47} cy={25} r={1.6} fill="#fff" stroke={INK} strokeWidth={1.2} />
        <circle cx={73} cy={25} r={1.6} fill="#fff" stroke={INK} strokeWidth={1.2} />
        <ellipse cx={52} cy={14} rx={4} ry={1.8} transform="rotate(-40 52 14)" fill="#fff" opacity={0.7} />
      </g>
      <Twinkle cx={84} cy={12} r={5} fill={SKY} />
      <Twinkle cx={38} cy={52} r={3.5} fill="#fff" />
      {/* nobody knows which way it goes next */}
      <InkText cx={160} cy={28} fontSize={30} fill={GOLD} strokeWidth={4}>
        ?
      </InkText>
      <InkText cx={124} cy={78} fontSize={18} fill={PINK} strokeWidth={3.4}>
        ?
      </InkText>
      <Twinkle cx={100} cy={40} r={4} />
    </Frame>
  );
}

export function LessonArtInsurance({ size = 200, className, ...rest }: ArtProps) {
  const x0 = 12;
  const w = 176;
  const n = 6;
  const sw = w / n;
  const scallops = Array.from({ length: n }, () => `q${-sw / 2} -9 ${-sw} 0`).join(' ');
  const canopy = `M${x0} 74 C${x0 + 2} 46 50 40 100 40 C150 40 ${x0 + w - 2} 46 ${x0 + w} 74 ${scallops} Z`;
  const drops: [number, number][] = [[62, 32], [82, 30], [118, 30], [138, 32], [8, 70], [192, 76], [16, 96], [186, 100], [8, 120]];
  return (
    <Frame size={size} className={className} rest={rest} tint="#DCF3FD">
      <rect x={0} y={118} width={200} height={24} fill={INDIGO} opacity={0.18} />
      <ellipse cx={100} cy={120} rx={78} ry={6} fill={MINT} opacity={0.35} />
      {/* rain */}
      {drops.map(([x, y]) => (
        <path key={`${x}-${y}`} d={`M${x} ${y} q-3 5 0 7 q3 -2 0 -7 Z`} fill={SKY} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      ))}
      {/* storm cloud */}
      <path d="M66 26 C56 26 56 12 68 12 C70 2 86 0 92 8 C98 -2 118 0 118 12 C130 10 136 26 124 26 Z" fill={STEEL} {...ink} />
      <path d="M76 14 C80 10 86 10 90 12" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" opacity={0.8} />
      <path d="M130 16 L140 16 L134 26 L142 26 L128 40 L132 29 L125 29 Z" fill={GOLD} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      {/* the umbrella */}
      <path d={canopy} fill={CORAL} {...ink} />
      {Array.from({ length: n - 1 }, (_, k) => {
        const x = x0 + sw * (k + 1);
        return <path key={k} d={`M100 41 Q${(100 + x) / 2 + (x - 100) * 0.15} 50 ${x} 74`} fill="none" stroke={INK} strokeWidth={2} />;
      })}
      <path d="M100 41 Q104 54 100 74 Q96 54 100 41 Z" fill="#fff" opacity={0.25} />
      <Hi cx={58} cy={52} rx={14} ry={3} rot={-14} />
      <circle cx={100} cy={37} r={3.6} fill={GOLD} {...thin} strokeWidth={2} />
      <path d="M100 72 V114 Q100 122 93 122 Q86 122 86 116" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
      <path d="M100 72 V114 Q100 122 93 122 Q86 122 86 116" fill="none" stroke={NIGHT} strokeWidth={3} strokeLinecap="round" />
      {/* house */}
      <g>
        <rect x={26} y={96} width={32} height={24} fill={CREAM} {...ink} />
        <path d="M22 98 L42 80 L62 98 Z" fill={INDIGO} {...ink} />
        <rect x={37} y={106} width={9} height={14} rx={1.5} fill={BROWN} {...thin} strokeWidth={2} />
        <rect x={49} y={102} width={6} height={6} rx={1} fill={SKY} stroke={INK} strokeWidth={1.6} />
      </g>
      {/* bike */}
      <g>
        <circle cx={68} cy={114} r={6.5} fill="none" stroke={INK} strokeWidth={2.6} />
        <circle cx={88} cy={114} r={6.5} fill="none" stroke={INK} strokeWidth={2.6} />
        <path d="M68 114 L76 114 L84 104 M76 114 L73 104 L84 104 L88 114" fill="none" stroke={INK} strokeWidth={4.4} strokeLinejoin="round" strokeLinecap="round" />
        <path d="M68 114 L76 114 L84 104 M76 114 L73 104 L84 104 L88 114" fill="none" stroke={GOLD} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        <rect x={69} y={100} width={8} height={3.5} rx={1.7} fill={NIGHT} />
        <path d="M84 104 L83 99 L87 98" fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* car */}
      <g>
        <path d="M110 116 V106 Q110 102 114 101 L124 99 L132 90 H154 L163 100 Q172 101 172 108 V116 Z" fill={MINT} {...ink} />
        <path d="M128 99 L134 93 H142 V99 Z M146 99 V93 H152 L157 99 Z" fill={SKY} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
        <circle cx={123} cy={117} r={6} fill={NIGHT} {...thin} />
        <circle cx={159} cy={117} r={6} fill={NIGHT} {...thin} />
        <circle cx={123} cy={117} r={2} fill={STEEL} />
        <circle cx={159} cy={117} r={2} fill={STEEL} />
        <circle cx={169} cy={106} r={2} fill={GOLD} stroke={INK} strokeWidth={1.2} />
        <Hi cx={118} cy={104} rx={4} ry={1.4} />
      </g>
    </Frame>
  );
}

export function LessonArtIdentity({ size = 200, className, ...rest }: ArtProps) {
  return (
    <Frame size={size} className={className} rest={rest} tint="#EFE4FF">
      <Ground cy={124} color={GRAPE} />
      {/* the ID card */}
      <g transform="rotate(-5 58 64)">
        <Shadow cx={60} cy={102} rx={40} />
        <rect x={14} y={30} width={90} height={62} rx={8} fill="#fff" {...ink} />
        <path d="M14 42 V38 Q14 30 22 30 H96 Q104 30 104 38 V42 Z" fill={INDIGO} {...ink} />
        <InkText cx={30} cy={36} fontSize={8} fill="#fff" strokeWidth={2} letterSpacing={0.5}>
          ID
        </InkText>
        <rect x={21} y={49} width={26} height={33} rx={4} fill={SKY} {...thin} strokeWidth={2} />
        <path d="M24 82 Q24 72 34 72 Q44 72 44 82 Z" fill={CORAL} stroke={INK} strokeWidth={1.8} />
        <circle cx={34} cy={62} r={7} fill={SKIN} stroke={INK} strokeWidth={1.8} />
        <path d="M27 61 C27 53 41 53 41 61 C38 57 32 57 27 61 Z" fill={BROWN} stroke={INK} strokeWidth={1.5} strokeLinejoin="round" />
        <circle cx={31.5} cy={63} r={1} fill={INK} />
        <circle cx={36.5} cy={63} r={1} fill={INK} />
        <path d="M54 54 H94 M54 63 H88 M54 72 H78" stroke={STEEL} strokeWidth={3.5} strokeLinecap="round" />
        <Hi cx={70} cy={34} rx={10} ry={1.5} />
      </g>
      {/* padlock on the card */}
      <g>
        <path d="M86 84 V76 Q86 66 95 66 Q104 66 104 76 V84" fill="none" stroke={INK} strokeWidth={8} />
        <path d="M86 84 V76 Q86 66 95 66 Q104 66 104 76 V84" fill="none" stroke={STEEL} strokeWidth={4} />
        <rect x={80} y={82} width={30} height={24} rx={5} fill={GOLD} {...ink} />
        <circle cx={95} cy={92} r={3} fill={INK} />
        <path d="M95 93 V99" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
        <Hi cx={86} cy={86} rx={3} ry={1.5} />
      </g>
      {/* the shield blocks the sneaky hand */}
      <path d="M132 50 Q144 46 150 52 V72 Q150 90 132 98 Q114 90 114 72 V52 Q120 46 132 50 Z" fill={MINT} {...ink} />
      <path d="M132 55 Q140 52 145 56 V72 Q145 86 132 92 Z" fill={LEAF} opacity={0.35} />
      <path d="M123 72 L130 79 L142 63" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M123 72 L130 79 L142 63" fill="none" stroke="#fff" strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" />
      <Hi cx={121} cy={56} rx={4} ry={2} rot={-30} />
      <PopLines cx={154} cy={64} r={8} angles={[-60, -20]} />
      {/* the masked sneak */}
      <Kid x={174} y={126} s={0.95} shirt={NIGHT} hair={INK} pants={GRAPE} arms={false} mood="wow" />
      <rect x={160.5} y={76.8} width={27} height={9} rx={4.5} fill={INK} />
      <circle cx={169.7} cy={81.3} r={2.6} fill="#fff" />
      <circle cx={178.3} cy={81.3} r={2.6} fill="#fff" />
      <circle cx={169.2} cy={81.5} r={1.3} fill={INK} />
      <circle cx={177.8} cy={81.5} r={1.3} fill={INK} />
      <path d="M187 80 l6 -4 M187 83 l7 1" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
      <Arm x1={165} y1={97} x2={155} y2={74} color={NIGHT} s={0.95} />
      <Arm x1={183} y1={97} x2={188} y2={110} color={NIGHT} s={0.95} />
      <Twinkle cx={132} cy={26} r={5} />
      <Twinkle cx={16} cy={112} r={4} fill="#fff" />
    </Frame>
  );
}

export function LessonArtGoals({ size = 200, className, ...rest }: ArtProps) {
  const steps = [SKY, MINT, GOLD, ORANGE];
  return (
    <Frame size={size} className={className} rest={rest} tint="#FFE4E4">
      <Ground cy={123} color={CORAL} />
      {/* target on its stand */}
      <path d="M40 96 L30 122 M64 96 L74 122" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <path d="M40 96 L30 122 M64 96 L74 122" stroke={BROWN} strokeWidth={2.8} strokeLinecap="round" />
      {[[38, CORAL], [30, '#fff'], [22, CORAL], [14, '#fff'], [6, CORAL]].map(([r, c]) => (
        <circle key={r as number} cx={52} cy={64} r={r as number} fill={c as string} {...thin} />
      ))}
      <Hi cx={34} cy={42} rx={6} ry={2.5} rot={-40} />
      {/* arrow right in the bullseye */}
      <path d="M53 63 L92 34" stroke={INK} strokeWidth={6.5} strokeLinecap="round" />
      <path d="M53 63 L92 34" stroke={BROWN} strokeWidth={3} strokeLinecap="round" />
      <path d="M86 38 L84 26 L94 30 Z M90 36 L102 38 L96 30 Z" fill={INDIGO} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <PopLines cx={52} cy={64} r={44} angles={[150, 190, 230]} />
      {/* steps up to the star */}
      {steps.map((c, i) => {
        const x = 106 + i * 21;
        const top = 118 - (i + 1) * 16;
        return (
          <g key={c}>
            <rect x={x} y={top} width={21} height={120 - top} rx={3} fill={c} {...ink} />
            <Hi cx={x + 6} cy={top + 4} rx={4} ry={1.4} />
            <InkText cx={x + 10.5} cy={top + 9} fontSize={10} fill="#fff" strokeWidth={2.4}>
              {i + 1}
            </InkText>
          </g>
        );
      })}
      <path d={starPath(179, 30, 15, 7.5)} fill={GOLD} {...ink} />
      <ellipse cx={176} cy={31} rx={1.6} ry={2.1} fill={INK} />
      <ellipse cx={183} cy={31} rx={1.6} ry={2.1} fill={INK} />
      <path d="M177 35 Q179.5 37.5 182 35" fill="none" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
      <Hi cx={173} cy={24} rx={2.5} ry={1.4} rot={-30} />
      <PopLines cx={179} cy={30} r={19} angles={[-150, -30, 200]} />
      <DashArrow d="M114 92 Q120 60 150 46" ex={152} ey={45} angle={-25} color={INDIGO} />
      <Twinkle cx={124} cy={20} r={4.5} fill="#fff" />
    </Frame>
  );
}

export function LessonArtSubscriptions({ size = 200, className, ...rest }: ArtProps) {
  const pages = [
    { x: 16, rot: -4 },
    { x: 77, rot: 2 },
    { x: 138, rot: -2 },
  ];
  const loop = 'M162 104 C190 108 186 128 160 128 H42 C14 128 12 106 36 102';
  return (
    <Frame size={size} className={className} rest={rest} tint="#E9F1FF">
      {pages.map(({ x, rot }, i) => {
        const cx = x + 23;
        return (
          <g key={x}>
            <g transform={`rotate(${rot} ${cx} 40)`}>
              <rect x={x} y={16} width={46} height={46} rx={6} fill="#fff" {...ink} />
              <path d={`M${x} 29 V22 Q${x} 16 ${x + 6} 16 H${x + 40} Q${x + 46} 16 ${x + 46} 22 V29 Z`} fill={[CORAL, GRAPE, SKY][i]} {...ink} />
              <path d={`M${x + 12} 11 V19 M${x + 34} 11 V19`} stroke={INK} strokeWidth={3} strokeLinecap="round" />
              {[0, 1, 2].map((r) =>
                [0, 1, 2, 3].map((c) => (
                  <rect key={`${r}${c}`} x={x + 6 + c * 9.2} y={34 + r * 8} width={6} height={5} rx={1.4} fill={r === 1 && c === 2 ? GOLD : STEEL} stroke={r === 1 && c === 2 ? INK : 'none'} strokeWidth={1.4} />
                )),
              )}
            </g>
            {/* the same coin leaves every month */}
            <path d={`M${cx} 68 V78`} stroke={INK} strokeWidth={2.5} strokeDasharray="3 4" strokeLinecap="round" opacity={0.45} />
            <path d={`M${cx - 14} 84 l-4 -2 M${cx + 14} 84 l4 -2`} stroke={INK} strokeWidth={2.2} strokeLinecap="round" opacity={0.45} />
            <CoinFace cx={cx} cy={92} r={10} />
          </g>
        );
      })}
      {/* round and round it goes */}
      <path d={loop} fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
      <path d={loop} fill="none" stroke={INDIGO} strokeWidth={4} strokeLinecap="round" />
      <path d="M30 96 L40 101 L32 109 Z" fill={INDIGO} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      <Twinkle cx={186} cy={18} r={5} />
      <Twinkle cx={70} cy={10} r={3.5} fill="#fff" />
    </Frame>
  );
}

export function LessonArtTrade({ size = 200, className, ...rest }: ArtProps) {
  return (
    <Frame size={size} className={className} rest={rest} tint="#D9F4F1">
      <Ground cy={126} color={SKY} />
      {/* the globe */}
      <g>
        <Shadow cx={100} cy={96} rx={18} />
        <circle cx={100} cy={62} r={27} fill={SKY} {...ink} />
        <path d="M82 46 C88 40 98 42 98 50 C98 56 90 56 90 62 C90 70 82 72 78 64 C76 56 78 50 82 46 Z" fill={MINT} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        <path d="M106 40 C114 38 122 44 124 52 C120 56 112 52 110 58 C108 64 116 68 114 76 C108 82 100 78 102 70 C104 62 100 56 102 48 Z" fill={MINT} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        <ellipse cx={100} cy={62} rx={11} ry={27} fill="none" stroke={INK} strokeOpacity={0.25} strokeWidth={1.6} />
        <path d="M73 62 H127" stroke={INK} strokeOpacity={0.25} strokeWidth={1.6} />
        <Hi cx={88} cy={44} rx={6} ry={3} rot={-35} />
      </g>
      {/* goods going both ways */}
      <DashArrow d="M40 50 Q100 -6 160 50" ex={161} ey={51} angle={43} color={INDIGO} />
      <DashArrow d="M160 104 Q100 138 40 104" ex={39} ey={103} angle={209} color={INDIGO} />
      {/* an apple heads one way */}
      <circle cx={100} cy={22} r={8} fill={CORAL} {...thin} />
      <path d="M100 14 q1 -4 4 -5" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <ellipse cx={105} cy={12} rx={3.5} ry={2} transform="rotate(-25 105 12)" fill={MINT} stroke={INK} strokeWidth={1.6} />
      <Hi cx={97} cy={19} rx={2.5} ry={1.6} rot={-30} />
      {/* a toy car heads back */}
      <g>
        <path d="M86 124 V116 Q86 113 89 113 L94 112 L99 106 H107 L112 112 Q116 113 116 117 V124 Z" fill={GOLD} {...thin} />
        <path d="M100 112 L102 109 H106 L108 112 Z" fill={SKY} stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
        <circle cx={93} cy={124} r={4} fill={NIGHT} stroke={INK} strokeWidth={2} />
        <circle cx={109} cy={124} r={4} fill={NIGHT} stroke={INK} strokeWidth={2} />
      </g>
      {/* two kids from two places, each with a flag */}
      <path d="M44 100 V60" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M44 60 H62 V74 H44 Z" fill={CORAL} {...thin} strokeWidth={2} />
      <path d={starPath(53, 67, 4.2, 2.1)} fill="#fff" stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
      <Kid x={26} y={128} s={0.9} shirt={CORAL} hair={NIGHT} arms={false} />
      <Arm x1={35} y1={100} x2={44} y2={92} color={CORAL} s={0.9} />
      <Arm x1={17} y1={100} x2={14} y2={112} color={CORAL} s={0.9} />
      <path d="M156 100 V60" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M156 60 H138 V74 H156 Z" fill={INDIGO} {...thin} strokeWidth={2} />
      <circle cx={147} cy={67} r={3.6} fill={GOLD} stroke={INK} strokeWidth={1.2} />
      <Kid x={174} y={128} s={0.9} shirt={INDIGO} hair={ORANGE} arms={false} />
      <Arm x1={165} y1={100} x2={156} y2={92} color={INDIGO} s={0.9} />
      <Arm x1={183} y1={100} x2={186} y2={112} color={INDIGO} s={0.9} />
      <Twinkle cx={140} cy={18} r={4.5} />
      <Twinkle cx={60} cy={16} r={3.5} fill="#fff" />
    </Frame>
  );
}

export function LessonArtContentment({ size = 200, className, ...rest }: ArtProps) {
  return (
    <Frame size={size} className={className} rest={rest} tint="#FFF0D6">
      {/* far away: a giant pile, small and faded with distance */}
      <g opacity={0.5}>
        <path d="M126 98 Q146 30 162 28 Q178 30 198 98 Z" fill={GOLD} {...thin} />
        {[[162, 36], [154, 50], [170, 50], [146, 64], [162, 64], [178, 66], [140, 80], [156, 80], [172, 82], [188, 84], [134, 93], [150, 94], [166, 94], [182, 95]].map(([x, y]) => (
          <CoinFace key={`${x}${y}`} cx={x} cy={y} r={5.5} />
        ))}
      </g>
      <path d="M0 98 Q60 92 120 96 Q170 99 200 94 V142 H0 Z" fill={MINT} opacity={0.3} />
      <path d="M118 96 Q120 92 126 92" fill="none" stroke={INK} strokeOpacity={0.12} strokeWidth={2} />
      {/* happy kid sitting with a little treasure */}
      <Shadow cx={74} cy={122} rx={44} />
      <g>
        <ellipse cx={58} cy={114} rx={20} ry={7} fill={NIGHT} {...thin} />
        <ellipse cx={40} cy={117} rx={5} ry={3.2} fill={CORAL} {...thin} />
        <ellipse cx={76} cy={117} rx={5} ry={3.2} fill={CORAL} {...thin} />
        <rect x={47} y={86} width={22} height={24} rx={9} fill={PINK} {...ink} />
        <Hi cx={53} cy={92} rx={3.5} ry={2} rot={-30} />
        <circle cx={58} cy={72} r={13} fill={SKIN} {...ink} />
        <path d="M44.5 72 C44 56 72 56 71.5 72 C67 65 56 63 44.5 72 Z" fill={BROWN} {...thin} />
        {/* eyes closed, smiling */}
        <path d="M51 73 Q53.5 70 56 73 M60 73 Q62.5 70 65 73" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
        <path d="M54 78 Q58 82 62 78" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
        <ellipse cx={49.5} cy={77} rx={2.6} ry={1.6} fill={PINK} opacity={0.75} />
        <ellipse cx={66.5} cy={77} rx={2.6} ry={1.6} fill={PINK} opacity={0.75} />
      </g>
      <TreasureChest open x={72} y={78} width={44} height={44} />
      <Arm x1={66} y1={94} x2={80} y2={104} color={PINK} />
      <Arm x1={50} y1={94} x2={42} y2={106} color={PINK} />
      {/* the heart that says enough */}
      <path d={heartPath(36, 46, 11)} fill={CORAL} {...ink} />
      <Hi cx={31} cy={42} rx={3} ry={1.6} rot={-30} />
      <path d={heartPath(98, 58, 5)} fill={PINK} {...thin} strokeWidth={2} />
      <Twinkle cx={60} cy={34} r={5} />
      <Twinkle cx={20} cy={78} r={3.5} fill="#fff" />
    </Frame>
  );
}

export function LessonArtNetWorth({ size = 200, className, ...rest }: ArtProps) {
  return (
    <Frame size={size} className={className} rest={rest} tint="#DDF6EA">
      <Ground cy={124} rx={60} color={LEAF} />
      {/* stand */}
      <rect x={97} y={42} width={6} height={74} rx={2} fill={BROWN} {...ink} />
      <path d="M76 125 L124 125 L114 113 L86 113 Z" fill={BROWN} {...ink} />
      {/* beam, tipped down on the OWN side */}
      <g transform="rotate(-7 100 44)">
        <rect x={38} y={40} width={124} height={8} rx={4} fill={STEEL} {...ink} />
        <Hi cx={60} cy={42.5} rx={10} ry={1.4} />
      </g>
      <circle cx={100} cy={44} r={6} fill={GOLD} {...ink} />
      <path d="M40 51 L21 88 M40 51 L59 88 M160 37 L143 74 M160 37 L177 74" stroke={INK} strokeWidth={2} />
      {/* own: a house and a piggy */}
      <rect x={21} y={70} width={20} height={18} rx={1.5} fill={CREAM} {...thin} />
      <path d="M18 72 L31 60 L44 72 Z" fill={INDIGO} {...thin} />
      <rect x={28} y={78} width={6} height={10} rx={1} fill={BROWN} stroke={INK} strokeWidth={1.6} />
      <PiggyBank x={34} y={58} width={34} height={34} />
      {/* owe: a couple of bills */}
      <BillPaper x={144} y={46} w={18} h={22} rot={-10} />
      <BillPaper x={158} y={48} w={18} h={22} rot={8} />
      {/* pans */}
      <path d="M18 88 H62 Q60 102 40 102 Q20 102 18 88 Z" fill={GOLD} {...ink} />
      <path d="M140 74 H180 Q178 88 160 88 Q142 88 140 74 Z" fill={GOLD} {...ink} />
      <Hi cx={29} cy={93} rx={4} ry={1.5} />
      <Hi cx={150} cy={79} rx={4} ry={1.5} />
      <InkText cx={40} cy={115} fontSize={13} fill={MINT} strokeWidth={2.8} letterSpacing={0.5}>
        OWN
      </InkText>
      <InkText cx={160} cy={101} fontSize={13} fill={CORAL} strokeWidth={2.8} letterSpacing={0.5}>
        OWE
      </InkText>
      <Twinkle cx={74} cy={22} r={5} />
      <Twinkle cx={184} cy={20} r={3.5} fill="#fff" />
    </Frame>
  );
}

/* ------------------------------------------------------------------ lookup */

export const MORE_LESSON_ART_B = {
  stocks: LessonArtStocks,
  'index-fund': LessonArtIndexFund,
  'time-growth': LessonArtTimeGrowth,
  crypto: LessonArtCrypto,
  insurance: LessonArtInsurance,
  identity: LessonArtIdentity,
  goals: LessonArtGoals,
  subscriptions: LessonArtSubscriptions,
  trade: LessonArtTrade,
  contentment: LessonArtContentment,
  'net-worth': LessonArtNetWorth,
} satisfies Partial<Record<LessonArtId, (p: ArtProps) => ReactElement>>;
