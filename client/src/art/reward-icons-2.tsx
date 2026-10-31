// More reward and savings-goal stickers (treats, fun, stuff, outings, big goals).
// Same recipe as reward-icons.tsx: circle tile, chunky ink outline, soft highlight, ground shadow.
import { useId } from 'react';
import type { ReactElement } from 'react';
import type { RewardIconId } from '@kk/shared';
import type { ArtProps } from './types';
import {
  INK,
  INDIGO,
  GOLD,
  SHADE,
  MINT,
  CORAL,
  SKY,
  GRAPE,
  PINK,
  CREAM,
  ORANGE,
  BROWN,
  STEEL,
  NIGHT,
  Hi,
  Shadow,
  Twinkle,
  starPath,
  RTile,
  ink,
  thin, heartPath } from './sticker-kit';

const SKIN = '#F7C59F';
const SKIN_DARK = '#C68A5E';
const COCOA = '#7A4520';
const TAN = '#F5D6A8';
const WOOD = '#E8A86A';

/** Chunky heart centred on (cx, cy). */

/** Little eighth note. */
function Note({ x, y, fill = GRAPE }: { x: number; y: number; fill?: string }) {
  return (
    <g>
      <path d={`M${x + 4} ${y}V${y - 13}l7 3`} fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx={x} cy={y} rx={4.5} ry={3.5} fill={fill} stroke={INK} strokeWidth={2} transform={`rotate(-20 ${x} ${y})`} />
    </g>
  );
}

/** Two dots and a smile. */
function Face({ cx, cy, gap = 6, r = 2.3 }: { cx: number; cy: number; gap?: number; r?: number }) {
  return (
    <g>
      <circle cx={cx - gap} cy={cy} r={r} fill={INK} />
      <circle cx={cx + gap} cy={cy} r={r} fill={INK} />
      <path d={`M${cx - 3} ${cy + 4}q3 3 6 0`} fill="none" {...thin} />
    </g>
  );
}

// ---------------------------------------------------------------- treats

export function RewardDonut({ size = 64, className, ...rest }: ArtProps) {
  const tint = '#FFE6F2';
  return (
    <RTile size={size} className={className} rest={rest} tint={tint}>
      <Shadow cy={82} rx={28} />
      <circle cx="50" cy="52" r="29" fill={WOOD} {...ink} />
      <path
        d="M24 50A26 25 0 0 1 76 50Q77 60 70 60Q67 67 61 64Q56 71 50 66Q44 71 39 64Q33 67 30 60Q23 60 24 50Z"
        fill={PINK}
        {...ink}
      />
      <Hi cx={36} cy={36} rx={7} ry={3} rot={-35} />
      <ellipse cx="50" cy="49" rx="9" ry="7" fill={tint} {...ink} />
      <g strokeWidth={3} strokeLinecap="round">
        <path d="M34 47l3-4" stroke={GOLD} />
        <path d="M43 34l4 1" stroke={SKY} />
        <path d="M58 35l3 3" stroke={MINT} />
        <path d="M66 46l-1 4" stroke="#fff" />
        <path d="M37 56l4 1" stroke={MINT} />
        <path d="M60 57l3-3" stroke={GOLD} />
        <path d="M52 61l-3 1" stroke={SKY} />
      </g>
      <Twinkle cx={80} cy={24} r={6} />
    </RTile>
  );
}

export function RewardCookie({ size = 64, className, ...rest }: ArtProps) {
  const tint = '#FFF0DC';
  const clip = useId();
  return (
    <RTile size={size} className={className} rest={rest} tint={tint}>
      <Shadow cy={82} rx={27} />
      <circle cx="50" cy="52" r="28" fill="#E9A867" {...ink} />
      <clipPath id={clip}>
        <circle cx="50" cy="52" r="29.6" />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        <circle cx="76" cy="31" r="8" fill={tint} {...ink} />
        <circle cx="80" cy="43" r="6.5" fill={tint} {...ink} />
      </g>
      <Hi cx={36} cy={36} rx={7} ry={3} rot={-35} />
      <g fill={COCOA}>
        <path d="M33 47l5-2 1 5-5 1z" />
        <path d="M60 34l5 1-1 5-5-1z" />
        <path d="M65 60l4 3-3 4-4-3z" />
        <path d="M34 63l5 0 0 5-5 0z" />
        <path d="M48 32l4 2-2 4-4-2z" />
      </g>
      <Face cx={50} cy={53} gap={7} r={2.6} />
      <circle cx="38" cy="58" r="3" fill={CORAL} fillOpacity={0.4} />
      <circle cx="62" cy="58" r="3" fill={CORAL} fillOpacity={0.4} />
      <circle cx="80" cy="64" r="2" fill="#E9A867" stroke={INK} strokeWidth={1.5} />
      <circle cx="86" cy="56" r="1.5" fill="#E9A867" stroke={INK} strokeWidth={1.5} />
    </RTile>
  );
}

export function RewardCake({ size = 64, className, ...rest }: ArtProps) {
  const clip = useId();
  const cup = 'M31 58h38l-5 25a3 3 0 0 1-3 2.5H39a3 3 0 0 1-3-2.5z';
  return (
    <RTile size={size} className={className} rest={rest} tint="#FFE9EC">
      <Shadow cy={86} rx={20} />
      <clipPath id={clip}>
        <path d={cup} />
      </clipPath>
      <path d={cup} fill={SKY} />
      <g clipPath={`url(#${clip})`} stroke="#fff" strokeOpacity={0.55} strokeWidth={3}>
        <path d="M40 58l2 28M50 58v28M60 58l-2 28" />
      </g>
      <path d={cup} fill="none" {...ink} />
      <path
        d="M27 59c-5-9 2-15 8-14 0-8 8-12 14-9 5-6 15-3 16 4 7 0 11 8 7 15 0 3-2 4-4 4H31c-2 0-4-1-4-4z"
        fill={PINK}
        {...ink}
      />
      <Hi cx={40} cy={44} rx={6} ry={2.5} rot={-20} />
      <g strokeWidth={3} strokeLinecap="round">
        <path d="M35 53l3-2" stroke={GOLD} />
        <path d="M47 48l3 1" stroke={MINT} />
        <path d="M59 52l3 2" stroke={SKY} />
        <path d="M66 46l-1 3" stroke="#fff" />
      </g>
      <rect x="47" y="22" width="7" height="16" rx="2" fill={CREAM} {...thin} />
      <path d="M47.5 28l6-3M47.5 34l6-3" stroke={CORAL} strokeWidth={2} />
      <path d="M50.5 9c4 4 5 7 5 9a5 5 0 0 1-10 0c0-3 2-5 5-9z" fill={GOLD} {...thin} />
      <path d="M50.5 15c1.5 2 2 3 2 4a2 2 0 0 1-4 0c0-1 .7-2 2-4z" fill={ORANGE} />
      <circle cx="44" cy="70" r="2.3" fill={INK} />
      <circle cx="56" cy="70" r="2.3" fill={INK} />
      <path d="M47 74q3 3 6 0" fill="none" {...thin} />
      <Twinkle cx={77} cy={30} r={6} />
      <Twinkle cx={23} cy={34} r={4} fill="#fff" />
    </RTile>
  );
}

