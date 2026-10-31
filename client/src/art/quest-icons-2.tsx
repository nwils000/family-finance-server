// More quest stickers (set A): extra chores and outside quests.
// Drawn with the shared sticker kit so they sit right next to the core quest set.
import { useId, type ReactElement } from 'react';
import type { QuestIconId } from '@kk/shared';
import type { ArtProps } from './types';
import { INK, INDIGO, GOLD, SHADE, MINT, CORAL, SKY, GRAPE, PINK, CREAM, ORANGE, BROWN, STEEL, NIGHT, Hi, Shadow, Twinkle, starPath, QTile, ink, thin } from './sticker-kit';

// ---- Small local helpers ----

/** Clip id for drawing ground or water that runs off the tile edge. */
function useTileClip(name: string) {
  return `kk-q2-${name}-${useId().replace(/:/g, '')}`;
}

function TileClip({ id }: { id: string }) {
  return (
    <defs>
      <clipPath id={id}>
        <rect x="4" y="4" width="92" height="92" rx="26" />
      </clipPath>
    </defs>
  );
}

/** A thick INK line with a colored core, for handles, frames and hoses. */
function Tube({ d, color, w = 4.5 }: { d: string; color: string; w?: number }) {
  return (
    <>
      <path d={d} fill="none" stroke={INK} strokeWidth={w + 5} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

/** Spray bottle, 30 wide by 46 tall, nozzle pointing left from (x, y). */
function Spray({ x, y, fill }: { x: number; y: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx="-9" cy="4" r="1.8" fill={SKY} />
      <circle cx="-14" cy="0" r="1.5" fill={SKY} />
      <circle cx="-14" cy="8" r="1.5" fill={SKY} />
      <circle cx="-18" cy="4" r="1.2" fill={SKY} />
      <rect x="-5" y="2" width="10" height="5" rx="2" fill={CORAL} {...thin} />
      <path d="M8 10q-5 5 -1 11" fill="none" {...thin} />
      <rect x="2" y="0" width="20" height="11" rx="4" fill={CORAL} {...ink} />
      <rect x="8" y="11" width="10" height="6" fill={STEEL} {...thin} />
      <rect x="2" y="16" width="22" height="30" rx="7" fill={fill} {...ink} />
      <rect x="6" y="25" width="14" height="12" rx="3" fill="#fff" fillOpacity={0.75} />
      <Hi cx={7} cy={21} rx={2} ry={3} />
    </g>
  );
}

/** Little leaf centered on (x, y). */
function Leaf({ x, y, rot, fill }: { x: number; y: number; rot: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d="M0 -9C7 -5 7 4 0 9C-7 4 -7 -5 0 -9Z" fill={fill} {...thin} />
      <path d="M0 -6V7" stroke={INK} strokeOpacity={0.35} strokeWidth={1.8} strokeLinecap="round" />
    </g>
  );
}

/** Six-arm snowflake. */
function Flake({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  let d = '';
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI) / 3 + Math.PI / 2;
    const dx = r * Math.cos(a);
    const dy = r * Math.sin(a);
    d += `M${(cx - dx).toFixed(1)} ${(cy - dy).toFixed(1)}L${(cx + dx).toFixed(1)} ${(cy + dy).toFixed(1)}`;
  }
  return (
    <>
      <path d={d} stroke={INK} strokeWidth={5.5} strokeLinecap="round" />
      <path d={d} stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
    </>
  );
}

/** Three chasing arrows around (cx, cy). */
function recyclePath(cx: number, cy: number, r: number) {
  let d = '';
  for (let k = 0; k < 3; k++) {
    const a0 = (-90 + k * 120 + 14) * (Math.PI / 180);
    const a1 = (-90 + k * 120 + 92) * (Math.PI / 180);
    const p = (a: number, rr = r) => `${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`;
    d += `M${p(a0)}A${r} ${r} 0 0 1 ${p(a1)}`;
    // arrowhead
    const back = a1 - 0.45;
    d += `M${p(back, r + 4)}L${p(a1)}L${p(back, r - 4)}`;
  }
  return d;
}

// ---- Chores ----

export function QuestDust({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#FFEAF4">
      <g transform="rotate(-30 50 50)">
        <rect x="46" y="54" width="8" height="36" rx="4" fill={BROWN} {...ink} />
        <Hi cx={48.5} cy={64} rx={1.4} ry={5} />
        <path d="M40 36C30 30 28 14 34 8c6 4 10 14 8 26z" fill={GRAPE} {...ink} />
        <path d="M60 36C70 30 72 14 66 8c-6 4-10 14-8 26z" fill={CORAL} {...ink} />
        <path d="M50 52C38 46 36 22 50 10c14 12 12 36 0 42z" fill={PINK} {...ink} />
        <path d="M50 16v32M44 30l6 6 6-6M45 40l5 5 5-5" fill="none" stroke={INK} strokeOpacity={0.3} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <Hi cx={45} cy={24} rx={2.5} ry={6} rot={-10} />
        <rect x="43" y="48" width="14" height="9" rx="3.5" fill={GOLD} {...ink} />
      </g>
      <circle cx="74" cy="72" r="6" fill={CREAM} {...thin} />
      <circle cx="84" cy="62" r="4" fill={CREAM} {...thin} />
      <circle cx="82" cy="80" r="3" fill={CREAM} {...thin} />
      <Twinkle cx={78} cy={28} r={7} />
      <Twinkle cx={66} cy={16} r={4} fill="#fff" />
    </QTile>
  );
}

export function QuestMop({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#E3F7FD">
      <ellipse cx="34" cy="86" rx="22" ry="4" fill={SKY} fillOpacity={0.35} />
      <Shadow cx={68} cy={86} rx={20} />
      <g transform="rotate(-14 30 50)">
        <rect x="27" y="10" width="7" height="58" rx="3.5" fill={ORANGE} {...ink} />
        <Hi cx={29.5} cy={22} rx={1.2} ry={6} />
        <path d="M16 72h29l3 12q-3 4-6 0q-3 4-6 0q-3 4-6 0q-3 4-6 0q-3 4-6 0z" fill={CREAM} {...ink} />
        <path d="M24 74v8M30.5 74v8M37 74v8" stroke={INK} strokeOpacity={0.2} strokeWidth={2} strokeLinecap="round" />
        <rect x="20" y="64" width="21" height="9" rx="3.5" fill={MINT} {...ink} />
      </g>
      <path d="M54 56q14-22 28 0" fill="none" {...ink} />
      <path d="M52 58h32l-3.5 24a4 4 0 0 1-4 3.5h-17a4 4 0 0 1-4-3.5z" fill={GOLD} {...ink} />
      <path d="M78 62l-3 20" stroke={INK} strokeOpacity={0.12} strokeWidth={4} strokeLinecap="round" />
      <ellipse cx="68" cy="58" rx="17" ry="4" fill={SKY} {...thin} />
      <circle cx="62" cy="51" r="4" fill="#fff" {...thin} />
      <circle cx="71" cy="49" r="5" fill="#fff" {...thin} />
      <circle cx="78" cy="53" r="3" fill="#fff" {...thin} />
      <Hi cx={58} cy={66} rx={2} ry={5} />
      <Twinkle cx={84} cy={22} r={6} />
    </QTile>
  );
}

export function QuestWindows({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#E8F1FF">
      <rect x="12" y="14" width="54" height="58" rx="7" fill="#fff" {...ink} />
      <rect x="18" y="20" width="18" height="21" rx="3" fill={SKY} />
      <rect x="42" y="20" width="18" height="21" rx="3" fill={SKY} />
      <rect x="18" y="45" width="18" height="21" rx="3" fill={SKY} />
      <rect x="42" y="45" width="18" height="21" rx="3" fill={SKY} />
      <path d="M21 32l8-9M24 37l9-10M45 32l8-9M21 57l8-9M45 57l8-9M48 62l9-10" stroke="#fff" strokeOpacity={0.75} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M39 16v54M14 43h50" stroke={INK} strokeWidth={3} />
      <rect x="8" y="70" width="62" height="9" rx="4" fill={BROWN} {...ink} />
      <Hi cx={18} cy={73.5} rx={5} ry={1.4} />
      <Shadow cx={74} cy={88} rx={14} />
      <Spray x={62} y={40} fill={MINT} />
      <Twinkle cx={50} cy={53} r={5} fill="#fff" />
      <Twinkle cx={82} cy={22} r={7} />
    </QTile>
  );
}

export function QuestBathroom({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#E0F7FF">
      <path d="M18 46V26a7 7 0 0 1 14 0" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
      <path d="M18 46V26a7 7 0 0 1 14 0" fill="none" stroke={STEEL} strokeWidth={3.5} strokeLinecap="round" />
      <circle cx="32" cy="31" r="2" fill={SKY} />
      <ellipse cx="64" cy="42" rx="11" ry="7" fill={GOLD} {...ink} />
      <path d="M71 37q6-1 7-6q-6 0-9 3" fill={GOLD} {...thin} />
      <circle cx="57" cy="32" r="7" fill={GOLD} {...ink} />
      <path d="M50 32q-5 0-6 2q3 2 7 1z" fill={ORANGE} {...thin} />
      <circle cx="56" cy="30" r="1.8" fill={INK} />
      <ellipse cx="59" cy="34" rx="1.8" ry="1.2" fill={PINK} />
      <Hi cx={60} cy={28} rx={2} ry={1.4} rot={-30} />
      <circle cx="30" cy="46" r="7" fill="#fff" {...thin} />
      <circle cx="41" cy="44" r="8" fill="#fff" {...thin} />
      <circle cx="52" cy="47" r="6" fill="#fff" {...thin} />
      <circle cx="74" cy="47" r="7" fill="#fff" {...thin} />
      <circle cx="84" cy="44" r="4" fill="#fff" {...thin} />
      <circle cx="44" cy="30" r="3" fill="#fff" stroke={SKY} strokeWidth={2} />
      <circle cx="80" cy="26" r="4" fill="#fff" stroke={SKY} strokeWidth={2} />
      <rect x="25" y="78" width="7" height="9" rx="3" fill={INK} />
      <rect x="68" y="78" width="7" height="9" rx="3" fill={INK} />
      <path d="M14 52h72v8a22 22 0 0 1-22 22H36a22 22 0 0 1-22-22z" fill="#fff" {...ink} />
      <path d="M17 62h66" stroke={SKY} strokeWidth={4} strokeLinecap="round" />
      <Hi cx={24} cy={68} rx={3} ry={5} />
      <rect x="10" y="48" width="80" height="8" rx="4" fill="#fff" {...ink} />
      <Twinkle cx={20} cy={16} r={5} />
    </QTile>
  );
}

export function QuestCounters({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#E2FAF1">
      <rect x="10" y="68" width="80" height="10" rx="4" fill={STEEL} {...ink} />
      <Hi cx={22} cy={71.5} rx={7} ry={1.6} />
      <path d="M16 78h68v6H16z" fill={INK} fillOpacity={0.12} />
      <Spray x={26} y={22} fill={SKY} />
      <circle cx="62" cy="44" r="4" fill="#fff" {...thin} />
      <circle cx="71" cy="40" r="5" fill="#fff" {...thin} />
      <circle cx="79" cy="45" r="3.5" fill="#fff" {...thin} />
      <rect x="56" y="58" width="30" height="11" rx="3.5" fill={GOLD} {...ink} />
      <rect x="56" y="49" width="30" height="10" rx="3.5" fill={MINT} {...ink} />
      <circle cx="64" cy="64" r="1.6" fill={SHADE} />
      <circle cx="71" cy="63" r="1.6" fill={SHADE} />
      <circle cx="78" cy="64.5" r="1.6" fill={SHADE} />
      <Hi cx={63} cy={52} rx={4} ry={1.4} />
      <path d="M16 86q6-3 12 0" fill="none" stroke={SKY} strokeWidth={2.5} strokeLinecap="round" />
      <Twinkle cx={80} cy={24} r={7} />
      <Twinkle cx={64} cy={18} r={4} fill="#fff" />
    </QTile>
  );
}

export function QuestDishwasher({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#ECEBFF">
      <rect x="18" y="12" width="64" height="52" rx="8" fill={STEEL} {...ink} />
      <path d="M18 24h64" {...ink} />
      <circle cx="28" cy="18" r="2.5" fill={MINT} />
      <rect x="54" y="15.5" width="20" height="5" rx="2.5" fill={INK} fillOpacity={0.25} />
      <rect x="24" y="28" width="52" height="34" rx="4" fill={NIGHT} fillOpacity={0.85} />
      <circle cx="36" cy="46" r="10" fill="#fff" {...thin} />
      <circle cx="36" cy="46" r="5.5" fill="none" stroke={SKY} strokeWidth={2} />
      <circle cx="50" cy="44" r="10" fill="#fff" {...thin} />
      <circle cx="50" cy="44" r="5.5" fill="none" stroke={SKY} strokeWidth={2} />
      <circle cx="64" cy="46" r="10" fill="#fff" {...thin} />
      <circle cx="64" cy="46" r="5.5" fill="none" stroke={SKY} strokeWidth={2} />
      <Hi cx={46} cy={39} rx={3} ry={1.6} rot={-35} />
      <path d="M24 54h52" stroke={STEEL} strokeWidth={4} strokeLinecap="round" />
      <path d="M30 54v-4M40 54v-4M50 54v-4M60 54v-4M70 54v-4" stroke={STEEL} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M18 64h64l6 20H12z" fill="#fff" {...ink} />
      <path d="M24 70h52M22 76h56" stroke={STEEL} strokeWidth={3} strokeLinecap="round" />
      <rect x="40" y="65" width="20" height="4" rx="2" fill={INDIGO} />
      <Twinkle cx={86} cy={20} r={6} />
      <Twinkle cx={12} cy={40} r={4} fill="#fff" />
    </QTile>
  );
}

export function QuestFold({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#FFF0E0">
      <Shadow cy={86} rx={32} />
      <rect x="20" y="66" width="60" height="17" rx="5" fill={MINT} {...ink} />
      <path d="M32 68v13M68 68v13" stroke={INK} strokeOpacity={0.15} strokeWidth={2.5} strokeLinecap="round" />
      <rect x="22" y="50" width="56" height="17" rx="5" fill={SKY} {...ink} />
      <path d="M33 52v13M67 52v13" stroke={INK} strokeOpacity={0.15} strokeWidth={2.5} strokeLinecap="round" />
      <rect x="24" y="30" width="52" height="21" rx="6" fill={CORAL} {...ink} />
      <path d="M35 33v15M65 33v15" stroke={INK} strokeOpacity={0.15} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M41 30q9 10 18 0" fill="#fff" {...thin} />
      <Hi cx={30} cy={36} rx={2} ry={4} />
      <circle cx="50" cy="44" r="1.6" fill="#fff" fillOpacity={0.8} />
      <Twinkle cx={80} cy={22} r={7} />
      <Twinkle cx={22} cy={18} r={4} fill="#fff" />
    </QTile>
  );
}

function Shirt({ cx, y, fill }: { cx: number; y: number; fill: string }) {
  return (
    <g transform={`translate(${cx} ${y})`}>
      <path d="M-11 4L0 -4L11 4" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M0 -4v-3a2.5 2.5 0 1 1 2.5 -2.5" fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
      <path d="M-6 3L-14 7v8h5v19h18V15h5V7L6 3Q0 8-6 3Z" fill={fill} {...thin} />
      <Hi cx={-5} cy={14} rx={1.6} ry={4} />
    </g>
  );
}

export function QuestPutaway({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#F0E6FF">
      <Shadow cy={88} rx={30} />
      <rect x="16" y="12" width="68" height="74" rx="9" fill={BROWN} {...ink} />
      <rect x="22" y="18" width="56" height="46" rx="4" fill={CREAM} />
      <path d="M22 28h56" stroke={STEEL} strokeWidth={3} strokeLinecap="round" />
      <path d="M22 28h56" stroke={INK} strokeOpacity={0.4} strokeWidth={1.5} strokeLinecap="round" />
      <Shirt cx={38} y={33} fill={SKY} />
      <Shirt cx={62} y={33} fill={GOLD} />
      <rect x="22" y="68" width="56" height="13" rx="3.5" fill={ORANGE} {...thin} />
      <rect x="44" y="72" width="12" height="4" rx="2" fill={INK} />
      <Hi cx={23} cy={30} rx={1.6} ry={8} />
      <Twinkle cx={86} cy={16} r={6} />
    </QTile>
  );
}

export function QuestRecycling({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#E2FAF1">
      <Shadow cy={87} rx={24} />
      <g transform="rotate(-14 40 30)">
        <rect x="35" y="16" width="12" height="26" rx="4" fill={MINT} fillOpacity={0.85} {...ink} />
        <rect x="38" y="10" width="6" height="7" rx="1.5" fill={SKY} {...thin} />
        <Hi cx={38.5} cy={24} rx={1.2} ry={4} />
      </g>
      <g transform="rotate(12 62 30)">
        <rect x="54" y="20" width="16" height="22" rx="3" fill={CORAL} {...ink} />
        <path d="M54 25h16" stroke="#fff" strokeOpacity={0.6} strokeWidth={2} />
      </g>
      <path d="M27 42h46l-4.5 40a5 5 0 0 1-5 4.5H36.5a5 5 0 0 1-5-4.5z" fill={SKY} {...ink} />
      <path d="M66 48l-3.6 32" stroke={INK} strokeOpacity={0.12} strokeWidth={5} strokeLinecap="round" />
      <path d={recyclePath(50, 64, 11)} fill="none" stroke="#fff" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
      <Hi cx={34} cy={52} rx={2.5} ry={6} />
      <rect x="22" y="36" width="56" height="10" rx="5" fill={SKY} {...ink} />
      <Hi cx={34} cy={39.5} rx={7} ry={1.6} />
      <Twinkle cx={84} cy={24} r={6} />
    </QTile>
  );
}

export function QuestGroceries({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#FFF6D1">
      <Shadow cy={88} rx={28} />
      <g transform="rotate(16 60 40)">
        <rect x="54" y="8" width="13" height="46" rx="6.5" fill="#E9B46C" {...ink} />
        <path d="M57 16l7-3M57 25l7-3M57 34l7-3" stroke={BROWN} strokeWidth={2.5} strokeLinecap="round" />
      </g>
      <path d="M40 36l-4-10M40 36l2-12M40 36l6-9" fill="none" stroke={MINT} strokeWidth={4} strokeLinecap="round" />
      <path d="M33 38l14-2-6 22z" fill={ORANGE} {...thin} />
      <circle cx="30" cy="42" r="9" fill={MINT} {...ink} />
      <path d="M26 40q4 4 8 0" fill="none" stroke={INK} strokeOpacity={0.3} strokeWidth={2} strokeLinecap="round" />
      <path d="M22 46h56l-3.5 36a5 5 0 0 1-5 4.5H30.5a5 5 0 0 1-5-4.5z" fill="#F2C88E" {...ink} />
      <path d="M22 46h56l-.8 8H22.8z" fill="#E3AE6A" {...thin} />
      <path d="M70 58l-2.8 25" stroke={INK} strokeOpacity={0.1} strokeWidth={4} strokeLinecap="round" />
      <path d="M50 76s-9-5-9-10.5a4.6 4.6 0 0 1 9-1.5a4.6 4.6 0 0 1 9 1.5C59 71 50 76 50 76z" fill={CORAL} {...thin} />
      <Hi cx={30} cy={62} rx={2.5} ry={6} />
      <Twinkle cx={84} cy={30} r={6} />
    </QTile>
  );
}

export function QuestCook({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#FFEDE6">
      <path d="M36 28q-5-6 0-11t0-11M50 26q-5-6 0-11t0-11" fill="none" stroke={INK} strokeOpacity={0.25} strokeWidth={3} strokeLinecap="round" />
      <g transform="rotate(20 66 30)">
        <rect x="63" y="10" width="6" height="34" rx="3" fill={BROWN} {...ink} />
        <ellipse cx="66" cy="12" rx="6" ry="8" fill={BROWN} {...ink} />
      </g>
      <path d="M32 80q-3-5 1-9q0 3 2 4q1-5-1-8q7 4 5 13zM48 80q-3-5 1-9q0 3 2 4q1-5-1-8q7 4 5 13zM64 80q-3-5 1-9q0 3 2 4q1-5-1-8q7 4 5 13z" fill={ORANGE} {...thin} />
      <rect x="14" y="80" width="72" height="8" rx="4" fill={STEEL} {...ink} />
      <rect x="14" y="44" width="10" height="7" rx="3.5" fill={CORAL} {...ink} />
      <rect x="76" y="44" width="10" height="7" rx="3.5" fill={CORAL} {...ink} />
      <path d="M20 38h60v28a12 12 0 0 1-12 12H32a12 12 0 0 1-12-12z" fill={CORAL} {...ink} />
      <ellipse cx="50" cy="38" rx="30" ry="6" fill={GOLD} {...ink} />
      <circle cx="40" cy="38" r="2" fill={MINT} />
      <circle cx="56" cy="37" r="2" fill={ORANGE} />
      <Hi cx={27} cy={52} rx={2.5} ry={6} />
      <circle cx="41" cy="56" r="3" fill={INK} />
      <circle cx="59" cy="56" r="3" fill={INK} />
      <ellipse cx="35.5" cy="63" rx="3.5" ry="2.2" fill={PINK} fillOpacity={0.8} />
      <ellipse cx="64.5" cy="63" rx="3.5" ry="2.2" fill={PINK} fillOpacity={0.8} />
      <path d="M44 63q6 6 12 0" fill="none" {...thin} />
      <Twinkle cx={84} cy={22} r={6} />
    </QTile>
  );
}

export function QuestLunch({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#FFEAF4">
      <Shadow cx={46} cy={87} rx={34} />
      <path d="M28 46v-6a8 8 0 0 1 8-8h12a8 8 0 0 1 8 8v6" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
      <path d="M28 46v-6a8 8 0 0 1 8-8h12a8 8 0 0 1 8 8v6" fill="none" stroke={GRAPE} strokeWidth={3.5} strokeLinecap="round" />
      <rect x="12" y="44" width="60" height="40" rx="9" fill={GRAPE} {...ink} />
      <path d="M12 58h60" {...ink} />
      <rect x="37" y="54" width="10" height="9" rx="2.5" fill={GOLD} {...thin} />
      <Hi cx={20} cy={50} rx={5} ry={1.8} />
      <path d={starPath(26, 72, 5)} fill={GOLD} {...thin} />
      <path d="M58 86L88 86L73 58Z" fill="#F2C88E" {...ink} />
      <path d="M63 82L83 82L73 64Z" fill={CREAM} />
      <path d="M62 82q3-3 5 0t5 0 5 0 5 0" fill="none" stroke={MINT} strokeWidth={3} strokeLinecap="round" />
      <path d="M78 26q-2-6 3-10" fill="none" {...thin} />
      <path d="M79 22q6-6 10-2q-4 6-10 2z" fill={MINT} {...thin} />
      <path d="M78 26c-4-3-12-2-12 7 0 8 6 13 12 11 6 2 12-3 12-11 0-9-8-10-12-7z" fill={CORAL} {...ink} />
      <Hi cx={71} cy={31} rx={2} ry={3.5} rot={-15} />
    </QTile>
  );
}

export function QuestBackpack({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#E8F1FF">
      <Shadow cy={88} rx={28} />
      <rect x="16" y="36" width="10" height="34" rx="5" fill={NIGHT} {...ink} />
      <rect x="74" y="36" width="10" height="34" rx="5" fill={NIGHT} {...ink} />
      <path d="M42 24v-4a8 8 0 0 1 16 0v4" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
      <path d="M42 24v-4a8 8 0 0 1 16 0v4" fill="none" stroke={INDIGO} strokeWidth={3.5} strokeLinecap="round" />
      <rect x="22" y="22" width="56" height="64" rx="20" fill={INDIGO} {...ink} />
      <path d="M30 42q20-8 40 0" fill="none" stroke={INK} strokeOpacity={0.4} strokeWidth={2.5} strokeLinecap="round" />
      <rect x="62" y="40" width="5" height="9" rx="2" fill={GOLD} {...thin} />
      <Hi cx={32} cy={34} rx={3} ry={6} rot={20} />
      <rect x="30" y="54" width="40" height="26" rx="9" fill={SKY} {...ink} />
      <path d="M30 62h40" {...thin} />
      <path d={starPath(50, 71, 6)} fill={GOLD} {...thin} />
      <Twinkle cx={86} cy={18} r={6} />
    </QTile>
  );
}

export function QuestOrganize({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#FFF3D6">
      <rect x="18" y="20" width="9" height="30" rx="2.5" fill={CORAL} {...ink} />
      <rect x="27" y="24" width="8" height="26" rx="2.5" fill={GOLD} {...ink} />
      <rect x="35" y="18" width="10" height="32" rx="2.5" fill={MINT} {...ink} />
      <path d="M21 26h3M30 30h2M38 24h4M21 42h3M38 44h4" stroke="#fff" strokeOpacity={0.6} strokeWidth={2} strokeLinecap="round" />
      <g transform="rotate(18 52 50)">
        <rect x="48" y="22" width="8" height="28" rx="2.5" fill={GRAPE} {...ink} />
      </g>
      <rect x="62" y="30" width="22" height="20" rx="3" fill={SKY} {...ink} />
      <rect x="68" y="36" width="10" height="5" rx="2" fill="#fff" fillOpacity={0.8} />
      <rect x="12" y="49" width="76" height="7" rx="3.5" fill={BROWN} {...ink} />
      <rect x="18" y="60" width="29" height="21" rx="4" fill={PINK} {...ink} />
      <rect x="27" y="65" width="11" height="4" rx="2" fill={INK} fillOpacity={0.55} />
      <rect x="53" y="60" width="29" height="21" rx="4" fill={ORANGE} {...ink} />
      <rect x="62" y="65" width="11" height="4" rx="2" fill={INK} fillOpacity={0.55} />
      <Hi cx={22} cy={70} rx={1.6} ry={5} />
      <rect x="12" y="80" width="76" height="7" rx="3.5" fill={BROWN} {...ink} />
      <Twinkle cx={74} cy={18} r={6} />
    </QTile>
  );
}

// ---- Outside ----

export function QuestLeaves({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#FFF0E0">
      <g transform="rotate(28 68 50)">
        <rect x="65" y="6" width="7" height="62" rx="3.5" fill={BROWN} {...ink} />
        <Hi cx={67.5} cy={18} rx={1.2} ry={6} />
        <path d="M55 74v9M61.5 74v9M68.5 74v9M75.5 74v9M82 74v9" stroke={INK} strokeWidth={3} strokeLinecap="round" />
        <rect x="52" y="66" width="33" height="9" rx="4" fill={STEEL} {...ink} />
      </g>
      <Shadow cx={38} cy={86} rx={28} />
      <path d="M12 86q2-24 26-26q24 2 26 26z" fill={ORANGE} {...ink} />
      <Leaf x={24} y={74} rot={-40} fill={CORAL} />
      <Leaf x={36} y={64} rot={20} fill={GOLD} />
      <Leaf x={48} y={72} rot={60} fill={CORAL} />
      <Leaf x={34} y={79} rot={-80} fill={GOLD} />
      <Leaf x={54} y={81} rot={10} fill={BROWN} />
      <Leaf x={20} y={30} rot={-30} fill={GOLD} />
      <Leaf x={40} y={20} rot={40} fill={CORAL} />
      <path d="M18 40q4 4 0 8M42 30q-4 4 0 8" fill="none" stroke={INK} strokeOpacity={0.2} strokeWidth={2} strokeLinecap="round" />
    </QTile>
  );
}

export function QuestLawn({ size = 64, className, ...rest }: ArtProps) {
  const clip = useTileClip('lawn');
  return (
    <QTile size={size} className={className} rest={rest} tint="#E4F9EE">
      <TileClip id={clip} />
      <g clipPath={`url(#${clip})`}>
        <path d="M0 80l5-8 5 8 5-8 5 8 5-8 5 8 5-8 5 8 5-8 5 8 5-8 5 8 5-8 5 8 5-8 5 8 5-8 5 8 5-8 5 8V100H0z" fill={MINT} {...ink} />
      </g>
      <Tube d="M64 58L82 22" color={GOLD} />
      <rect x="74" y="14" width="18" height="8" rx="4" fill={CORAL} {...ink} transform="rotate(-27 83 18)" />
      <rect x="36" y="44" width="24" height="14" rx="5" fill={STEEL} {...ink} />
      <rect x="44" y="40" width="8" height="5" rx="2" fill={INK} />
      <path d="M28 56h40a8 8 0 0 1 8 8v8H20v-8a8 8 0 0 1 8-8z" fill={CORAL} {...ink} />
      <Hi cx={30} cy={61} rx={5} ry={1.8} />
      <circle cx="28" cy="76" r="8" fill={INK} />
      <circle cx="68" cy="76" r="8" fill={INK} />
      <circle cx="28" cy="76" r="3" fill={STEEL} />
      <circle cx="68" cy="76" r="3" fill={STEEL} />
      <path d="M10 56l4 4M14 48l2 6M20 52v4" stroke={MINT} strokeWidth={3} strokeLinecap="round" />
      <Twinkle cx={22} cy={22} r={7} />
    </QTile>
  );
}

export function QuestSnow({ size = 64, className, ...rest }: ArtProps) {
  const clip = useTileClip('snow');
  return (
    <QTile size={size} className={className} rest={rest} tint="#E3EEFF">
      <TileClip id={clip} />
      <g clipPath={`url(#${clip})`}>
        <path d="M0 82q20-10 40-4t60-6V100H0z" fill="#fff" {...ink} />
      </g>
      <g transform="rotate(-24 50 50)">
        <rect x="46" y="18" width="8" height="40" rx="4" fill={BROWN} {...ink} />
        <path d="M42 18a8 8 0 0 1 16 0" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
        <path d="M42 18a8 8 0 0 1 16 0" fill="none" stroke={CORAL} strokeWidth={3.5} strokeLinecap="round" />
        <path d="M30 58h40l3 24a3 3 0 0 1-3 3.5H30a3 3 0 0 1-3-3.5z" fill={SKY} {...ink} />
        <path d="M30 66q6-6 12-2q6-6 14-2q8-4 14 2l1 6H29z" fill="#fff" {...thin} />
        <Hi cx={34} cy={76} rx={2} ry={4} />
      </g>
      <Flake cx={20} cy={24} r={8} />
      <Flake cx={80} cy={22} r={6} />
      <Flake cx={84} cy={50} r={5} />
      <circle cx="36" cy="14" r="2.5" fill="#fff" {...thin} />
      <circle cx="68" cy="40" r="2" fill="#fff" stroke={INK} strokeWidth={2} />
    </QTile>
  );
}

export function QuestGarden({ size = 64, className, ...rest }: ArtProps) {
  const clip = useTileClip('garden');
  return (
    <QTile size={size} className={className} rest={rest} tint="#EAF8DF">
      <TileClip id={clip} />
      <g transform="rotate(-18 62 34)">
        <Tube d="M52 40L34 30" color={GOLD} w={4} />
        <rect x="27" y="23" width="9" height="13" rx="2" fill={GOLD} {...thin} transform="rotate(-30 31.5 29.5)" />
        <path d="M74 24q12 2 8 16" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
        <path d="M74 24q12 2 8 16" fill="none" stroke={GOLD} strokeWidth={3.5} strokeLinecap="round" />
        <rect x="50" y="22" width="28" height="24" rx="7" fill={GOLD} {...ink} />
        <path d="M56 22v-4h16v4" fill={SHADE} {...thin} />
        <Hi cx={56} cy={30} rx={2} ry={4} />
      </g>
      <path d="M22 44v4M18 52v4M26 54v4" stroke={SKY} strokeWidth={3} strokeLinecap="round" />
      <g clipPath={`url(#${clip})`}>
        <path d="M0 76q50-12 100 0V100H0z" fill={BROWN} {...ink} />
      </g>
      <circle cx="40" cy="84" r="1.6" fill={INK} fillOpacity={0.3} />
      <circle cx="64" cy="86" r="1.6" fill={INK} fillOpacity={0.3} />
      {[24, 50, 76].map((x, i) => (
        <g key={x}>
          <path d={`M${x} ${71 - (i === 1 ? 2 : 0)}v-12`} fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
          <path d={`M${x} ${62 - (i === 1 ? 2 : 0)}c-2-6-8-8-12-6c2 6 8 8 12 6z`} fill={MINT} {...thin} />
          <path d={`M${x} ${60 - (i === 1 ? 2 : 0)}c2-6 8-8 12-6c-2 6-8 8-12 6z`} fill={MINT} {...thin} />
        </g>
      ))}
    </QTile>
  );
}

export function QuestOutside({ size = 64, className, ...rest }: ArtProps) {
  const clip = useTileClip('outside');
  return (
    <QTile size={size} className={className} rest={rest} tint="#E0F4FF">
      <TileClip id={clip} />
      <path d="M30 8v6M30 46v6M8 30h6M46 30h6M14 14l4 4M42 42l4 4M14 46l4-4M42 18l4-4" stroke={SHADE} strokeWidth={3.5} strokeLinecap="round" />
      <circle cx="30" cy="30" r="12" fill={GOLD} {...ink} />
      <Hi cx={25} cy={25} rx={3} ry={2} rot={-35} />
      <circle cx="26" cy="29" r="1.8" fill={INK} />
      <circle cx="34" cy="29" r="1.8" fill={INK} />
      <path d="M26 34q4 4 8 0" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <path d="M58 26a6 6 0 0 1 11-3a5 5 0 0 1 9 4a4 4 0 0 1-1 8H60a5 5 0 0 1-2-9z" fill="#fff" {...thin} />
      <g clipPath={`url(#${clip})`}>
        <path d="M0 78q50-16 100 0V100H0z" fill={MINT} {...ink} />
      </g>
      <rect x="64" y="56" width="9" height="22" rx="3" fill={BROWN} {...ink} />
      <circle cx="68.5" cy="48" r="16" fill={MINT} {...ink} />
      <circle cx="62" cy="44" r="2.5" fill={CORAL} />
      <circle cx="74" cy="52" r="2.5" fill={CORAL} />
      <circle cx="72" cy="40" r="2.5" fill={CORAL} />
      <Hi cx={60} cy={40} rx={4} ry={2.5} rot={-35} />
      <path d="M24 74v-6M28 74l2-5M20 75l-2-5" stroke={NIGHT} strokeOpacity={0.4} strokeWidth={2.5} strokeLinecap="round" />
      <circle cx="24" cy="66" r="3" fill={PINK} {...thin} />
    </QTile>
  );
}

export function QuestBike({ size = 64, className, ...rest }: ArtProps) {
  const spokes = (cx: number, cy: number) => `M${cx - 9} ${cy}h18M${cx} ${cy - 9}v18`;
  return (
    <QTile size={size} className={className} rest={rest} tint="#FFEDE6">
      <Shadow cy={84} rx={36} />
      <circle cx="28" cy="66" r="14" fill="#fff" fillOpacity={0.6} stroke={INK} strokeWidth={5.5} />
      <circle cx="74" cy="66" r="14" fill="#fff" fillOpacity={0.6} stroke={INK} strokeWidth={5.5} />
      <path d={`${spokes(28, 66)}${spokes(74, 66)}`} stroke={INK} strokeOpacity={0.3} strokeWidth={2} strokeLinecap="round" />
      <Tube d="M28 66L50 66L42 44L66 44L50 66M28 66L42 44M64 36L74 66" color={CORAL} w={4} />
      <path d="M60 34h10" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <path d="M70 34q4 6 10 4M71 35q2 8 8 10" fill="none" stroke={PINK} strokeWidth={2.5} strokeLinecap="round" />
      <rect x="34" y="36" width="16" height="7" rx="3.5" fill={NIGHT} {...thin} />
      <circle cx="50" cy="66" r="5" fill={GOLD} {...thin} />
      <circle cx="28" cy="66" r="3" fill={STEEL} {...thin} />
      <circle cx="74" cy="66" r="3" fill={STEEL} {...thin} />
      <Twinkle cx={22} cy={24} r={7} />
      <Twinkle cx={84} cy={20} r={4} fill="#fff" />
    </QTile>
  );
}

export function QuestSports({ size = 64, className, ...rest }: ArtProps) {
  const clip = useTileClip('soccer');
  const pent = (cx: number, cy: number, r: number) => {
    let d = '';
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      d += `${i ? 'L' : 'M'}${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
    }
    return `${d}Z`;
  };
  const sx = 34;
  const sy = 64;
  const spokes = [0, 1, 2, 3, 4]
    .map((i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      return `M${(sx + 6 * Math.cos(a)).toFixed(1)} ${(sy + 6 * Math.sin(a)).toFixed(1)}L${(sx + 13 * Math.cos(a)).toFixed(1)} ${(sy + 13 * Math.sin(a)).toFixed(1)}`;
    })
    .join('');
  const outer = [0, 1, 2, 3, 4].map((i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    return pent(sx + 19 * Math.cos(a), sy + 19 * Math.sin(a), 6.5);
  });
  return (
    <QTile size={size} className={className} rest={rest} tint="#FFF3D6">
      <defs>
        <clipPath id={clip}>
          <circle cx={sx} cy={sy} r="17" />
        </clipPath>
      </defs>
      <Shadow cx={50} cy={86} rx={34} />
      <circle cx="64" cy="48" r="21" fill={ORANGE} {...ink} />
      <path d="M43 48h42M64 27v42M50 32q9 16 0 32M78 32q-9 16 0 32" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      <Hi cx={56} cy={36} rx={5} ry={3} rot={-35} />
      <circle cx={sx} cy={sy} r="17" fill="#fff" />
      <g clipPath={`url(#${clip})`}>
        <path d={pent(sx, sy, 6)} fill={INK} />
        <path d={spokes} stroke={INK} strokeWidth={2} strokeLinecap="round" />
        {outer.map((d) => (
          <path key={d} d={d} fill={INK} />
        ))}
      </g>
      <circle cx={sx} cy={sy} r="17" fill="none" {...ink} />
      <Hi cx={28} cy={56} rx={4} ry={2.5} rot={-35} />
      <path d="M10 46h6M8 54h8M86 74h6" stroke={INK} strokeOpacity={0.25} strokeWidth={3} strokeLinecap="round" />
      <Twinkle cx={22} cy={24} r={7} />
    </QTile>
  );
}

export function QuestSwim({ size = 64, className, ...rest }: ArtProps) {
  const clip = useTileClip('swim');
  return (
    <QTile size={size} className={className} rest={rest} tint="#E0F7FF">
      <TileClip id={clip} />
      <g clipPath={`url(#${clip})`}>
        <path d="M0 70q8-6 16 0t16 0 16 0 16 0 16 0 16 0 8 0V100H0z" fill={SKY} {...ink} />
        <path d="M0 84q8-6 16 0t16 0 16 0 16 0 16 0 16 0 8 0V100H0z" fill={INDIGO} {...ink} />
      </g>
      <path d="M22 44q-12 0-12 10M78 44q12 0 12 10" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
      <path d="M22 44q-12 0-12 10M78 44q12 0 12 10" fill="none" stroke={CORAL} strokeWidth={4.5} strokeLinecap="round" />
      <path d="M46 42q4-4 8 0" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
      <path d="M46 42q4-4 8 0" fill="none" stroke={CORAL} strokeWidth={3.5} strokeLinecap="round" />
      <ellipse cx="34" cy="44" rx="14" ry="12" fill={CORAL} {...ink} />
      <ellipse cx="66" cy="44" rx="14" ry="12" fill={CORAL} {...ink} />
      <ellipse cx="34" cy="44" rx="9.5" ry="8" fill={SKY} {...thin} />
      <ellipse cx="66" cy="44" rx="9.5" ry="8" fill={SKY} {...thin} />
      <Hi cx={30} cy={40} rx={4} ry={2.5} rot={-35} />
      <Hi cx={62} cy={40} rx={4} ry={2.5} rot={-35} />
      <circle cx="24" cy="18" r="4" fill="#fff" stroke={SKY} strokeWidth={2.5} />
      <circle cx="34" cy="24" r="2.5" fill="#fff" stroke={SKY} strokeWidth={2} />
      <Twinkle cx={78} cy={20} r={7} />
    </QTile>
  );
}

export function QuestExercise({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#ECEBFF">
      <g transform="rotate(-14 50 30)">
        <rect x="24" y="27" width="52" height="7" rx="3.5" fill={STEEL} {...ink} />
        <rect x="16" y="16" width="10" height="29" rx="4" fill={INDIGO} {...ink} />
        <rect x="74" y="16" width="10" height="29" rx="4" fill={INDIGO} {...ink} />
        <rect x="10" y="21" width="7" height="19" rx="3" fill={GRAPE} {...ink} />
        <rect x="83" y="21" width="7" height="19" rx="3" fill={GRAPE} {...ink} />
        <Hi cx={19} cy={24} rx={1.4} ry={4} />
        <Hi cx={77} cy={24} rx={1.4} ry={4} />
      </g>
      <Shadow cy={88} rx={34} />
      <path d="M18 80V66a6 6 0 0 1 6-6h12q4 8 14 8h10l16 6a10 10 0 0 1 8 8z" fill={CORAL} {...ink} />
      <path d="M38 62l4 6M44 60l3 7M50 60l2 7" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
      <rect x="16" y="78" width="70" height="9" rx="4.5" fill="#fff" {...ink} />
      <path d="M24 82.5h6M36 82.5h6M48 82.5h6M60 82.5h6" stroke={STEEL} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M62 70q8 4 14 4" fill="none" stroke="#fff" strokeOpacity={0.6} strokeWidth={2.5} strokeLinecap="round" />
      <Hi cx={24} cy={68} rx={2} ry={4} />
      <Twinkle cx={86} cy={54} r={6} />
    </QTile>
  );
}

export function QuestDance({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#F0E6FF">
      <path d="M62 38V14l22-6v24" fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M62 14l22-6v7l-22 6z" fill={INK} />
      <ellipse cx="57" cy="39" rx="6.5" ry="5" fill={INDIGO} {...thin} transform="rotate(-20 57 39)" />
      <ellipse cx="79" cy="33" rx="6.5" ry="5" fill={INDIGO} {...thin} transform="rotate(-20 79 33)" />
      <path d="M30 34V16q8 2 10 10" fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="25" cy="35" rx="6" ry="4.5" fill={GRAPE} {...thin} transform="rotate(-20 25 35)" />
      <Shadow cy={86} rx={34} />
      <path d="M44 58q-10 4-8 18M50 58q10 2 10 16" fill="none" stroke={PINK} strokeWidth={3} strokeLinecap="round" />
      <path d="M14 78q0-16 14-18l10-1q10 9 22 1l10 3q16 4 16 12q0 7-6 7H20q-6 0-6-4z" fill={PINK} {...ink} />
      <path d="M38 59q10 9 22 1q-2 7-11 7t-11-8z" fill={CREAM} {...thin} />
      <path d="M41 56l-6-5v10zM49 56l6-5v10z" fill={CORAL} {...thin} />
      <circle cx="45" cy="56" r="3" fill={CORAL} {...thin} />
      <rect x="14" y="80" width="72" height="5" rx="2.5" fill={GRAPE} {...thin} />
      <Hi cx={72} cy={68} rx={4.5} ry={2} rot={18} />
      <Twinkle cx={16} cy={56} r={6} />
      <Twinkle cx={86} cy={52} r={4} fill="#fff" />
    </QTile>
  );
}

// ---- Exports ----

export const MORE_QUEST_ART_A = {
  dust: QuestDust,
  mop: QuestMop,
  windows: QuestWindows,
  bathroom: QuestBathroom,
  counters: QuestCounters,
  dishwasher: QuestDishwasher,
  fold: QuestFold,
  putaway: QuestPutaway,
  recycling: QuestRecycling,
  groceries: QuestGroceries,
  cook: QuestCook,
  lunch: QuestLunch,
  backpack: QuestBackpack,
  organize: QuestOrganize,
  leaves: QuestLeaves,
  lawn: QuestLawn,
  snow: QuestSnow,
  garden: QuestGarden,
  outside: QuestOutside,
  bike: QuestBike,
  sports: QuestSports,
  swim: QuestSwim,
  exercise: QuestExercise,
  dance: QuestDance,
} satisfies Partial<Record<QuestIconId, (p: ArtProps) => ReactElement>>;

export const MORE_QUEST_LABELS_A = {
  dust: 'Dust the shelves',
  mop: 'Mop the floor',
  windows: 'Wash the windows',
  bathroom: 'Clean the bathroom',
  counters: 'Wipe the counters',
  dishwasher: 'Empty the dishwasher',
  fold: 'Fold the laundry',
  putaway: 'Put clothes away',
  recycling: 'Sort the recycling',
  groceries: 'Put groceries away',
  cook: 'Help cook dinner',
  lunch: 'Pack your lunch',
  backpack: 'Pack your backpack',
  organize: 'Organize your room',
  leaves: 'Rake the leaves',
  lawn: 'Mow the lawn',
  snow: 'Shovel the snow',
  garden: 'Water the garden',
  outside: 'Play outside',
  bike: 'Go for a bike ride',
  sports: 'Practice your sport',
  swim: 'Go swimming',
  exercise: 'Get moving',
  dance: 'Have a dance party',
} satisfies Partial<Record<QuestIconId, string>>;
