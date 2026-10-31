// Quest stickers, set B: self-care, learning, kindness and pets.
import { useId, type ReactElement } from 'react';
import type { QuestIconId } from '@kk/shared';
import type { ArtProps } from './types';
import { INK, INDIGO, GOLD, SHADE, MINT, CORAL, SKY, GRAPE, PINK, CREAM, ORANGE, BROWN, STEEL, NIGHT, Hi, Shadow, Twinkle, starPath, QTile, ink, thin, heartPath } from './sticker-kit';

const SKIN = '#FFD3B0';
const CHALK = '#2F8F6F';

const useUid = (prefix: string) => `kk-${prefix}-${useId().replace(/:/g, '')}`;

/** Small falling water drop with its tip at (x, y). */
const dropPath = (x: number, y: number, s = 1) =>
  `M${x} ${y}s${-3.5 * s} ${4.5 * s} ${-3.5 * s} ${7 * s}a${3.5 * s} ${3.5 * s} 0 0 0 ${7 * s} 0c0-${2.5 * s}-${3.5 * s}-${7 * s}-${3.5 * s}-${7 * s}z`;

/** Chunky heart centered near (cx, cy). */

function Bubble({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill="#fff" stroke={SKY} strokeWidth={r > 5 ? 3 : 2.5} />
      <Hi cx={cx - r * 0.35} cy={cy - r * 0.35} rx={r * 0.3} ry={r * 0.2} rot={-35} />
    </>
  );
}

/** Two dot eyes and a smile. */
function Face({ cx, cy, gap = 6, eye = 2.5, blush = true }: { cx: number; cy: number; gap?: number; eye?: number; blush?: boolean }) {
  return (
    <>
      <circle cx={cx - gap} cy={cy} r={eye} fill={INK} />
      <circle cx={cx + gap} cy={cy} r={eye} fill={INK} />
      {blush && <ellipse cx={cx - gap - 4} cy={cy + 4.5} rx={3} ry={1.8} fill={PINK} fillOpacity={0.85} />}
      {blush && <ellipse cx={cx + gap + 4} cy={cy + 4.5} rx={3} ry={1.8} fill={PINK} fillOpacity={0.85} />}
      <path d={`M${cx - 3.5} ${cy + 4}q3.5 3.5 7 0`} fill="none" {...thin} />
    </>
  );
}

// ---- Self-care ----

export function QuestShower({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#E0F4FF">
      <rect x="45" y="6" width="10" height="16" rx="4" fill={STEEL} {...ink} />
      <path d="M28 38a22 17 0 0 1 44 0z" fill={SKY} {...ink} />
      <Hi cx={40} cy={29} rx={6} ry={3} rot={-20} />
      <rect x="25" y="36" width="50" height="7" rx="3.5" fill={STEEL} {...ink} />
      <path d={dropPath(34, 49)} fill={SKY} {...thin} />
      <path d={dropPath(50, 50)} fill={SKY} {...thin} />
      <path d={dropPath(66, 49)} fill={SKY} {...thin} />
      <path d={dropPath(42, 61, 0.8)} fill={SKY} {...thin} />
      <path d={dropPath(58, 61, 0.8)} fill={SKY} {...thin} />
      <Shadow cx={66} cy={87} rx={16} />
      <ellipse cx="65" cy="78" rx="15" ry="8.5" fill={GOLD} {...ink} />
      <path d="M58 76q6 6 13 0" fill="none" stroke={SHADE} strokeWidth={2.5} strokeLinecap="round" />
      <circle cx="71" cy="65" r="7.5" fill={GOLD} {...ink} />
      <path d="M78 64l7 1.5-7 3z" fill={ORANGE} {...thin} />
      <circle cx="73" cy="63" r="1.8" fill={INK} />
      <Hi cx={68} cy={61.5} rx={2.5} ry={1.5} rot={-30} />
      <Bubble cx={25} cy={76} r={7} />
      <Bubble cx={37} cy={84} r={4} />
      <Bubble cx={18} cy={62} r={3.5} />
    </QTile>
  );
}

export function QuestDressed({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#FFEFE3">
      <path d="M45 15a5 5 0 1 1 5 5v6" fill="none" {...ink} />
      <path d="M50 26L22 42h56z" fill="none" {...ink} />
      <path
        d="M36 36l-16 9 7 13 8-4v28h30V54l8 4 7-13-16-9C60 44 40 44 36 36z"
        fill={SKY}
        {...ink}
      />
      <path d="M60 58v22" stroke={INK} strokeOpacity={0.12} strokeWidth={4} strokeLinecap="round" />
      <Hi cx={40} cy={52} rx={3} ry={7} />
      <path d={starPath(50, 62, 8)} fill={GOLD} {...thin} />
      <rect x="54" y="47" width="8" height="6" rx="2" fill="#fff" fillOpacity={0.6} />
      <Twinkle cx={80} cy={22} r={7} />
      <Twinkle cx={20} cy={24} r={4.5} fill="#fff" />
    </QTile>
  );
}