export function RewardBurger({ size = 64, className, ...rest }: ArtProps) {
  const bun = '#F5B25A';
  return (
    <RTile size={size} className={className} rest={rest} tint="#FFEBD9">
      <Shadow cy={82} rx={30} />
      <path d="M21 68h58v3a8 8 0 0 1-8 8H29a8 8 0 0 1-8-8z" fill={bun} {...ink} />
      <rect x="18" y="57" width="64" height="12" rx="6" fill="#8A4B24" {...ink} />
      <path d="M20 57h60l-6 8-5-4-6 7-6-6-7 7-6-7-6 6-5-7-6 4z" fill={GOLD} {...thin} />
      <path d="M17 55q5-6 10 0t11 0 11 0 11 0 11 0 11 0" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 55q5-6 10 0t11 0 11 0 11 0 11 0 11 0" fill="none" stroke={MINT} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 50c0-16 13-25 29-25s29 9 29 25a3 3 0 0 1-3 3H24a3 3 0 0 1-3-3z" fill={bun} {...ink} />
      <Hi cx={36} cy={33} rx={7} ry={3} rot={-20} />
      <g fill={CREAM} stroke={INK} strokeWidth={1.2}>
        <ellipse cx="45" cy="33" rx="2.4" ry="1.4" transform="rotate(-20 45 33)" />
        <ellipse cx="58" cy="35" rx="2.4" ry="1.4" transform="rotate(20 58 35)" />
        <ellipse cx="51" cy="40" rx="2.4" ry="1.4" />
        <ellipse cx="66" cy="43" rx="2.4" ry="1.4" transform="rotate(30 66 43)" />
        <ellipse cx="34" cy="43" rx="2.4" ry="1.4" transform="rotate(-30 34 43)" />
      </g>
      <Twinkle cx={82} cy={24} r={6} />
    </RTile>
  );
}

export function RewardSmoothie({ size = 64, className, ...rest }: ArtProps) {
  const clip = useId();
  const cup = 'M32 38h36l-5 42a4 4 0 0 1-4 3.5H41a4 4 0 0 1-4-3.5z';
  return (
    <RTile size={size} className={className} rest={rest} tint="#E3FAEF">
      <Shadow cy={86} rx={18} />
      <path d="M52 34L60 12h10" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M52 34L60 12h10" fill="none" stroke={CORAL} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      <clipPath id={clip}>
        <path d={cup} />
      </clipPath>
      <path d={cup} fill="#fff" />
      <g clipPath={`url(#${clip})`}>
        <path d="M28 48q6-3 11 0t11 0 11 0 11 0V90H28z" fill={PINK} />
        <path d="M38 44v40" stroke="#fff" strokeOpacity={0.5} strokeWidth={4} />
      </g>
      <path d={cup} fill="none" {...ink} />
      <rect x="28" y="32" width="44" height="8" rx="4" fill="#fff" {...ink} />
      <circle cx="31" cy="30" r="9" fill={GOLD} {...thin} />
      <circle cx="31" cy="30" r="5.5" fill="none" stroke={SHADE} strokeWidth={2} />
      <path d="M31 24.5v11M25.5 30h11" stroke={SHADE} strokeWidth={1.5} />
      <circle cx="44" cy="61" r="2.3" fill={INK} />
      <circle cx="56" cy="61" r="2.3" fill={INK} />
      <path d="M47 65q3 3 6 0" fill="none" {...thin} />
      <circle cx="40" cy="66" r="2.5" fill="#fff" fillOpacity={0.5} />
      <circle cx="60" cy="66" r="2.5" fill="#fff" fillOpacity={0.5} />
      <Twinkle cx={80} cy={46} r={6} />
      <Twinkle cx={20} cy={58} r={4} fill="#fff" />
    </RTile>
  );
}

export function RewardRestaurant({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint="#E9F3FF">
      <Shadow cy={80} rx={28} />
      <circle cx="50" cy="54" r="24" fill="#fff" {...ink} />
      <circle cx="50" cy="54" r="16" fill="none" stroke={STEEL} strokeWidth={3} />
      <Hi cx={40} cy={40} rx={6} ry={2.5} rot={-35} />
      <path d={heartPath(50, 55, 9)} fill={CORAL} {...thin} />
      <path d="M44 22q-3-4 0-8M50 22q-3-4 0-8M56 22q-3-4 0-8" fill="none" stroke={INK} strokeOpacity={0.3} strokeWidth={2.5} strokeLinecap="round" />
      <rect x="17" y="46" width="6" height="34" rx="3" fill={STEEL} {...thin} />
      <path d="M14 26v12a6 6 0 0 0 12 0V26" fill={STEEL} {...thin} />
      <path d="M18 26v10M22 26v10" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <path d="M77 26c7 4 9 14 7 26h-7z" fill={STEEL} {...thin} />
      <rect x="77" y="50" width="6" height="30" rx="3" fill={STEEL} {...thin} />
      <path d="M80 31v15" stroke="#fff" strokeOpacity={0.7} strokeWidth={1.5} strokeLinecap="round" />
    </RTile>
  );
}

// ---------------------------------------------------------------- fun

function Die({ x, y, rot, pips, fill = '#fff' }: { x: number; y: number; rot: number; pips: number[][]; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x="-9" y="-9" width="18" height="18" rx="4.5" fill={fill} {...thin} />
      {pips.map(([px, py]) => (
        <circle key={`${px}-${py}`} cx={px} cy={py} r="2" fill={INK} />
      ))}
    </g>
  );
}

export function RewardBoardgame({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint="#E6E8FF">
      <Shadow cy={80} rx={34} />
      <path d="M14 46v6l36 18 36-18v-6L50 64z" fill="#8A4B24" {...ink} />
      <path d="M50 28L68 37 50 46 32 37z" fill={CORAL} />
      <path d="M68 37L86 46 68 55 50 46z" fill={SKY} />
      <path d="M50 46L68 55 50 64 32 55z" fill={MINT} />
      <path d="M32 37L50 46 32 55 14 46z" fill={GOLD} />
      <path d="M32 37l36 18M68 37L32 55" stroke={INK} strokeOpacity={0.25} strokeWidth={1.5} />
      <path d="M14 46L50 28l36 18-36 18z" fill="none" {...ink} />
      <path d={starPath(50, 46, 5)} fill="#fff" stroke={INK} strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M60 41a4.5 4.5 0 1 1 6 0l3 7h-12z" fill={GRAPE} {...thin} />
      <Hi cx={61.5} cy={36.5} rx={1.6} ry={1.2} />
      <Die x={34} y={72} rot={-14} pips={[[-4, -4], [0, 0], [4, 4]]} />
      <Die x={56} y={76} rot={12} pips={[[-4, -4], [4, -4], [-4, 4], [4, 4]]} fill={GOLD} />
      <Twinkle cx={78} cy={24} r={6} />
      <Twinkle cx={22} cy={28} r={4} fill="#fff" />
    </RTile>
  );
}

