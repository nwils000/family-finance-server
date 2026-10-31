// Shared drawing kit for every sticker set (quest, reward and goal icons).
// One palette, one highlight, one shadow, one tile per shape: draw new stickers with these.
import type { ReactNode } from 'react';
import type { ArtProps } from './types';

export const INK = '#1F2547';
export const INDIGO = '#5B5BF7';
export const GOLD = '#FFC83D';
export const SHADE = '#F59E0B';
export const MINT = '#2ED3A0';
export const CORAL = '#FF6B6B';
export const SKY = '#4CC9F0';
export const GRAPE = '#9B5DE5';
export const PINK = '#FF8FC7';
export const CREAM = '#FFF8EC';
export const ORANGE = '#FF9F43';
export const BROWN = '#C9783A';
export const STEEL = '#D6DAEA';
export const NIGHT = '#2E3270';

export const ink = {
  stroke: INK,
  strokeWidth: 3,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
};
export const thin = { ...ink, strokeWidth: 2.5 };

/** Soft white sticker highlight. */
export function Hi({ cx, cy, rx, ry, rot = 0 }: { cx: number; cy: number; rx: number; ry: number; rot?: number }) {
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      fill="#fff"
      fillOpacity={0.35}
      transform={rot ? `rotate(${rot} ${cx} ${cy})` : undefined}
    />
  );
}

/** Ground shadow under an object. */
export function Shadow({ cx = 50, cy, rx }: { cx?: number; cy: number; rx: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={3.5} fill={INK} fillOpacity={0.12} />;
}

/** Four-point twinkle. */
export function Twinkle({ cx, cy, r, fill = GOLD }: { cx: number; cy: number; r: number; fill?: string }) {
  return (
    <path
      d={`M${cx} ${cy - r}Q${cx} ${cy} ${cx + r} ${cy}Q${cx} ${cy} ${cx} ${cy + r}Q${cx} ${cy} ${cx - r} ${cy}Q${cx} ${cy} ${cx} ${cy - r}Z`}
      fill={fill}
      stroke={INK}
      strokeWidth={2}
      strokeLinejoin="round"
    />
  );
}

/** Chunky five-point star path. */
export function starPath(cx: number, cy: number, r: number, inner = r * 0.5) {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 ? inner : r;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    d += `${i ? 'L' : 'M'}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`;
  }
  return `${d}Z`;
}

export type TileProps = {
  size: number | string;
  className?: string;
  rest: Omit<ArtProps, 'size' | 'className'>;
  tint: string;
  children: ReactNode;
};

/** Rounded-square tile that every quest icon sits on. */
export function QTile({ size, className, rest, tint, children }: TileProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true" {...rest}>
      <rect x="4" y="4" width="92" height="92" rx="26" fill={tint} />
      <rect x="4" y="4" width="92" height="92" rx="26" fill="none" stroke={INK} strokeOpacity={0.08} strokeWidth={2} />
      {children}
    </svg>
  );
}

/** Circle tile every reward and goal sits on (quests use rounded squares). */
export function RTile({ size, className, rest, tint, children }: TileProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true" {...rest}>
      <circle cx="50" cy="50" r="46" fill={tint} />
      <circle cx="50" cy="50" r="46" fill="none" stroke={INK} strokeOpacity={0.08} strokeWidth={2} />
      {children}
    </svg>
  );
}

/**
 * Fredoka 700 capitals and digits ink from the baseline up to 0.70em (measured with
 * canvas measureText), so their visual middle sits 0.35em above the baseline.
 * dominantBaseline="central" centers the font's em box instead, which put numbers
 * and letters visibly low.
 */
const INK_MIDDLE_EM = 0.35;

/** Bold sticker text whose visible glyphs are centered on (cx, cy). Every text in the art goes through here. */
export function InkText({
  cx,
  cy,
  fontSize,
  fill,
  strokeWidth,
  letterSpacing,
  children,
}: {
  cx: number;
  cy: number;
  fontSize: number;
  fill: string;
  strokeWidth: number;
  letterSpacing?: number;
  children: ReactNode;
}) {
  return (
    <text
      x={cx}
      y={cy + fontSize * INK_MIDDLE_EM}
      textAnchor="middle"
      fontFamily="Fredoka, Nunito, sans-serif"
      fontWeight={700}
      fontSize={fontSize}
      letterSpacing={letterSpacing}
      fill={fill}
      stroke={INK}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      paintOrder="stroke"
    >
      {children}
    </text>
  );
}

/** The one heart shape: centered on (cx, cy), about s wide on each side. */
export function heartPath(cx: number, cy: number, s: number) {
  const p = (x: number, y: number) => `${(cx + x * s).toFixed(1)} ${(cy + y * s).toFixed(1)}`;
  return `M${p(0, 0.9)} C${p(-0.2, 0.72)} ${p(-1, 0.28)} ${p(-1, -0.25)} C${p(-1, -0.78)} ${p(-0.3, -1)} ${p(0, -0.5)} C${p(0.3, -1)} ${p(1, -0.78)} ${p(1, -0.25)} C${p(1, 0.28)} ${p(0.2, 0.72)} ${p(0, 0.9)} Z`;
}

/** Tints for letter tiles, picked from the title so a task keeps the same color. */
const LETTER_TINTS = [
  ['#E6E6FF', INDIGO], ['#D6F8EC', '#16A076'], ['#FFE4E4', '#D64040'], ['#FFF0C2', '#E09600'],
  ['#DEF3FF', '#1270B0'], ['#EFE4FF', '#6334B8'], ['#FFE6F2', '#D9468F'], ['#FFE9D6', '#D9701A'],
] as const;

/**
 * The sticker shown when a quest, reward or goal has no picture: the first letter
 * of its title on a tinted tile. Square for quests, circle for rewards and goals.
 */
export function LetterTile({ title, shape, size = 64, className, ...rest }: ArtProps & { title: string; shape: 'square' | 'circle' }) {
  const letter = (title.trim()[0] ?? '?').toUpperCase();
  const hash = [...title].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  const [tint, color] = LETTER_TINTS[hash % LETTER_TINTS.length];
  const Tile = shape === 'square' ? QTile : RTile;
  return (
    <Tile size={size} className={className} rest={rest} tint={tint}>
      <InkText cx={50} cy={52} fontSize={52} fill={color} strokeWidth={4}>
        {letter}
      </InkText>
      <Twinkle cx={76} cy={24} r={7} />
    </Tile>
  );
}