export function QuestHair({ size = 64, className, ...rest }: ArtProps) {
  const dots: [number, number][] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) dots.push([45 + c * 6, 23 + r * 7]);
  return (
    <QTile size={size} className={className} rest={rest} tint="#FFE8F4">
      <g transform="rotate(30 50 50)">
        <rect x="18" y="58" width="60" height="10" rx="4" fill={MINT} {...ink} />
        <path d="M24 68v10M30 68v10M36 68v10M42 68v10M48 68v10M54 68v10M60 68v10M66 68v10M72 68v10" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        <Hi cx={30} cy={61} rx={7} ry={1.5} />
      </g>
      <g transform="rotate(-35 51 50)">
        <rect x="46" y="54" width="10" height="34" rx="5" fill={CORAL} {...ink} />
        <ellipse cx="51" cy="33" rx="17" ry="22" fill={CORAL} {...ink} />
        <ellipse cx="51" cy="33" rx="11.5" ry="16" fill={PINK} />
        {dots.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={1.8} fill={INK} />
        ))}
        <Hi cx={41} cy={22} rx={2.5} ry={5} rot={-10} />
      </g>
      <Twinkle cx={80} cy={24} r={6} />
    </QTile>
  );
}

export function QuestHandwash({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#E0F7FF">
      <Shadow cx={46} cy={84} rx={28} />
      <rect x="20" y="52" width="52" height="28" rx="12" fill={PINK} {...ink} />
      <path d="M26 72h40" stroke={INK} strokeOpacity={0.1} strokeWidth={4} strokeLinecap="round" />
      <Hi cx={30} cy={58} rx={6} ry={2.5} rot={-10} />
      <Face cx={46} cy={64} />
      <Bubble cx={38} cy={40} r={9} />
      <Bubble cx={56} cy={32} r={7} />
      <Bubble cx={66} cy={45} r={5} />
      <Bubble cx={26} cy={26} r={4} />
      <Bubble cx={44} cy={18} r={3.5} />
      <path d={dropPath(82, 52, 1.1)} fill={SKY} {...thin} />
      <path d={dropPath(80, 68, 0.85)} fill={SKY} {...thin} />
      <Twinkle cx={78} cy={22} r={6} fill="#fff" />
    </QTile>
  );
}

export function QuestBedtime({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#E6E6FF">
      <path d="M36 14a16 16 0 1 0 18 22 13 13 0 1 1-18-22z" fill={GOLD} {...ink} />
      <Hi cx={30} cy={26} rx={2.5} ry={5} rot={20} />
      <path d="M60 16h10l-10 11h10" fill="none" stroke={INDIGO} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M76 30h7l-7 8h7" fill="none" stroke={INDIGO} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      <Shadow cy={86} rx={32} />
      <path
        d="M16 52q2-4 8-4h52q6 0 8 4-3 10 0 20-2 6-8 6H24q-6 0-8-6 3-10 0-20z"
        fill="#fff"
        {...ink}
      />
      <path d="M22 72q28 6 56 0" fill="none" stroke={INK} strokeOpacity={0.1} strokeWidth={4} strokeLinecap="round" />
      <path d="M40 60q3 3 6 0M54 60q3 3 6 0" fill="none" {...thin} />
      <ellipse cx="38" cy="66" rx="3" ry="1.8" fill={PINK} />
      <ellipse cx="62" cy="66" rx="3" ry="1.8" fill={PINK} />
      <path d="M48 67q2 2 4 0" fill="none" {...thin} />
      <Hi cx={28} cy={55} rx={6} ry={2.2} rot={-8} />
      <Twinkle cx={82} cy={50} r={5} fill="#fff" />
      <Twinkle cx={20} cy={40} r={4} />
    </QTile>
  );
}

export function QuestWakeup({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#FFF6D1">
      <Shadow cy={88} rx={24} />
      <path d="M34 76l-6 10M66 76l6 10" fill="none" {...ink} />
      <path d="M50 18v8" fill="none" {...ink} />
      <circle cx="28" cy="30" r="9" fill={GOLD} {...ink} />
      <circle cx="72" cy="30" r="9" fill={GOLD} {...ink} />
      <circle cx="50" cy="55" r="27" fill={CORAL} {...ink} />
      <Hi cx={36} cy={40} rx={6} ry={3} rot={-35} />
      <circle cx="50" cy="56" r="19" fill={CREAM} {...ink} />
      <path d="M50 40v3M50 69v3M34 56h3M63 56h3" stroke={INK} strokeOpacity={0.35} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M50 56v-9M50 56l6 3" fill="none" stroke={INDIGO} strokeWidth={2.5} strokeLinecap="round" />
      <circle cx="43" cy="56" r="2.2" fill={INK} />
      <circle cx="57" cy="56" r="2.2" fill={INK} />
      <path d="M45 62q5 5 10 0" fill="none" {...thin} />
      <ellipse cx="39" cy="61" rx="2.5" ry="1.5" fill={PINK} />
      <ellipse cx="61" cy="61" rx="2.5" ry="1.5" fill={PINK} />
      <path d="M12 26l-3-3M13 36H9M88 26l3-3M87 36h4" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
    </QTile>
  );
}