export function RewardPuzzle({ size = 64, className, ...rest }: ArtProps) {
  const a = 'M18 38h11a5 5 0 1 1 10 0h9v10a5 5 0 1 1 0 10v10H18z';
  const b = 'M56 40h28v30h-9a5 5 0 1 1-10 0h-9v-10a5 5 0 1 0 0-10z';
  return (
    <RTile size={size} className={className} rest={rest} tint="#FFF2D6">
      <Shadow cy={82} rx={32} />
      <path d={a} fill={SKY} {...ink} />
      <Hi cx={26} cy={44} rx={5} ry={2.2} rot={-20} />
      <Face cx={33} cy={55} gap={5} r={2.2} />
      <g transform="rotate(14 70 55)">
        <path d={b} fill={CORAL} {...ink} />
        <Hi cx={68} cy={45} rx={5} ry={2} rot={-10} />
        <path d={starPath(73, 56, 6)} fill={GOLD} {...thin} />
      </g>
      <path d="M50 26l2-6M58 28l5-4M43 26l-2-5" stroke={INK} strokeOpacity={0.35} strokeWidth={2.5} strokeLinecap="round" />
      <Twinkle cx={80} cy={26} r={6} />
    </RTile>
  );
}

export function RewardMic({ size = 64, className, ...rest }: ArtProps) {
  const clip = useId();
  return (
    <RTile size={size} className={className} rest={rest} tint="#F1E8FF">
      <Shadow cx={46} cy={84} rx={16} />
      <g transform="rotate(-28 46 54)">
        <path d="M40 50h12l-2.5 33a3.5 3.5 0 0 1-7 0z" fill={NIGHT} {...ink} />
        <path d="M44 56l-1 22" stroke="#fff" strokeOpacity={0.3} strokeWidth={2.5} strokeLinecap="round" />
        <rect x="37" y="47" width="18" height="7" rx="3" fill={GOLD} {...thin} />
        <clipPath id={clip}>
          <circle cx="46" cy="34" r="14" />
        </clipPath>
        <circle cx="46" cy="34" r="14" fill={STEEL} />
        <g clipPath={`url(#${clip})`} stroke={INK} strokeOpacity={0.25} strokeWidth={1.5}>
          <path d="M30 26h32M30 32h32M30 38h32M30 44h32M38 18v32M44 18v32M50 18v32M56 18v32" />
        </g>
        <circle cx="46" cy="34" r="14" fill="none" {...ink} />
        <Hi cx={40} cy={27} rx={4.5} ry={2.5} rot={-30} />
      </g>
      <Note x={70} y={40} fill={PINK} />
      <Note x={76} y={66} fill={SKY} />
      <Note x={22} y={36} fill={MINT} />
      <path d="M63 22q5 3 4 9M70 16q8 6 6 15" fill="none" stroke={INK} strokeOpacity={0.35} strokeWidth={2.5} strokeLinecap="round" />
      <Twinkle cx={24} cy={64} r={5} />
    </RTile>
  );
}

export function RewardPlaydate({ size = 64, className, ...rest }: ArtProps) {
  const clip = useId();
  return (
    <RTile size={size} className={className} rest={rest} tint="#FFF0E0">
      <clipPath id={clip}>
        <circle cx="50" cy="50" r="46" />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        <path d="M14 100c0-18 8-27 21-27s21 9 21 27z" fill={SKY} {...ink} />
        <path d="M44 100c0-18 8-27 21-27s21 9 21 27z" fill={CORAL} {...ink} />
        <path d="M58 80l7 6 7-6" fill="none" stroke="#fff" strokeOpacity={0.7} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <circle cx="35" cy="54" r="15" fill={SKIN} {...ink} />
      <path d="M20 52c0-10 6-16 15-16s15 6 15 14c-6-1-12-4-15-9-3 5-8 9-15 11z" fill={BROWN} {...thin} />
      <circle cx="65" cy="54" r="15" fill={SKIN_DARK} {...ink} />
      <circle cx="55" cy="40" r="6" fill={NIGHT} {...thin} />
      <circle cx="75" cy="40" r="6" fill={NIGHT} {...thin} />
      <path d="M50 50c0-9 6-14 15-14s15 5 15 14c-8 0-12-3-15-6-3 3-7 6-15 6z" fill={NIGHT} {...thin} />
      <Face cx={35} cy={57} gap={5} r={2.2} />
      <Face cx={65} cy={57} gap={5} r={2.2} />
      <circle cx="27" cy="62" r="2.5" fill={CORAL} fillOpacity={0.45} />
      <circle cx="43" cy="62" r="2.5" fill={CORAL} fillOpacity={0.45} />
      <circle cx="57" cy="62" r="2.5" fill={PINK} fillOpacity={0.6} />
      <circle cx="73" cy="62" r="2.5" fill={PINK} fillOpacity={0.6} />
      <path d={heartPath(50, 22, 7)} fill={PINK} {...thin} />
      <Twinkle cx={24} cy={24} r={5} />
      <Twinkle cx={78} cy={22} r={4} fill="#fff" />
    </RTile>
  );
}

export function RewardPickdinner({ size = 64, className, ...rest }: ArtProps) {
  const puff = (
    <>
      <circle cx="27" cy="46" r="10" />
      <circle cx="38" cy="38" r="12" />
      <circle cx="49" cy="46" r="10" />
    </>
  );
  return (
    <RTile size={size} className={className} rest={rest} tint="#FFF3D9">
      <Shadow cy={82} rx={32} />
      <g transform="rotate(10 66 54)">
        <rect x="52" y="30" width="30" height="44" rx="4" fill={CREAM} {...ink} />
        <rect x="52" y="30" width="30" height="9" rx="4" fill={CORAL} {...thin} />
        <path d="M58 47h18M58 54h14M58 61h16" stroke={INK} strokeOpacity={0.25} strokeWidth={3} strokeLinecap="round" />
        <circle cx="74" cy="66" r="5.5" fill={MINT} {...thin} />
        <path d="M71.5 66l2 2 3.5-4" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g fill={INK} stroke={INK} strokeWidth={6}>
        {puff}
      </g>
      <g fill="#fff">{puff}</g>
      <path d="M33 34q3-3 7-2" fill="none" stroke={INK} strokeOpacity={0.15} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M24 52h28v20a3 3 0 0 1-3 3H27a3 3 0 0 1-3-3z" fill="#fff" {...ink} />
      <path d="M24 58h28" stroke={INK} strokeOpacity={0.15} strokeWidth={2.5} />
      <Face cx={38} cy={65} gap={5} r={2.2} />
      <Twinkle cx={22} cy={24} r={5} />
      <Twinkle cx={80} cy={22} r={6} />
    </RTile>
  );
}

// ---------------------------------------------------------------- stuff

function Brick({ x, y, w, fill }: { x: number; y: number; w: number; fill: string }) {
  const studs = Math.round(w / 12);
  const step = w / studs;
  return (
    <g>
      {Array.from({ length: studs }, (_, i) => (
        <rect key={i} x={x + step * i + step / 2 - 4} y={y - 5} width="8" height="8" rx="2" fill={fill} {...thin} />
      ))}
      <rect x={x} y={y} width={w} height="14" rx="3" fill={fill} {...ink} />
      <Hi cx={x + 7} cy={y + 4} rx={4} ry={1.5} />
    </g>
  );
}

export function RewardBlocks({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint="#FFEDE6">
      <Shadow cy={80} rx={30} />
      <Brick x={22} y={63} w={48} fill={CORAL} />
      <Brick x={30} y={49} w={36} fill={SKY} />
      <Brick x={38} y={35} w={24} fill={GOLD} />
      <g transform="rotate(16 78 66)">
        <Brick x={70} y={60} w={14} fill={MINT} />
      </g>
      <Twinkle cx={74} cy={28} r={6} />
      <Twinkle cx={24} cy={40} r={4} fill="#fff" />
    </RTile>
  );
}

export function RewardDoll({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint="#FCE8FF">
      <Shadow cy={84} rx={22} />
      <path d="M40 56h20l12 26a3 3 0 0 1-3 4H31a3 3 0 0 1-3-4z" fill={PINK} {...ink} />
      <path d="M31 80h38" stroke="#fff" strokeOpacity={0.6} strokeWidth={3} strokeLinecap="round" />
      <circle cx="44" cy="70" r="1.8" fill="#fff" />
      <circle cx="56" cy="74" r="1.8" fill="#fff" />
      <circle cx="50" cy="65" r="1.8" fill="#fff" />
      <circle cx="33" cy="66" r="4.5" fill={SKIN} {...thin} />
      <circle cx="67" cy="66" r="4.5" fill={SKIN} {...thin} />
      <circle cx="32" cy="38" r="8" fill={BROWN} {...thin} />
      <circle cx="68" cy="38" r="8" fill={BROWN} {...thin} />
      <circle cx="50" cy="40" r="16" fill={SKIN} {...ink} />
      <path d="M34 38c0-10 7-15 16-15s16 5 16 15c-8 0-13-3-16-8-3 5-8 8-16 8z" fill={BROWN} {...thin} />
      <path d="M26 31l6 4-6 4zM74 31l-6 4 6 4z" fill={CORAL} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <circle cx="44" cy="43" r="3" fill={INK} />
      <circle cx="56" cy="43" r="3" fill={INK} />
      <circle cx="45" cy="42" r="1" fill="#fff" />
      <circle cx="57" cy="42" r="1" fill="#fff" />
      <path d="M47 49q3 3 6 0" fill="none" {...thin} />
      <circle cx="40" cy="48" r="2.5" fill={CORAL} fillOpacity={0.45} />
      <circle cx="60" cy="48" r="2.5" fill={CORAL} fillOpacity={0.45} />
      <Twinkle cx={80} cy={58} r={5} />
      <Twinkle cx={20} cy={56} r={4} fill="#fff" />
    </RTile>
  );
}

export function RewardBall({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint="#E2F6FF">
      <Shadow cy={82} rx={24} />
      <g transform="rotate(-25 50 50)">
        <circle cx="50" cy="50" r="28" fill="#fff" />
        <path d="M50 22A28 28 0 0 0 50 78Q30 50 50 22Z" fill={CORAL} />
        <path d="M50 22A28 28 0 0 1 50 78Q70 50 50 22Z" fill={SKY} />
        <path d="M50 22Q41 50 50 78Q59 50 50 22Z" fill={GOLD} />
        <path d="M50 22Q30 50 50 78M50 22Q41 50 50 78M50 22Q59 50 50 78M50 22Q70 50 50 78" fill="none" stroke={INK} strokeWidth={1.5} strokeOpacity={0.4} />
        <circle cx="50" cy="50" r="28" fill="none" {...ink} />
        <ellipse cx="50" cy="23.5" rx="5" ry="3" fill="#fff" stroke={INK} strokeWidth={2} />
      </g>
      <Hi cx={38} cy={36} rx={7} ry={3.5} rot={-40} />
      <Twinkle cx={80} cy={26} r={6} />
    </RTile>
  );
}

export function RewardSneakers({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint="#E7F8F0">
      <Shadow cy={80} rx={34} />
      <path d="M20 68V47q0-4 4-5l10-3 4-11h12q2 10 10 14l18 6q8 3 8 13v7z" fill={CORAL} {...ink} />
      <path d="M38 28h12q1 6 4 10" fill="none" stroke="#fff" strokeOpacity={0.4} strokeWidth={3} strokeLinecap="round" />
      <path d="M44 41l7-3M47 47l7-3M50 53l7-3" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
      <path d="M22 47q6 2 10 0" fill="none" stroke={INK} strokeOpacity={0.2} strokeWidth={2.5} strokeLinecap="round" />
      <path d={starPath(33, 56, 6.5)} fill={GOLD} {...thin} />
      <path d="M16 64h72v5a7 7 0 0 1-7 7H23a7 7 0 0 1-7-7z" fill="#fff" {...ink} />
      <path d="M22 70h60" stroke={STEEL} strokeWidth={2.5} strokeLinecap="round" strokeDasharray="4 4" />
      <Hi cx={70} cy={51} rx={6} ry={2} rot={18} />
      <path d="M12 46h4M10 54h4" stroke={INK} strokeOpacity={0.3} strokeWidth={3} strokeLinecap="round" />
      <Twinkle cx={74} cy={28} r={6} />
    </RTile>
  );
}

export function RewardClothes({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint="#EAF0FF">
      <Shadow cy={84} rx={24} />
      <path d="M38 22Q50 30 62 22L82 33 75 48 67 44V80a3 3 0 0 1-3 3H36a3 3 0 0 1-3-3V44L25 48 18 33Z" fill={SKY} {...ink} />
      <path d="M40 23q10 8 20 0" fill="none" {...thin} />
      <path d="M21 36l5 3M79 36l-5 3" stroke="#fff" strokeOpacity={0.6} strokeWidth={3} strokeLinecap="round" />
      <Hi cx={40} cy={36} rx={5} ry={2.2} rot={-20} />
      <path d={starPath(50, 58, 13)} fill={GOLD} {...ink} />
      <Hi cx={46} cy={53} rx={2.5} ry={1.3} rot={-30} />
      <Twinkle cx={82} cy={62} r={5} />
      <Twinkle cx={20} cy={64} r={4} fill="#fff" />
    </RTile>
  );
}

export function RewardRobot({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint="#E3F2FF">
      <Shadow cy={84} rx={24} />
      <path d="M50 26V16" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      <circle cx="50" cy="14" r="4.5" fill={CORAL} {...thin} />
      <rect x="38" y="76" width="9" height="8" rx="2" fill={STEEL} {...thin} />
      <rect x="53" y="76" width="9" height="8" rx="2" fill={STEEL} {...thin} />
      <rect x="20" y="58" width="9" height="18" rx="4.5" fill={STEEL} {...thin} />
      <rect x="71" y="58" width="9" height="18" rx="4.5" fill={STEEL} {...thin} />
      <rect x="29" y="54" width="42" height="24" rx="6" fill={INDIGO} {...ink} />
      <path d={heartPath(50, 66, 6)} fill={PINK} {...thin} />
      <circle cx="37" cy="62" r="2" fill={GOLD} />
      <circle cx="63" cy="62" r="2" fill={MINT} />
      <rect x="28" y="38" width="5" height="10" rx="2" fill={GOLD} {...thin} />
      <rect x="67" y="38" width="5" height="10" rx="2" fill={GOLD} {...thin} />
      <rect x="32" y="26" width="36" height="28" rx="8" fill={STEEL} {...ink} />
      <Hi cx={40} cy={31} rx={5} ry={2} />
      <circle cx="42" cy="39" r="5" fill={SKY} {...thin} />
      <circle cx="58" cy="39" r="5" fill={SKY} {...thin} />
      <circle cx="43.5" cy="37.5" r="1.6" fill="#fff" />
      <circle cx="59.5" cy="37.5" r="1.6" fill="#fff" />
      <path d="M44 47q6 4 12 0" fill="none" {...thin} />
      <Twinkle cx={80} cy={28} r={6} />
    </RTile>
  );
}