export function QuestVeggies({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#E4F9EE">
      <Shadow cy={84} rx={36} />
      <ellipse cx="50" cy="70" rx="38" ry="13" fill="#fff" {...ink} />
      <ellipse cx="50" cy="69" rx="26" ry="7.5" fill="none" stroke={STEEL} strokeWidth={3} />
      <g transform="rotate(35 64 52)">
        <path d="M58 40q6-4 12 0l-3.5 32q-2.5 4-5 0z" fill={ORANGE} {...ink} />
        <path d="M60 50h4M62 58h3M60 64h3" stroke={INK} strokeOpacity={0.4} strokeWidth={2} strokeLinecap="round" />
        <path d="M64 39c-2-6-6-8-9-8 1 4 4 7 9 8zM64 39c2-6 6-8 9-8-1 4-4 7-9 8zM64 39v-9" fill={MINT} {...thin} />
        <Hi cx={61} cy={46} rx={1.4} ry={4} />
      </g>
      <path d="M33 72l3-18h8l3 18z" fill="#BDF2D7" {...ink} />
      <circle cx="30" cy="48" r="9" fill={MINT} {...ink} />
      <circle cx="49" cy="47" r="9" fill={MINT} {...ink} />
      <circle cx="40" cy="38" r="11" fill={MINT} {...ink} />
      <Hi cx={36} cy={33} rx={3.5} ry={2} rot={-30} />
      <circle cx="36" cy="44" r="2" fill={INK} />
      <circle cx="44" cy="44" r="2" fill={INK} />
      <path d="M38 48q2 2 4 0" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <Twinkle cx={80} cy={24} r={6} />
    </QTile>
  );
}

export function QuestWater({ size = 64, className, ...rest }: ArtProps) {
  const clip = useUid('glass');
  const glass = 'M28 22h40l-5 58a6 6 0 0 1-6 5H39a6 6 0 0 1-6-5z';
  return (
    <QTile size={size} className={className} rest={rest} tint="#E0F4FF">
      <defs>
        <clipPath id={clip}>
          <path d={glass} />
        </clipPath>
      </defs>
      <Shadow cx={48} cy={88} rx={20} />
      <path d={glass} fill="#fff" />
      <g clipPath={`url(#${clip})`}>
        <path d="M20 42q7-4 14 0t14 0 14 0 14 0V92H20z" fill={SKY} />
        <circle cx="42" cy="58" r="2.5" fill="#fff" fillOpacity={0.7} />
        <circle cx="54" cy="68" r="3" fill="#fff" fillOpacity={0.7} />
        <circle cx="46" cy="76" r="2" fill="#fff" fillOpacity={0.7} />
        <path d="M62 46l-4 36" stroke={INK} strokeOpacity={0.12} strokeWidth={5} strokeLinecap="round" />
      </g>
      <path d={glass} fill="none" {...ink} />
      <Hi cx={35} cy={36} rx={2.5} ry={9} rot={-4} />
      <path d={dropPath(80, 30, 1.8)} fill={SKY} {...ink} />
      <Hi cx={77.5} cy={41} rx={1.6} ry={2.8} rot={20} />
      <Twinkle cx={20} cy={20} r={6} fill="#fff" />
    </QTile>
  );
}

export function QuestNoscreens({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#F0E6FF">
      <Shadow cx={48} cy={86} rx={24} />
      <rect x="24" y="14" width="48" height="68" rx="9" fill={NIGHT} {...ink} />
      <rect x="29.5" y="21" width="37" height="50" rx="4" fill="#4A4FA8" />
      <circle cx="48" cy="76" r="2.5" fill={STEEL} />
      <path d="M36 42q3.5 3.5 7 0M53 42q3.5 3.5 7 0" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
      <ellipse cx="48" cy="52" rx="2.5" ry="2" fill="#fff" />
      <path d="M52 28h5l-5 5h5M59 22h4l-4 4h4" fill="none" stroke="#fff" strokeOpacity={0.8} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Hi cx={33} cy={28} rx={2} ry={5} />
      <circle cx="72" cy="70" r="13" fill={CORAL} {...ink} />
      <path d="M72 62.5v7M66.5 64.5a7.5 7.5 0 1 0 11 0" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
      <Twinkle cx={82} cy={28} r={6} />
    </QTile>
  );
}

// ---- Learning ----

export function QuestMath({ size = 64, className, ...rest }: ArtProps) {
  const two = (x: number, y: number) => `M${x} ${y + 3}q0-4 4-4t4 4q0 3-8 9h8`;
  const chalk = { fill: 'none', stroke: '#fff', strokeWidth: 2.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <QTile size={size} className={className} rest={rest} tint="#E4F9EE">
      <path d="M30 70l-7 16M70 70l7 16" fill="none" {...ink} />
      <rect x="13" y="18" width="74" height="54" rx="7" fill={BROWN} {...ink} />
      <rect x="19" y="24" width="62" height="42" rx="3" fill={CHALK} {...thin} />
      <path d={two(25, 33)} {...chalk} />
      <path d="M37 39h8M41 35v8" {...chalk} />
      <path d={two(49, 33)} {...chalk} />
      <path d="M60 37h7M60 41h7" {...chalk} />
      <path d="M77 45V33l-6 8h8" {...chalk} />
      <path d="M26 54h6M45 50l6 8M51 50l-6 8" {...chalk} strokeOpacity={0.55} />
      <path d={starPath(67, 55, 6)} fill={GOLD} {...thin} />
      <rect x="36" y="64" width="12" height="4" rx="2" fill="#fff" {...thin} />
      <Hi cx={20} cy={22} rx={4} ry={1.4} />
      <Twinkle cx={86} cy={14} r={5} />
    </QTile>
  );
}