export function RewardSkateboard({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint="#F3E8FF">
      <Shadow cy={78} rx={34} />
      <g transform="rotate(-16 50 54)">
        <path d="M28 60h8l-2 6h-4zM64 60h8l-2 6h-4z" fill={STEEL} {...thin} />
        <circle cx="32" cy="68" r="6.5" fill={GOLD} {...ink} />
        <circle cx="68" cy="68" r="6.5" fill={GOLD} {...ink} />
        <circle cx="32" cy="68" r="2" fill={INK} />
        <circle cx="68" cy="68" r="2" fill={INK} />
        <rect x="12" y="48" width="76" height="14" rx="7" fill={GRAPE} {...ink} />
        <path d="M30 52l6 6M42 52l6 6M54 52l6 6M66 52l6 6" stroke={GOLD} strokeWidth={3} strokeLinecap="round" />
        <Hi cx={22} cy={51.5} rx={5} ry={1.6} />
      </g>
      <path d="M14 36h10M18 28h8" stroke={INK} strokeOpacity={0.3} strokeWidth={3} strokeLinecap="round" />
      <Twinkle cx={74} cy={26} r={6} />
      <Twinkle cx={44} cy={22} r={4} fill="#fff" />
    </RTile>
  );
}

export function RewardScooter({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint="#E2F8F1">
      <Shadow cy={82} rx={30} />
      <path d="M70 66L62 24" stroke={INK} strokeWidth={9} strokeLinecap="round" />
      <path d="M70 66L62 24" stroke={MINT} strokeWidth={4} strokeLinecap="round" />
      <path d="M52 24h20" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <path d="M50 24h6M68 24h6" stroke={INK} strokeWidth={9} strokeLinecap="round" />
      <path d="M50 24h6M68 24h6" stroke={CORAL} strokeWidth={4} strokeLinecap="round" />
      <path d="M18 70q4-8 12-8" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      <rect x="24" y="62" width="50" height="8" rx="4" fill={MINT} {...ink} />
      <Hi cx={34} cy={64.5} rx={5} ry={1.3} />
      <circle cx="28" cy="74" r="8" fill={INK} />
      <circle cx="72" cy="74" r="8" fill={INK} />
      <circle cx="28" cy="74" r="3.2" fill={GOLD} />
      <circle cx="72" cy="74" r="3.2" fill={GOLD} />
      <path d="M12 52h8M14 44h8" stroke={INK} strokeOpacity={0.3} strokeWidth={3} strokeLinecap="round" />
      <Twinkle cx={32} cy={30} r={6} />
    </RTile>
  );
}

export function RewardCamera({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint="#FFE9E6">
      <Shadow cy={82} rx={30} />
      <rect x="30" y="28" width="18" height="10" rx="3" fill={NIGHT} {...thin} />
      <rect x="64" y="30" width="10" height="7" rx="2.5" fill={CORAL} {...thin} />
      <rect x="18" y="35" width="64" height="42" rx="9" fill={SKY} {...ink} />
      <path d="M18 48h64" stroke={INK} strokeWidth={3} />
      <path d="M18 66h64" stroke={INK} strokeOpacity={0.15} strokeWidth={3} />
      <Hi cx={27} cy={40} rx={5} ry={2} />
      <circle cx="50" cy="57" r="16" fill={NIGHT} {...ink} />
      <circle cx="50" cy="57" r="9" fill={INDIGO} stroke="#fff" strokeOpacity={0.4} strokeWidth={2} />
      <circle cx="46" cy="53" r="3" fill="#fff" fillOpacity={0.8} />
      <rect x="68" y="40" width="9" height="5" rx="1.5" fill={GOLD} stroke={INK} strokeWidth={2} />
      <Twinkle cx={82} cy={22} r={6} />
      <Twinkle cx={18} cy={24} r={4} fill="#fff" />
    </RTile>
  );
}

export function RewardPhone({ size = 64, className, ...rest }: ArtProps) {
  const apps = [CORAL, GOLD, MINT, GRAPE, PINK, ORANGE];
  return (
    <RTile size={size} className={className} rest={rest} tint="#E8EAFF">
      <g transform="rotate(-10 46 50)">
        <rect x="27" y="16" width="38" height="68" rx="8" fill={NIGHT} {...ink} />
        <rect x="31" y="24" width="30" height="52" rx="4" fill={SKY} />
        <path d="M31 42L49 24h8L31 50z" fill="#fff" fillOpacity={0.25} />
        <rect x="41" y="19" width="10" height="2.5" rx="1.25" fill="#fff" fillOpacity={0.5} />
        {apps.map((c, i) => (
          <rect key={c} x={34 + (i % 3) * 8.5} y={36 + Math.floor(i / 3) * 10} width="6.5" height="6.5" rx="2" fill={c} stroke={INK} strokeWidth={1.2} />
        ))}
        <rect x="34" y="60" width="23.5" height="10" rx="3" fill="#fff" fillOpacity={0.6} />
        <circle cx="46" cy="80" r="1.8" fill="#fff" fillOpacity={0.6} />
      </g>
      <path d="M62 22h18a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5h-11l-5 5v-5a5 5 0 0 1-5-5v-8a5 5 0 0 1 5-5z" fill="#fff" {...thin} />
      <path d={heartPath(71, 31, 5)} fill={CORAL} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
      <Twinkle cx={80} cy={64} r={6} />
      <Twinkle cx={18} cy={30} r={4} fill="#fff" />
    </RTile>
  );
}

export function RewardKite({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint="#E2F4FF">
      <path d="M72 70q6-3 12 0" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" />
      <path d="M16 28q5-3 10 0" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
      <path d="M43 68q-8 6-2 11t-4 11" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M40 74l-6-4 1 7zM40 74l7-1-4 6z" fill={CORAL} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M39 84l-6-2 2 6zM39 84l7 0-4 5z" fill={GOLD} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
      <g transform="rotate(15 50 40)">
        <path d="M50 12L50 40 28 38z" fill={CORAL} />
        <path d="M50 12L72 38 50 40z" fill={GOLD} />
        <path d="M72 38L50 40 50 70z" fill={SKY} />
        <path d="M28 38L50 40 50 70z" fill={MINT} />
        <path d="M50 12v58M28 38l44 0" stroke={INK} strokeOpacity={0.35} strokeWidth={2} />
        <path d="M50 12L72 38 50 70 28 38z" fill="none" {...ink} />
        <Hi cx={42} cy={26} rx={4.5} ry={2} rot={-50} />
        <circle cx="44.5" cy="44" r="2.2" fill={INK} />
        <circle cx="55.5" cy="44" r="2.2" fill={INK} />
        <path d="M47.5 49q2.5 2.5 5 0" fill="none" {...thin} />
      </g>
      <Twinkle cx={80} cy={22} r={6} />
    </RTile>
  );
}

// ---------------------------------------------------------------- outings

export function RewardZoo({ size = 64, className, ...rest }: ArtProps) {
  const clip = useId();
  return (
    <RTile size={size} className={className} rest={rest} tint="#E8F8EE">
      <clipPath id={clip}>
        <circle cx="50" cy="50" r="46" />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        <path d="M54 54h16l4 46H50z" fill={GOLD} {...ink} />
        <ellipse cx="59" cy="70" rx="4" ry="3" fill={BROWN} />
        <ellipse cx="66" cy="82" rx="3.5" ry="4" fill={BROWN} />
        <ellipse cx="57" cy="90" rx="3" ry="2.5" fill={BROWN} />
      </g>
      <path d="M55 30l-2-10M69 30l2-10" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      <circle cx="53" cy="19" r="3.5" fill={BROWN} {...thin} />
      <circle cx="71" cy="19" r="3.5" fill={BROWN} {...thin} />
      <ellipse cx="46" cy="34" rx="7" ry="3.5" fill={GOLD} {...thin} transform="rotate(-25 46 34)" />
      <ellipse cx="78" cy="34" rx="7" ry="3.5" fill={GOLD} {...thin} transform="rotate(25 78 34)" />
      <ellipse cx="62" cy="41" rx="15" ry="13" fill={GOLD} {...ink} />
      <ellipse cx="62" cy="53" rx="12" ry="8" fill="#FFE3A3" {...ink} />
      <Hi cx={54} cy={33} rx={4} ry={2} rot={-25} />
      <ellipse cx="72" cy="35" rx="3" ry="2.2" fill={BROWN} />
      <circle cx="56" cy="42" r="2.4" fill={INK} />
      <circle cx="68" cy="42" r="2.4" fill={INK} />
      <circle cx="58" cy="52" r="1.4" fill={INK} />
      <circle cx="66" cy="52" r="1.4" fill={INK} />
      <path d="M59 56q3 2 6 0" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <rect x="23" y="56" width="5" height="30" rx="2" fill={BROWN} {...thin} />
      <rect x="11" y="44" width="30" height="16" rx="4" fill={WOOD} {...ink} />
      <path d="M15 48.5h6l-6 7h6" fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="28" cy="52" r="3.3" fill="none" stroke={INK} strokeWidth={2.4} />
      <circle cx="36" cy="52" r="3.3" fill="none" stroke={INK} strokeWidth={2.4} />
      <Twinkle cx={26} cy={26} r={5} />
    </RTile>
  );
}

export function RewardThemepark({ size = 64, className, ...rest }: ArtProps) {
  const cabins = [CORAL, GOLD, MINT, SKY, GRAPE, PINK];
  return (
    <RTile size={size} className={className} rest={rest} tint="#E6EEFF">
      <Shadow cy={84} rx={26} />
      <path d="M50 44L32 84M50 44l18 40M36 76h28" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      <circle cx="50" cy="44" r="26" fill="#fff" fillOpacity={0.55} {...ink} />
      <circle cx="50" cy="44" r="19" fill="none" stroke={INK} strokeOpacity={0.2} strokeWidth={2} />
      <g stroke={INK} strokeOpacity={0.35} strokeWidth={2}>
        {cabins.map((c, i) => {
          const a = (i * Math.PI) / 3 - Math.PI / 2;
          return <path key={c} d={`M50 44L${(50 + 26 * Math.cos(a)).toFixed(1)} ${(44 + 26 * Math.sin(a)).toFixed(1)}`} />;
        })}
      </g>
      <Hi cx={36} cy={28} rx={6} ry={2.5} rot={-40} />
      {cabins.map((c, i) => {
        const a = (i * Math.PI) / 3 - Math.PI / 2;
        const x = 50 + 26 * Math.cos(a);
        const y = 44 + 26 * Math.sin(a);
        return <rect key={c} x={(x - 5).toFixed(1)} y={(y - 1).toFixed(1)} width="10" height="9" rx="3" fill={c} {...thin} />;
      })}
      <circle cx="50" cy="44" r="4.5" fill={GOLD} {...thin} />
      <Twinkle cx={84} cy={30} r={5} />
      <Twinkle cx={16} cy={56} r={4} fill="#fff" />
    </RTile>
  );
}

export function RewardPool({ size = 64, className, ...rest }: ArtProps) {
  const tile = useId();
  const ringId = useId();
  const ring = 'M22 54a28 16 0 1 0 56 0a28 16 0 1 0-56 0zM39 52a11 5 0 1 0 22 0a11 5 0 1 0-22 0z';
  return (
    <RTile size={size} className={className} rest={rest} tint="#E2F7FF">
      <clipPath id={tile}>
        <circle cx="50" cy="50" r="46" />
      </clipPath>
      <g clipPath={`url(#${tile})`}>
        <path d="M0 56q8-4 16 0t17 0 17 0 17 0 17 0 17 0V100H0z" fill={SKY} {...ink} />
        <path d="M14 82q6-3 12 0M62 86q6-3 12 0M38 92q6-3 12 0" fill="none" stroke="#fff" strokeOpacity={0.6} strokeWidth={3} strokeLinecap="round" />
      </g>
      <clipPath id={ringId}>
        <path d={ring} clipRule="evenodd" />
      </clipPath>
      <path d={ring} fill={CORAL} fillRule="evenodd" />
      <g clipPath={`url(#${ringId})`} fill="#fff">
        <path d="M28 30h9l-4 50h-9zM63 30h9l4 50h-9z" />
        <path d="M45 60h10v12H45z" />
      </g>
      <path d={ring} fill="none" fillRule="evenodd" {...ink} />
      <Hi cx={32} cy={46} rx={6} ry={2.2} rot={-20} />
      <path d="M14 64q4 3 8 0M78 64q4 3 8 0" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
      <circle cx="74" cy="24" r="9" fill={GOLD} {...thin} />
      <path d="M74 10v3M88 24h-3M84 14l-2 2M64 14l2 2" stroke={SHADE} strokeWidth={2.5} strokeLinecap="round" />
      <Twinkle cx={24} cy={28} r={5} fill="#fff" />
    </RTile>
  );
}

export function RewardBeach({ size = 64, className, ...rest }: ArtProps) {
  const tile = useId();
  const canopy = useId();
  const top = 'M14 42A26 24 0 0 1 66 42Q59.5 37 53 42Q46.5 37 40 42Q33.5 37 27 42Q20.5 37 14 42Z';
  return (
    <RTile size={size} className={className} rest={rest} tint="#FFF4D6">
      <clipPath id={tile}>
        <circle cx="50" cy="50" r="46" />
      </clipPath>
      <g clipPath={`url(#${tile})`}>
        <path d="M0 62h100v40H0z" fill={SKY} />
        <path d="M0 70q25-8 50-2t50-2V100H0z" fill="#FFE0A3" {...ink} />
        <circle cx="30" cy="84" r="1.5" fill={SHADE} />
        <circle cx="62" cy="88" r="1.5" fill={SHADE} />
        <circle cx="44" cy="92" r="1.5" fill={SHADE} />
      </g>
      <circle cx="80" cy="26" r="7" fill={GOLD} {...thin} />
      <g transform="rotate(-12 40 50)">
        <path d="M40 40V80" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        <clipPath id={canopy}>
          <path d={top} />
        </clipPath>
        <path d={top} fill={CORAL} />
        <g clipPath={`url(#${canopy})`} fill="#fff">
          <path d="M40 16L20 44h10zM40 16L50 44h10z" />
        </g>
        <path d={top} fill="none" {...ink} />
        <circle cx="40" cy="17" r="2.5" fill={GOLD} {...thin} />
      </g>
      <path d="M66 64q0-12 9-12t9 12" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M62 62h26l-3 18a3 3 0 0 1-3 2.5H68a3 3 0 0 1-3-2.5z" fill={MINT} {...ink} />
      <path d="M63 68h24" stroke="#fff" strokeOpacity={0.6} strokeWidth={3} />
      <Hi cx={68} cy={74} rx={2} ry={4} />
    </RTile>
  );
}