export function QuestWriting({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#E3F0FF">
      <path d="M18 84h48" stroke={INK} strokeOpacity={0.12} strokeWidth={3} strokeLinecap="round" />
      <rect x="16" y="18" width="52" height="64" rx="6" fill="#fff" {...ink} />
      <path d="M24 36h36M24 50h36M24 64h36" stroke={STEEL} strokeWidth={2} strokeLinecap="round" />
      {[26, 38, 50, 62, 74].map((y) => (
        <rect key={y} x="11" y={y - 2.5} width="10" height="5" rx="2.5" fill={STEEL} {...thin} />
      ))}
      <path d="M26 32c2-6 5-6 5-2s-3 4-1 4 3-6 6-4-1 4 2 4 3-5 5-4 1 4 4 3" fill="none" stroke={INDIGO} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26 46c2-6 5-6 5-2s-3 4-1 4 3-6 6-4-1 4 2 4 3-5 5-3" fill="none" stroke={CORAL} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <g transform="rotate(40 70 45)">
        <rect x="64" y="30" width="12" height="28" rx="2" fill={GRAPE} {...ink} />
        <path d="M70 34v21" stroke="#fff" strokeOpacity={0.4} strokeWidth={2} strokeLinecap="round" />
        <rect x="64" y="20" width="12" height="10" rx="4" fill={PINK} {...ink} />
        <rect x="63" y="27" width="14" height="6" rx="2" fill={STEEL} {...thin} />
        <path d="M64 58l6 10 6-10z" fill={CREAM} {...ink} />
        <path d="M68.2 65l1.8 3 1.8-3z" fill={INK} />
      </g>
      <Twinkle cx={82} cy={78} r={6} />
    </QTile>
  );
}

export function QuestScience({ size = 64, className, ...rest }: ArtProps) {
  const clip = useUid('flask');
  const flask = 'M41 20h18v20l17 32a7 7 0 0 1-6 10H30a7 7 0 0 1-6-10l17-32z';
  return (
    <QTile size={size} className={className} rest={rest} tint="#F0E6FF">
      <defs>
        <clipPath id={clip}>
          <path d={flask} />
        </clipPath>
      </defs>
      <Shadow cy={86} rx={26} />
      <path d={flask} fill="#fff" />
      <g clipPath={`url(#${clip})`}>
        <path d="M14 58q6-4 12 0t12 0 12 0 12 0 12 0 12 0V92H14z" fill={MINT} />
        <circle cx="58" cy="66" r="3" fill="#fff" fillOpacity={0.7} />
        <circle cx="64" cy="74" r="2" fill="#fff" fillOpacity={0.7} />
      </g>
      <path d={flask} fill="none" {...ink} />
      <rect x="37" y="15" width="26" height="7" rx="3.5" fill={STEEL} {...ink} />
      <Hi cx={45} cy={30} rx={1.6} ry={5} />
      <Face cx={46} cy={70} gap={5} eye={2.2} />
      <circle cx="50" cy="32" r="2.5" fill={MINT} fillOpacity={0.7} />
      <circle cx="68" cy="22" r="5.5" fill={GRAPE} {...thin} />
      <circle cx="78" cy="12" r="3.5" fill={PINK} {...thin} />
      <circle cx="26" cy="26" r="4" fill={MINT} {...thin} />
      <Twinkle cx={82} cy={40} r={6} />
    </QTile>
  );
}

export function QuestLanguage({ size = 64, className, ...rest }: ArtProps) {
  const letter = { fill: 'none', stroke: '#fff', strokeWidth: 4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <QTile size={size} className={className} rest={rest} tint="#FFF0E0">
      <path d="M24 50l-4 12 14-8z" fill={SKY} {...ink} />
      <rect x="12" y="16" width="46" height="36" rx="13" fill={SKY} {...ink} />
      <path d="M24 49.5l8-0.5" stroke={SKY} strokeWidth={4} strokeLinecap="round" />
      <Hi cx={22} cy={22} rx={6} ry={2.2} rot={-8} />
      <path d="M27 44l8-20 8 20M30 37h10" {...letter} />
      <path d="M76 78l4 12-14-8z" fill={CORAL} {...ink} />
      <rect x="42" y="46" width="46" height="34" rx="13" fill={CORAL} {...ink} />
      <path d="M68 79.5l8 0.5" stroke={CORAL} strokeWidth={4} strokeLinecap="round" />
      <Hi cx={52} cy={52} rx={6} ry={2.2} rot={-8} />
      <path d="M54 63h5.5a4.5 4.5 0 0 0 0-9H54v18h6.5a4.5 4.5 0 0 0 0-9" {...letter} />
      <path d="M80 57a7 9 0 1 0 0 12" {...letter} />
      <Twinkle cx={78} cy={22} r={7} />
      <Twinkle cx={22} cy={78} r={5} fill="#fff" />
    </QTile>
  );
}