export function RewardTrip({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint="#E2F4FF">
      <Shadow cx={38} cy={84} rx={22} />
      <path d="M30 46v-6a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v6" fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
      <rect x="18" y="45" width="40" height="36" rx="6" fill={ORANGE} {...ink} />
      <path d="M28 46v34M48 46v34" stroke="#C26A1F" strokeWidth={3} />
      <Hi cx={24} cy={51} rx={2} ry={4} />
      <circle cx="38" cy="58" r="5" fill={MINT} {...thin} />
      <path d={starPath(38, 71, 5)} fill={GOLD} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <path d="M30 32q12-14 26-12" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeDasharray="1 7" />
      <g transform="translate(68 30) rotate(-28)">
        <path d="M-4 -2l-8-14h6l12 14z" fill={SKY} {...thin} />
        <path d="M-16 -3l-4-8h4l6 8z" fill={CORAL} {...thin} />
        <path d="M-18 0q0-5 6-5h22q9 0 13 5-4 5-13 5h-22q-6 0-6-5z" fill="#fff" {...ink} />
        <path d="M-4 2l-8 14h6l12-14z" fill={SKY} {...thin} />
        <circle cx="2" cy="-1" r="1.6" fill={SKY} />
        <circle cx="8" cy="-1" r="1.6" fill={SKY} />
        <circle cx="14" cy="-1" r="1.6" fill={SKY} />
      </g>
      <path d="M68 66q2-6 8-5 3-4 8-1 4 0 4 4 0 3-4 3H70q-3 0-2-1z" fill="#fff" stroke={INK} strokeOpacity={0.2} strokeWidth={2} />
      <Twinkle cx={84} cy={46} r={5} />
    </RTile>
  );
}

function Ticket({ x, y, rot, fill }: { x: number; y: number; rot: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d="M-27-14h54v8a6 6 0 0 0 0 12v8h-54v-8a6 6 0 0 0 0-12z" fill={fill} {...ink} />
      <path d="M12-13v26" stroke={INK} strokeOpacity={0.4} strokeWidth={2} strokeDasharray="3 3" />
      <path d={starPath(20, 0, 4.5)} fill="#fff" stroke={INK} strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M-18-5h22M-18 1h16M-18 7h20" stroke={INK} strokeOpacity={0.3} strokeWidth={2.5} strokeLinecap="round" />
      <Hi cx={-18} cy={-10} rx={5} ry={1.4} />
    </g>
  );
}

export function RewardTickets({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint="#FFEFE0">
      <Shadow cy={82} rx={28} />
      <Ticket x={46} y={42} rot={-16} fill={GOLD} />
      <Ticket x={54} y={62} rot={10} fill={CORAL} />
      <Twinkle cx={80} cy={26} r={6} />
      <Twinkle cx={20} cy={70} r={4} fill="#fff" />
    </RTile>
  );
}

export function RewardBowling({ size = 64, className, ...rest }: ArtProps) {
  const clip = useId();
  const pin = 'M40 16c6 0 8 6 7 12-1 5-4 8-4 12 0 6 11 14 11 28 0 8-6 12-14 12s-14-4-14-12c0-14 11-22 11-28 0-4-3-7-4-12-1-6 1-12 7-12z';
  return (
    <RTile size={size} className={className} rest={rest} tint="#EAE8FF">
      <Shadow cx={52} cy={82} rx={30} />
      <clipPath id={clip}>
        <path d={pin} />
      </clipPath>
      <path d={pin} fill="#fff" />
      <g clipPath={`url(#${clip})`} fill={CORAL}>
        <rect x="20" y="31" width="40" height="3.5" />
        <rect x="20" y="37" width="40" height="3.5" />
        <rect x="20" y="72" width="40" height="10" fill={INK} fillOpacity={0.08} />
      </g>
      <path d={pin} fill="none" {...ink} />
      <Hi cx={36} cy={22} rx={2} ry={4} rot={15} />
      <Hi cx={33} cy={60} rx={2.5} ry={7} rot={15} />
      <circle cx="66" cy="64" r="17" fill={INDIGO} {...ink} />
      <Hi cx={58} cy={55} rx={5} ry={2.5} rot={-40} />
      <circle cx="65" cy="59" r="2.5" fill={NIGHT} />
      <circle cx="72" cy="58" r="2.5" fill={NIGHT} />
      <circle cx="70" cy="65" r="2.5" fill={NIGHT} />
      <Twinkle cx={74} cy={28} r={6} />
      <Twinkle cx={18} cy={40} r={4} fill="#fff" />
    </RTile>
  );
}

export function RewardMuseum({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint="#F1EBFF">
      <path d="M14 73h72v6H14z" fill={STEEL} {...ink} />
      <path d="M18 67h64v6H18z" fill={CREAM} {...ink} />
      {[25, 36, 57, 68].map((x) => (
        <g key={x}>
          <rect x={x} y="41" width="7" height="26" fill={CREAM} {...thin} />
          <path d={`M${x + 3.5} 45v18`} stroke={STEEL} strokeWidth={2} />
        </g>
      ))}
      <path d="M45 67V54a5 5 0 0 1 10 0v13z" fill={GRAPE} {...thin} />
      <rect x="21" y="34" width="58" height="7" fill={CREAM} {...ink} />
      <path d="M18 34L50 14l32 20z" fill={CREAM} {...ink} />
      <path d={starPath(50, 27, 5)} fill={GOLD} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <Hi cx={40} cy={24} rx={5} ry={1.6} rot={-32} />
      <path d="M50 14V6" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M50 6l8 2.5-8 2.5z" fill={CORAL} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <Twinkle cx={82} cy={22} r={5} />
      <Twinkle cx={18} cy={24} r={4} fill="#fff" />
    </RTile>
  );
}

// ---------------------------------------------------------------- big goals

export function RewardCollege({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint="#E8EAFF">
      <g transform="rotate(-14 50 74)">
        <rect x="24" y="66" width="50" height="14" rx="3" fill={CREAM} {...ink} />
        <ellipse cx="74" cy="73" rx="4" ry="7" fill={CREAM} {...thin} />
        <ellipse cx="74" cy="73" rx="1.5" ry="3" fill={STEEL} />
        <rect x="44" y="66" width="8" height="14" fill={CORAL} {...thin} />
        <path d="M48 80l-5 9 5-2 4 3z" fill={CORAL} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      </g>
      <path d="M32 40v13q18 9 36 0V40" fill={NIGHT} {...ink} />
      <path d="M50 20L86 35 50 50 14 35z" fill={INDIGO} {...ink} />
      <Hi cx={40} cy={30} rx={7} ry={2} rot={-22} />
      <path d="M50 35l24 6v14" fill="none" stroke={GOLD} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M71 54h6l1 9h-8z" fill={GOLD} {...thin} />
      <circle cx="50" cy="35" r="3" fill={GOLD} stroke={INK} strokeWidth={2} />
      <Twinkle cx={22} cy={56} r={5} />
      <Twinkle cx={80} cy={18} r={6} />
    </RTile>
  );
}

export function RewardCharity({ size = 64, className, ...rest }: ArtProps) {
  const clip = useId();
  const jar = 'M30 42h40v34a8 8 0 0 1-8 8H38a8 8 0 0 1-8-8z';
  return (
    <RTile size={size} className={className} rest={rest} tint="#FFE8EC">
      <Shadow cy={86} rx={24} />
      <clipPath id={clip}>
        <path d={jar} />
      </clipPath>
      <path d={jar} fill="#DFF4FF" />
      <g clipPath={`url(#${clip})`}>
        <ellipse cx="40" cy="80" rx="8" ry="3.5" fill={GOLD} stroke={INK} strokeWidth={2} />
        <ellipse cx="58" cy="80" rx="8" ry="3.5" fill={GOLD} stroke={INK} strokeWidth={2} />
        <ellipse cx="49" cy="75" rx="8" ry="3.5" fill={GOLD} stroke={INK} strokeWidth={2} />
        <path d="M36 46v30" stroke="#fff" strokeOpacity={0.8} strokeWidth={4} strokeLinecap="round" />
      </g>
      <path d={jar} fill="none" {...ink} />
      <rect x="27" y="35" width="46" height="9" rx="3" fill={GOLD} {...ink} />
      <path d="M43 39.5h14" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      <path d={heartPath(50, 60, 11)} fill={CORAL} {...ink} />
      <Hi cx={44} cy={54} rx={3} ry={1.6} rot={-35} />
      <path d={heartPath(50, 20, 6)} fill={PINK} {...thin} />
      <path d="M50 30v3" stroke={INK} strokeOpacity={0.3} strokeWidth={2.5} strokeLinecap="round" />
      <Twinkle cx={78} cy={26} r={6} />
      <Twinkle cx={22} cy={28} r={4} fill="#fff" />
    </RTile>
  );
}

export function RewardNewpet({ size = 64, className, ...rest }: ArtProps) {
  const clip = useId();
  const basket = 'M21 58h58l-6 24a4 4 0 0 1-4 3H31a4 4 0 0 1-4-3z';
  return (
    <RTile size={size} className={className} rest={rest} tint="#FFF0E0">
      <Shadow cy={86} rx={28} />
      <ellipse cx="34" cy="38" rx="6" ry="11" fill={BROWN} {...thin} transform="rotate(25 34 38)" />
      <ellipse cx="66" cy="38" rx="6" ry="11" fill={BROWN} {...thin} transform="rotate(-25 66 38)" />
      <circle cx="50" cy="42" r="16" fill={TAN} {...ink} />
      <ellipse cx="57" cy="39" rx="5" ry="4.5" fill={BROWN} fillOpacity={0.55} />
      <Hi cx={43} cy={32} rx={4} ry={2} rot={-25} />
      <circle cx="44" cy="40" r="2.6" fill={INK} />
      <circle cx="57" cy="40" r="2.6" fill={INK} />
      <ellipse cx="50.5" cy="47" rx="3.2" ry="2.3" fill={INK} />
      <path d="M47 50.5q3.5 3 7 0" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <path d="M49 52h4v3a2 2 0 0 1-4 0z" fill={PINK} stroke={INK} strokeWidth={1.5} />
      <clipPath id={clip}>
        <path d={basket} />
      </clipPath>
      <path d={basket} fill={WOOD} />
      <g clipPath={`url(#${clip})`} stroke={BROWN} strokeWidth={2.5}>
        <path d="M18 66h64M18 74h64M30 58v30M40 58v30M50 58v30M60 58v30M70 58v30" />
      </g>
      <path d={basket} fill="none" {...ink} />
      <ellipse cx="42" cy="56" rx="5" ry="3.5" fill={TAN} {...thin} />
      <ellipse cx="58" cy="56" rx="5" ry="3.5" fill={TAN} {...thin} />
      <rect x="17" y="56" width="66" height="7" rx="3.5" fill={BROWN} {...ink} />
      <path d="M50 72l-11-6v12zM50 72l11-6v12z" fill={CORAL} {...thin} />
      <circle cx="50" cy="72" r="3.2" fill={CORAL} {...thin} />
      <path d={heartPath(80, 28, 5)} fill={PINK} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <Twinkle cx={20} cy={30} r={5} />
    </RTile>
  );
}

export const MORE_REWARD_ART = {
  donut: RewardDonut,
  cookie: RewardCookie,
  cake: RewardCake,
  burger: RewardBurger,
  smoothie: RewardSmoothie,
  restaurant: RewardRestaurant,
  boardgame: RewardBoardgame,
  puzzle: RewardPuzzle,
  mic: RewardMic,
  playdate: RewardPlaydate,
  pickdinner: RewardPickdinner,
  blocks: RewardBlocks,
  doll: RewardDoll,
  ball: RewardBall,
  sneakers: RewardSneakers,
  clothes: RewardClothes,
  robot: RewardRobot,
  skateboard: RewardSkateboard,
  scooter: RewardScooter,
  camera: RewardCamera,
  phone: RewardPhone,
  kite: RewardKite,
  zoo: RewardZoo,
  themepark: RewardThemepark,
  pool: RewardPool,
  beach: RewardBeach,
  trip: RewardTrip,
  tickets: RewardTickets,
  bowling: RewardBowling,
  museum: RewardMuseum,
  college: RewardCollege,
  charity: RewardCharity,
  newpet: RewardNewpet,
} satisfies Partial<Record<RewardIconId, (p: ArtProps) => ReactElement>>;

export const MORE_REWARD_LABELS = {
  donut: 'Donut run',
  cookie: 'Cookie treat',
  cake: 'Cupcake treat',
  burger: 'Burger night',
  smoothie: 'Smoothie trip',
  restaurant: 'Dinner out',
  boardgame: 'Board game night',
  puzzle: 'New puzzle',
  mic: 'Karaoke night',
  playdate: 'Playdate with a friend',
  pickdinner: 'You pick dinner',
  blocks: 'Building blocks',
  doll: 'New doll',
  ball: 'New ball',
  sneakers: 'New sneakers',
  clothes: 'New outfit',
  robot: 'Toy robot',
  skateboard: 'Skateboard',
  scooter: 'New scooter',
  camera: 'A camera',
  phone: 'A phone',
  kite: 'New kite',
  zoo: 'Trip to the zoo',
  themepark: 'Theme park day',
  pool: 'Pool day',
  beach: 'Beach day',
  trip: 'Family trip',
  tickets: 'Show tickets',
  bowling: 'Bowling trip',
  museum: 'Museum visit',
  college: 'Save for college',
  charity: 'Give to charity',
  newpet: 'A new pet',
} satisfies Partial<Record<RewardIconId, string>>;