export function QuestCoding({ size = 64, className, ...rest }: ArtProps) {
  const code = { fill: 'none', stroke: MINT, strokeWidth: 4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <QTile size={size} className={className} rest={rest} tint="#E3F0FF">
      <Shadow cy={84} rx={36} />
      <rect x="19" y="18" width="62" height="46" rx="7" fill={NIGHT} {...ink} />
      <rect x="24" y="23" width="52" height="36" rx="3" fill="#3D4290" />
      <path d="M38 33l-8 8 8 8M62 33l8 8-8 8" {...code} />
      <path d="M54 30l-8 22" {...code} stroke={GOLD} />
      <Hi cx={28} cy={27} rx={4} ry={1.5} />
      <path d="M10 64h80l-5 12a4 4 0 0 1-4 3H19a4 4 0 0 1-4-3z" fill={STEEL} {...ink} />
      <rect x="42" y="66" width="16" height="4" rx="2" fill={INK} fillOpacity={0.2} />
      <Twinkle cx={86} cy={16} r={6} />
      <Twinkle cx={12} cy={30} r={4} fill="#fff" />
    </QTile>
  );
}

export function QuestPuzzle({ size = 64, className, ...rest }: ArtProps) {
  // 30x30 piece with a knob on the top and right edges; optional hole on the left edge.
  const piece = (x: number, y: number, hole: boolean) =>
    `M${x} ${y}h10a6 6 0 1 1 10 0h10v10a6 6 0 1 1 0 10v10h-30` + (hole ? 'v-10a6 6 0 1 0 0-10z' : 'z');
  return (
    <QTile size={size} className={className} rest={rest} tint="#FFF6D1">
      <Shadow cx={50} cy={84} rx={34} />
      <path d={piece(14, 46, false)} fill={CORAL} {...ink} />
      <Hi cx={22} cy={52} rx={2} ry={5} />
      <Face cx={29} cy={62} gap={5} eye={2.2} blush={false} />
      <g transform="rotate(12 66 50)">
        <path d={piece(52, 36, true)} fill={SKY} {...ink} />
        <Hi cx={60} cy={42} rx={2} ry={5} />
        <Face cx={68} cy={52} gap={5} eye={2.2} blush={false} />
      </g>
      <Twinkle cx={50} cy={34} r={6} />
      <Twinkle cx={24} cy={24} r={4.5} fill="#fff" />
      <Twinkle cx={82} cy={78} r={4} fill={PINK} />
    </QTile>
  );
}

export function QuestDrawing({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#FFE8F4">
      <path
        d="M48 16c22 0 38 12 38 28 0 10-8 14-16 12-7-2-11 3-9 9 2 9-4 16-15 16-20 0-34-14-34-32s15-33 36-33z"
        fill={CREAM}
        {...ink}
      />
      <Hi cx={30} cy={30} rx={6} ry={3} rot={-35} />
      <circle cx="32" cy="44" r="6" fill={CORAL} {...thin} />
      <circle cx="46" cy="30" r="6" fill={GOLD} {...thin} />
      <circle cx="64" cy="32" r="6" fill={MINT} {...thin} />
      <circle cx="34" cy="62" r="6" fill={SKY} {...thin} />
      <circle cx="50" cy="68" r="5" fill={GRAPE} {...thin} />
      <g transform="rotate(40 70 64)">
        <rect x="66" y="58" width="8" height="32" rx="4" fill={INDIGO} {...ink} />
        <rect x="65" y="49" width="10" height="10" rx="2" fill={STEEL} {...ink} />
        <path d="M65 49q0-10 5-17 5 7 5 17z" fill={CORAL} {...ink} />
      </g>
      <Twinkle cx={82} cy={18} r={6} />
    </QTile>
  );
}

// ---- Kindness ----

export function QuestSibling({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#FFEFE3">
      <Shadow cy={88} rx={32} />
      <path d="M31 72v13M41 72v13M62 76v9M70 76v9" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <path d="M46 58q6 6 10 6" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
      <path d="M46 58q6 6 10 6" fill="none" stroke={SKY} strokeWidth={2.5} strokeLinecap="round" />
      <rect x="24" y="46" width="24" height="30" rx="10" fill={SKY} {...ink} />
      <Hi cx={29} cy={54} rx={2} ry={5} />
      <rect x="56" y="58" width="20" height="21" rx="8" fill={CORAL} {...ink} />
      <circle cx="54" cy="64" r="4.5" fill={SKIN} {...thin} />
      <circle cx="36" cy="32" r="13" fill={SKIN} {...ink} />
      <path d="M23.5 30a12.5 12.5 0 0 1 25 0q-8-6-14-2-6 4-11 2z" fill={BROWN} {...thin} />
      <Face cx={36} cy={35} gap={4.5} eye={2} />
      <circle cx="66" cy="47" r="10.5" fill={SKIN} {...ink} />
      <path d="M56 45a10 10 0 0 1 20 0q-6-4-10-1-5 3-10 1z" fill={GOLD} {...thin} />
      <circle cx="58" cy="38" r="3.5" fill={GOLD} {...thin} />
      <circle cx="74" cy="38" r="3.5" fill={GOLD} {...thin} />
      <Face cx={66} cy={49} gap={3.5} eye={1.8} />
      <path d={heartPath(54, 20, 7)} fill={PINK} {...thin} />
      <Twinkle cx={82} cy={24} r={5} />
    </QTile>
  );
}

export function QuestKindness({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#FFE8F4">
      <path d={heartPath(50, 46, 22)} fill={CORAL} {...ink} />
      <Hi cx={36} cy={34} rx={6} ry={3.5} rot={-35} />
      <Face cx={50} cy={46} gap={6} eye={2.6} />
      <path d="M10 70q8-6 20-2l16 8q4 3 0 7H26q-10 0-14-6z" fill={SKIN} {...ink} />
      <path d="M90 70q-8-6-20-2l-16 8q-4 3 0 7h20q10 0 14-6z" fill={SKIN} {...ink} />
      <path d="M28 76q4 1 6 3M72 76q-4 1-6 3" fill="none" stroke={INK} strokeOpacity={0.3} strokeWidth={2} strokeLinecap="round" />
      <Twinkle cx={80} cy={22} r={7} />
      <Twinkle cx={20} cy={24} r={5} fill="#fff" />
      <Twinkle cx={84} cy={48} r={4} fill={PINK} />
    </QTile>
  );
}

export function QuestCall({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#E4F9EE">
      <Shadow cx={48} cy={88} rx={20} />
      <rect x="28" y="12" width="40" height="74" rx="9" fill={INDIGO} {...ink} />
      <rect x="33" y="20" width="30" height="56" rx="4" fill="#fff" />
      <rect x="42" y="15.5" width="12" height="2.5" rx="1.25" fill={INK} fillOpacity={0.4} />
      <circle cx="40" cy="31" r="4" fill={STEEL} {...thin} />
      <circle cx="56" cy="31" r="4" fill={STEEL} {...thin} />
      <circle cx="48" cy="40" r="10" fill={SKIN} {...thin} />
      <path d="M38 38a10 10 0 0 1 20 0q-10-5-20 0z" fill={STEEL} {...thin} />
      <circle cx="44" cy="42" r="3" fill="none" stroke={INK} strokeWidth={1.8} />
      <circle cx="52" cy="42" r="3" fill="none" stroke={INK} strokeWidth={1.8} />
      <path d="M47 42h2M45 47q3 2.5 6 0" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
      <path d="M38 56h20" stroke={STEEL} strokeWidth={3} strokeLinecap="round" />
      <circle cx="48" cy="67" r="6" fill={MINT} {...thin} />
      <path d="M45 66q3 3.5 6 0" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
      <Hi cx={32} cy={24} rx={1.5} ry={5} />
      <path d={heartPath(80, 24, 8)} fill={CORAL} {...thin} />
      <path d="M18 40q-4 6 0 12M12 36q-6 10 0 20M76 46q4 6 0 12M82 42q6 10 0 20" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
    </QTile>
  );
}

export function QuestThankyou({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#FFF0E0">
      <Shadow cy={86} rx={34} />
      <g transform="rotate(-6 50 34)">
        <rect x="26" y="16" width="48" height="36" rx="4" fill={GOLD} {...ink} />
        <path d="M34 26c2-5 4-5 4-2s-2 4 0 4 3-5 5-3-1 3 1 3 3-4 5-3M34 34h24" fill="none" stroke={INK} strokeOpacity={0.45} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        <Twinkle cx={64} cy={26} r={4} fill="#fff" />
      </g>
      <rect x="14" y="40" width="72" height="42" rx="6" fill="#fff" {...ink} />
      <path d="M16 80l26-20M84 80L58 60" fill="none" stroke={INK} strokeOpacity={0.15} strokeWidth={3} strokeLinecap="round" />
      <path d="M15 44l35 24 35-24" fill="none" {...ink} />
      <Hi cx={24} cy={74} rx={5} ry={1.8} />
      <path d={heartPath(50, 66, 9)} fill={CORAL} {...thin} />
      <Hi cx={45} cy={62} rx={2} ry={1.2} rot={-35} />
      <Twinkle cx={84} cy={22} r={6} />
      <Twinkle cx={16} cy={24} r={4} fill="#fff" />
    </QTile>
  );
}

export function QuestShare({ size = 64, className, ...rest }: ArtProps) {
  const chip = '#8E4F1F';
  return (
    <QTile size={size} className={className} rest={rest} tint="#FFF3D6">
      <Shadow cy={88} rx={30} />
      <path d="M40 22a20 20 0 0 0 0 40l3-6-4-6 4-6-4-6 4-6-4-6z" fill={BROWN} {...ink} />
      <g transform="rotate(12 60 42)">
        <path d="M60 22a20 20 0 0 1 0 40l-3-6 4-6-4-6 4-6-4-6 4-6z" fill={BROWN} {...ink} />
        <circle cx="68" cy="34" r="2.8" fill={chip} />
        <circle cx="71" cy="48" r="2.2" fill={chip} />
        <circle cx="63" cy="54" r="2.8" fill={chip} />
      </g>
      <circle cx="30" cy="34" r="2.8" fill={chip} />
      <circle cx="34" cy="48" r="2.8" fill={chip} />
      <circle cx="26" cy="46" r="2" fill={chip} />
      <Hi cx={30} cy={28} rx={4} ry={2} rot={-35} />
      <path d="M30 90L26 66" fill="none" stroke={INK} strokeWidth={14} strokeLinecap="round" />
      <path d="M30 90L26 66" fill="none" stroke={SKY} strokeWidth={8.5} strokeLinecap="round" />
      <path d="M70 90L76 66" fill="none" stroke={INK} strokeWidth={14} strokeLinecap="round" />
      <path d="M70 90L76 66" fill="none" stroke={CORAL} strokeWidth={8.5} strokeLinecap="round" />
      <circle cx="26" cy="60" r="7" fill={SKIN} {...thin} />
      <path d="M29 54q4 0 4 4" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <circle cx="76" cy="60" r="7" fill={SKIN} {...thin} />
      <path d="M73 54q-4 0-4 4" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <circle cx="50" cy="68" r="2" fill={BROWN} />
      <circle cx="47" cy="75" r="1.5" fill={BROWN} />
      <circle cx="53" cy="80" r="1.5" fill={BROWN} />
      <path d={heartPath(50, 14, 6)} fill={PINK} {...thin} />
      <Twinkle cx={84} cy={22} r={5} />
      <Twinkle cx={16} cy={22} r={4} fill="#fff" />
    </QTile>
  );
}

// ---- Pets ----

export function QuestFish({ size = 64, className, ...rest }: ArtProps) {
  const clip = useUid('bowl');
  const bowl = 'M36 22h28v6c12 6 20 15 20 28a34 28 0 0 1-68 0c0-13 8-22 20-28z';
  return (
    <QTile size={size} className={className} rest={rest} tint="#E0F4FF">
      <defs>
        <clipPath id={clip}>
          <path d={bowl} />
        </clipPath>
      </defs>
      <Shadow cy={86} rx={28} />
      <path d={bowl} fill="#fff" />
      <g clipPath={`url(#${clip})`}>
        <path d="M10 42q7-4 14 0t14 0 14 0 14 0 14 0 14 0V92H10z" fill="#9EE3F7" />
        <circle cx="30" cy="80" r="5" fill={GOLD} />
        <circle cx="40" cy="83" r="5" fill={PINK} />
        <circle cx="62" cy="82" r="5" fill={MINT} />
        <circle cx="72" cy="78" r="5" fill={GOLD} />
        <path d="M70 76c-4-8 2-14-2-22M74 76c2-6-2-10 2-16" fill="none" stroke={MINT} strokeWidth={4} strokeLinecap="round" />
      </g>
      <path d={bowl} fill="none" {...ink} />
      <rect x="32" y="17" width="36" height="7" rx="3.5" fill={STEEL} {...ink} />
      <Hi cx={24} cy={52} rx={3} ry={8} rot={10} />
      <path d="M58 60l12-8v18z" fill={ORANGE} {...ink} />
      <ellipse cx="46" cy="61" rx="15" ry="11" fill={ORANGE} {...ink} />
      <path d="M44 51q4-6 9 0" fill={ORANGE} {...thin} />
      <circle cx="39" cy="59" r="2.6" fill={INK} />
      <circle cx="39.8" cy="58.2" r="0.9" fill="#fff" />
      <path d="M35 65q2 1.5 4 0" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <path d="M50 54q3 7 0 14" fill="none" stroke={INK} strokeOpacity={0.25} strokeWidth={2} strokeLinecap="round" />
      <circle cx="30" cy="44" r="3" fill="#fff" stroke={SKY} strokeWidth={2} />
      <circle cx="26" cy="34" r="2" fill="#fff" stroke={SKY} strokeWidth={2} />
      <Twinkle cx={82} cy={22} r={6} />
    </QTile>
  );
}

export function QuestLitter({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#F0E6FF">
      <Shadow cx={50} cy={87} rx={36} />
      <path d="M84 80c8-2 8-14 0-16" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
      <path d="M84 80c8-2 8-14 0-16" fill="none" stroke={ORANGE} strokeWidth={3.5} strokeLinecap="round" />
      <ellipse cx="72" cy="72" rx="14" ry="13" fill={ORANGE} {...ink} />
      <path d="M60 40l1-14 10 8zM84 40l-1-14-10 8z" fill={ORANGE} {...ink} />
      <path d="M63 34l0.5-4 3 2.5zM81 34l-0.5-4-3 2.5z" fill={PINK} />
      <circle cx="72" cy="47" r="13" fill={ORANGE} {...ink} />
      <path d="M68 35l1 4M76 35l-1 4" stroke={BROWN} strokeWidth={2.5} strokeLinecap="round" />
      <circle cx="67" cy="47" r="2.2" fill={INK} />
      <circle cx="77" cy="47" r="2.2" fill={INK} />
      <path d="M70 51.5q2 2 4 0" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <ellipse cx="63.5" cy="52" rx="2.5" ry="1.5" fill={PINK} />
      <ellipse cx="80.5" cy="52" rx="2.5" ry="1.5" fill={PINK} />
      <path d="M14 66q5-6 10 0t10 0 10 0 10 0 10 0z" fill={GOLD} {...thin} />
      <path d="M10 66h58l-5 16a4 4 0 0 1-4 3H19a4 4 0 0 1-4-3z" fill={INDIGO} {...ink} />
      <rect x="8" y="63" width="62" height="7" rx="3.5" fill={INDIGO} {...ink} />
      <Hi cx={18} cy={66.5} rx={5} ry={1.4} />
      <circle cx="39" cy="77" r="3" fill="#fff" fillOpacity={0.6} />
      <g transform="rotate(-25 36 36)">
        <rect x="33" y="12" width="6" height="22" rx="3" fill={CORAL} {...ink} />
        <path d="M25 34h22l-2 14a4 4 0 0 1-4 3H31a4 4 0 0 1-4-3z" fill={MINT} {...ink} />
        <path d="M31 38v8M36 38v9M41 38v8" stroke={INK} strokeOpacity={0.45} strokeWidth={2} strokeLinecap="round" />
      </g>
      <Twinkle cx={16} cy={26} r={5} />
    </QTile>
  );
}

export function QuestGroom({ size = 64, className, ...rest }: ArtProps) {
  const dots: [number, number][] = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) dots.push([41 + c * 6.5, 30 + r * 5.5]);
  return (
    <QTile size={size} className={className} rest={rest} tint="#FFF3D6">
      <Shadow cx={30} cy={86} rx={18} />
      <path
        d="M14 78c-2-6 3-10 7-8 0-6 7-9 11-5 3-5 11-4 12 2 5 0 7 6 4 9 3 4 0 9-5 8-2 4-8 5-11 2-4 3-10 2-11-2-5 0-8-3-7-6z"
        fill="#FFE2A8"
        {...thin}
      />
      <path d="M22 74q3-4 7-2M33 70q4-3 8 0M26 80q4-3 8-1M38 78q3-3 6 0" fill="none" stroke={SHADE} strokeWidth={2.2} strokeLinecap="round" />
      <path d="M12 68q-2-5 2-8M48 66q3-4 1-8" fill="none" stroke={SHADE} strokeWidth={2.2} strokeLinecap="round" />
      <g transform="rotate(-35 54 46)">
        <rect x="49" y="48" width="10" height="36" rx="5" fill={CORAL} {...ink} />
        <Hi cx={52} cy={60} rx={1.4} ry={6} />
        <rect x="34" y="24" width="40" height="26" rx="8" fill={SKY} {...ink} />
        <rect x="38" y="28" width="32" height="15" rx="4" fill="#fff" />
        {dots.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={1.5} fill={INK} />
        ))}
        <path d="M38 46.5h32" stroke={INK} strokeOpacity={0.12} strokeWidth={3} strokeLinecap="round" />
      </g>
      <g fill={INK}>
        <ellipse cx="78" cy="30" rx="6" ry="5" />
        <circle cx="70" cy="22" r="2.8" />
        <circle cx="76" cy="18.5" r="2.8" />
        <circle cx="82.5" cy="19.5" r="2.8" />
        <circle cx="87" cy="25" r="2.8" />
      </g>
      <path d={heartPath(80, 60, 6)} fill={PINK} {...thin} />
      <Twinkle cx={18} cy={30} r={5} />
    </QTile>
  );
}

export const MORE_QUEST_ART_B = {
  shower: QuestShower,
  dressed: QuestDressed,
  hair: QuestHair,
  handwash: QuestHandwash,
  bedtime: QuestBedtime,
  wakeup: QuestWakeup,
  veggies: QuestVeggies,
  water: QuestWater,
  noscreens: QuestNoscreens,
  math: QuestMath,
  writing: QuestWriting,
  science: QuestScience,
  language: QuestLanguage,
  coding: QuestCoding,
  puzzle: QuestPuzzle,
  drawing: QuestDrawing,
  sibling: QuestSibling,
  kindness: QuestKindness,
  call: QuestCall,
  thankyou: QuestThankyou,
  share: QuestShare,
  fish: QuestFish,
  litter: QuestLitter,
  groom: QuestGroom,
} satisfies Partial<Record<QuestIconId, (p: ArtProps) => ReactElement>>;

export const MORE_QUEST_LABELS_B = {
  shower: 'Take a shower',
  dressed: 'Get dressed',
  hair: 'Brush your hair',
  handwash: 'Wash your hands',
  bedtime: 'Lights out on time',
  wakeup: 'Wake up on time',
  veggies: 'Eat your veggies',
  water: 'Drink your water',
  noscreens: 'No screens today',
  math: 'Practice math',
  writing: 'Practice writing',
  science: 'Do a science activity',
  language: 'Practice a language',
  coding: 'Practice coding',
  puzzle: 'Solve a puzzle',
  drawing: 'Draw or paint',
  sibling: 'Help your sibling',
  kindness: 'Do something kind',
  call: 'Call Grandma',
  thankyou: 'Write a thank-you note',
  share: 'Share with someone',
  fish: 'Feed the fish',
  litter: 'Scoop the litter box',
  groom: 'Brush the pet',
} satisfies Partial<Record<QuestIconId, string>>;
