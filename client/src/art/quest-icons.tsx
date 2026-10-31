import type { ReactElement } from 'react';
import type { QuestIconId } from '@kk/shared';
import type { ArtProps } from './types';
import { MORE_QUEST_ART_A, MORE_QUEST_LABELS_A } from './quest-icons-2';
import { MORE_QUEST_ART_B, MORE_QUEST_LABELS_B } from './quest-icons-3';
import { INK, INDIGO, GOLD, SHADE, MINT, CORAL, SKY, GRAPE, PINK, CREAM, ORANGE, BROWN, STEEL, Hi, Shadow, Twinkle, starPath, QTile, ink, thin, LetterTile } from './sticker-kit';

export function QuestBed({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#ECEBFF">
      <rect x="20" y="68" width="7" height="14" rx="3" fill={INK} />
      <rect x="75" y="68" width="7" height="14" rx="3" fill={INK} />
      <rect x="16" y="26" width="18" height="50" rx="8" fill={GRAPE} {...ink} />
      <Hi cx={22} cy={37} rx={3} ry={6} />
      <rect x="16" y="56" width="70" height="18" rx="7" fill={INDIGO} {...ink} />
      <rect x="30" y="42" width="20" height="13" rx="6.5" fill="#fff" {...ink} />
      <path d="M46 46h30a10 10 0 0 1 10 10v8H46z" fill={CORAL} {...ink} />
      <path d="M58 48v14M70 48v14" stroke="#fff" strokeOpacity={0.55} strokeWidth={3} strokeLinecap="round" />
      <path d="M20 70h62" stroke={INK} strokeOpacity={0.15} strokeWidth={3} strokeLinecap="round" />
      <Twinkle cx={76} cy={28} r={8} />
      <Twinkle cx={60} cy={20} r={4.5} fill="#fff" />
    </QTile>
  );
}

export function QuestDishes({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#E3F7FD">
      <Shadow cx={48} cy={84} rx={26} />
      <circle cx="46" cy="54" r="28" fill="#fff" {...ink} />
      <circle cx="46" cy="54" r="17" fill="#DDF4FC" stroke={SKY} strokeWidth={3} />
      <Hi cx={33} cy={40} rx={7} ry={4} rot={-35} />
      <g transform="rotate(-20 72 66)">
        <rect x="60" y="58" width="24" height="16" rx="5" fill={GOLD} {...ink} />
        <rect x="61.5" y="59.5" width="21" height="5" rx="2.5" fill={MINT} />
        <path d="M60 65h24" {...ink} />
        <circle cx="66" cy="70" r="1.6" fill={SHADE} />
        <circle cx="73" cy="69" r="1.6" fill={SHADE} />
        <circle cx="79" cy="70.5" r="1.6" fill={SHADE} />
      </g>
      <circle cx="74" cy="28" r="8" fill="#fff" stroke={SKY} strokeWidth={3} />
      <Hi cx={71} cy={25} rx={2.5} ry={1.6} rot={-35} />
      <circle cx="84" cy="44" r="5" fill="#fff" stroke={SKY} strokeWidth={2.5} />
      <circle cx="22" cy="24" r="5" fill="#fff" stroke={SKY} strokeWidth={2.5} />
    </QTile>
  );
}

export function QuestTrash({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#E2FAF1">
      <Shadow cy={86} rx={24} />
      <path d="M28 38h44l-4.5 41a6 6 0 0 1-6 5.5H38.5a6 6 0 0 1-6-5.5z" fill={MINT} {...ink} />
      <path d="M65.5 44l-3.6 34" stroke={INK} strokeOpacity={0.12} strokeWidth={5} strokeLinecap="round" />
      <Hi cx={36} cy={50} rx={3.5} ry={8} />
      <circle cx="42" cy="58" r="3" fill={INK} />
      <circle cx="58" cy="58" r="3" fill={INK} />
      <ellipse cx="36.5" cy="65" rx="3.5" ry="2.2" fill={PINK} fillOpacity={0.8} />
      <ellipse cx="63.5" cy="65" rx="3.5" ry="2.2" fill={PINK} fillOpacity={0.8} />
      <path d="M44 65q6 6 12 0" fill="none" {...thin} />
      <rect x="22" y="28" width="56" height="11" rx="5.5" fill={MINT} {...ink} />
      <path d="M42 28v-4a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v4" fill="none" {...ink} />
      <Hi cx={34} cy={31.5} rx={7} ry={1.8} />
      <Twinkle cx={82} cy={22} r={6} />
    </QTile>
  );
}

export function QuestLaundry({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#FFF0E0">
      <rect x="22" y="14" width="56" height="72" rx="12" fill="#fff" {...ink} />
      <path d="M22 32h56" {...ink} />
      <circle cx="33" cy="23" r="3.5" fill={CORAL} />
      <circle cx="44" cy="23" r="3.5" fill={GOLD} />
      <rect x="56" y="20" width="14" height="6" rx="3" fill={SKY} />
      <circle cx="50" cy="59" r="19" fill="#CDEFFB" />
      <path d="M31.2 62q4.7-4 9.4 0t9.4 0 9.4 0 9.4 0A19 19 0 0 1 31.2 62z" fill={SKY} />
      <path d="M44 66c-2 3 0 6 3 5l4-1" fill="none" stroke={PINK} strokeWidth={4} strokeLinecap="round" />
      <circle cx="44" cy="53" r="2.5" fill="#fff" />
      <circle cx="56" cy="50" r="3.5" fill="#fff" />
      <circle cx="50" cy="59" r="19" fill="none" {...ink} />
      <Hi cx={42} cy={49} rx={5} ry={2.6} rot={-35} />
      <Hi cx={29} cy={46} rx={2.5} ry={8} />
      <path d="M26 84h48" stroke={INK} strokeOpacity={0.12} strokeWidth={3} strokeLinecap="round" />
    </QTile>
  );
}

export function QuestDog({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#FFF3D6">
      <path d="M32 76q18 10 36 0" fill="none" stroke={CORAL} strokeWidth={7} strokeLinecap="round" />
      <circle cx="50" cy="85" r="4.5" fill={GOLD} {...thin} />
      <path d="M26 34c-8 4-10 20-4 28 5-2 9-10 10-18z" fill={BROWN} {...ink} />
      <path d="M74 34c8 4 10 20 4 28-5-2-9-10-10-18z" fill={BROWN} {...ink} />
      <ellipse cx="50" cy="52" rx="26" ry="25" fill={ORANGE} {...ink} />
      <ellipse cx="61" cy="46" rx="7.5" ry="6.5" fill={BROWN} />
      <Hi cx={38} cy={36} rx={7} ry={3.5} rot={-20} />
      <ellipse cx="50" cy="63" rx="14" ry="10" fill={CREAM} />
      <circle cx="40" cy="48" r="3.5" fill={INK} />
      <circle cx="60" cy="48" r="3.5" fill={INK} />
      <circle cx="41.2" cy="46.8" r="1.2" fill="#fff" />
      <circle cx="61.2" cy="46.8" r="1.2" fill="#fff" />
      <path d="M47 66h6v3a3 3 0 0 1-6 0z" fill={PINK} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <path d="M50 60.5v3.5M43.5 63q6.5 5 13 0" fill="none" {...thin} />
      <ellipse cx="50" cy="57.5" rx="5" ry="3.5" fill={INK} />
    </QTile>
  );
}

export function QuestPlant({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#E4F9EE">
      <path d="M50 54V34" fill="none" {...ink} />
      <path d="M50 46C44 32 30 30 22 34c4 12 16 16 28 12z" fill={MINT} {...ink} />
      <path d="M50 38c4-14 18-20 28-16-2 12-14 20-28 16z" fill={MINT} {...ink} />
      <path d="M46 43c-6-5-13-7-19-7M54 35c5-5 12-8 18-9" fill="none" stroke={INK} strokeOpacity={0.3} strokeWidth={2} strokeLinecap="round" />
      <path d="M32 62h36l-4 20a5 5 0 0 1-5 4H41a5 5 0 0 1-5-4z" fill={CORAL} {...ink} />
      <path d="M62.5 66l-3 16" stroke={INK} strokeOpacity={0.12} strokeWidth={4} strokeLinecap="round" />
      <rect x="28" y="52" width="44" height="11" rx="4.5" fill={CORAL} {...ink} />
      <Hi cx={38} cy={56} rx={6} ry={1.8} />
      <path d="M41 71q2.5-3 5 0M54 71q2.5-3 5 0" fill="none" {...thin} />
      <path d="M46 76q4 3.5 8 0" fill="none" {...thin} />
      <ellipse cx="39" cy="76" rx="3" ry="2" fill={PINK} />
      <ellipse cx="61" cy="76" rx="3" ry="2" fill={PINK} />
      <path d="M80 50s-5 6-5 9a5 5 0 0 0 10 0c0-3-5-9-5-9z" fill={SKY} {...thin} />
      <path d="M18 56s-3.5 4-3.5 6a3.5 3.5 0 0 0 7 0c0-2-3.5-6-3.5-6z" fill={SKY} {...thin} />
    </QTile>
  );
}

export function QuestBroom({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#FFF6D1">
      <g transform="translate(4 -6) rotate(28 50 50)">
        <rect x="46.5" y="16" width="7" height="42" rx="3.5" fill={ORANGE} {...ink} />
        <path d="M40 62h20l8 24a3 3 0 0 1-3 4H35a3 3 0 0 1-3-4z" fill={GOLD} {...ink} />
        <path d="M45 68l-3 17M50 68v17M55 68l3 17" stroke={SHADE} strokeWidth={2.5} strokeLinecap="round" />
        <rect x="40" y="54" width="20" height="9" rx="3" fill={CORAL} {...ink} />
      </g>
      <circle cx="72" cy="80" r="6" fill={CREAM} {...thin} />
      <circle cx="82" cy="72" r="4" fill={CREAM} {...thin} />
      <circle cx="63" cy="86" r="3" fill={CREAM} {...thin} />
      <Twinkle cx={26} cy={30} r={7} />
      <Twinkle cx={38} cy={18} r={4} fill="#fff" />
    </QTile>
  );
}

export function QuestVacuum({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#F0E6FF">
      <Shadow cx={58} cy={84} rx={30} />
      <path d="M48 64C36 64 28 68 26 76" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" />
      <path d="M48 64C36 64 28 68 26 76" fill="none" stroke={SKY} strokeWidth={4.5} strokeLinecap="round" />
      <rect x="12" y="75" width="28" height="9" rx="4.5" fill={INDIGO} {...ink} />
      <path d="M56 42v-6a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v6" fill="none" {...ink} />
      <rect x="46" y="42" width="38" height="32" rx="14" fill={GRAPE} {...ink} />
      <Hi cx={56} cy={50} rx={6} ry={3} rot={-15} />
      <circle cx="72" cy="52" r="4" fill={GOLD} {...thin} />
      <circle cx="56" cy="76" r="7" fill={INK} />
      <circle cx="76" cy="76" r="7" fill={INK} />
      <circle cx="56" cy="76" r="2.5" fill="#fff" />
      <circle cx="76" cy="76" r="2.5" fill="#fff" />
      <circle cx="44" cy="86" r="1.6" fill={INK} fillOpacity={0.3} />
      <circle cx="49" cy="83" r="1.2" fill={INK} fillOpacity={0.3} />
      <Twinkle cx={24} cy={30} r={7} />
      <Twinkle cx={38} cy={20} r={4} fill="#fff" />
    </QTile>
  );
}

export function QuestHomework({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#E3F0FF">
      <rect x="22" y="18" width="48" height="64" rx="6" fill="#fff" {...ink} />
      <path d="M32 20v60" stroke={CORAL} strokeWidth={2} />
      <path d="M37 32h24M37 42h24M37 52h18M37 62h22" stroke={SKY} strokeWidth={3} strokeLinecap="round" />
      <path d={starPath(52, 72, 6.5)} fill={GOLD} {...thin} />
      <path d="M26 84h44" stroke={INK} strokeOpacity={0.12} strokeWidth={3} strokeLinecap="round" />
      <g transform="rotate(35 66 52)">
        <rect x="60" y="38" width="12" height="28" rx="2" fill={GOLD} {...ink} />
        <path d="M66 42v21" stroke={SHADE} strokeWidth={2} strokeLinecap="round" />
        <rect x="60" y="28" width="12" height="10" rx="4" fill={PINK} {...ink} />
        <rect x="59" y="35" width="14" height="6" rx="2" fill={STEEL} {...thin} />
        <path d="M60 66l6 10 6-10z" fill={CREAM} {...ink} />
        <path d="M64.2 73l1.8 3 1.8-3z" fill={INK} />
      </g>
    </QTile>
  );
}

export function QuestToothbrush({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#E0F7FF">
      <g transform="rotate(-35 50 50)">
        <rect x="34" y="48" width="52" height="10" rx="5" fill={SKY} {...ink} />
        <rect x="42" y="50.5" width="28" height="2.5" rx="1.25" fill="#fff" fillOpacity={0.5} />
        <rect x="12" y="46" width="26" height="13" rx="5" fill={SKY} {...ink} />
        <rect x="14" y="34" width="22" height="12" rx="3" fill="#fff" {...ink} />
        <path d="M20 37v6M25 37v6M30 37v6" stroke={SKY} strokeWidth={2} strokeLinecap="round" />
        <path d="M14 34c-2-6 4-9 8-7 2-4 9-4 10 1 4-1 7 3 4 6z" fill={MINT} {...thin} />
        <Hi cx={22} cy={29.5} rx={3} ry={1.5} />
      </g>
      <circle cx="70" cy="72" r="6" fill="#fff" stroke={SKY} strokeWidth={2.5} />
      <circle cx="82" cy="60" r="4" fill="#fff" stroke={SKY} strokeWidth={2.5} />
      <circle cx="62" cy="84" r="3.5" fill="#fff" stroke={SKY} strokeWidth={2.5} />
      <Twinkle cx={78} cy={26} r={7} fill="#fff" />
    </QTile>
  );
}

export function QuestTable({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#FFEFE3">
      <rect x="14" y="24" width="72" height="52" rx="14" fill="#C9C8FF" {...ink} />
      <path d="M18 68h64" stroke={INK} strokeOpacity={0.1} strokeWidth={4} strokeLinecap="round" />
      <circle cx="50" cy="50" r="18" fill="#fff" {...ink} />
      <circle cx="50" cy="50" r="11" fill="none" stroke={STEEL} strokeWidth={3} />
      <circle cx="46" cy="47" r="3" fill={MINT} />
      <circle cx="53" cy="51" r="3" fill={MINT} />
      <circle cx="47" cy="54" r="3" fill={ORANGE} />
      <Hi cx={42} cy={39} rx={5} ry={2.5} rot={-30} />
      <path d="M20 32v10a4 4 0 0 0 8 0V32M24 32v10M24 46v22" fill="none" {...ink} />
      <path d="M76 32c6 4 6 15 0 20z" fill="#fff" {...ink} />
      <path d="M76 52v16" fill="none" {...ink} />
    </QTile>
  );
}

export function QuestToys({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#FFF1DB">
      <circle cx="36" cy="38" r="14" fill={CORAL} {...ink} />
      <path d="M23 34q13 8 26 0" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
      <Hi cx={31} cy={30} rx={4} ry={2.5} rot={-30} />
      <g transform="rotate(-12 63 36)">
        <rect x="52" y="25" width="22" height="22" rx="4" fill={SKY} {...ink} />
        <path d={starPath(63, 36.5, 6)} fill="#fff" />
      </g>
      <path d="M18 54h64l-5 28a5 5 0 0 1-5 4H28a5 5 0 0 1-5-4z" fill={ORANGE} {...ink} />
      <path d="M74 58l-4 24" stroke={INK} strokeOpacity={0.12} strokeWidth={4} strokeLinecap="round" />
      <rect x="14" y="46" width="72" height="10" rx="5" fill={GOLD} {...ink} />
      <Hi cx={26} cy={49.5} rx={7} ry={1.6} />
      <path d={starPath(50, 70, 8)} fill={CREAM} {...thin} />
    </QTile>
  );
}

export function QuestCarwash({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#E0F4FF">
      <Shadow cy={79} rx={36} />
      <path
        d="M14 66v-8a6 6 0 0 1 6-6h6l8-12a6 6 0 0 1 5-3h22a6 6 0 0 1 5 3l8 12h6a6 6 0 0 1 6 6v8a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4z"
        fill={CORAL}
        {...ink}
      />
      <path d="M36 51l6-9h7v9z" fill="#CDEFFB" {...thin} />
      <path d="M55 51v-9h7l6 9z" fill="#CDEFFB" {...thin} />
      <Hi cx={26} cy={58} rx={5} ry={2} />
      <circle cx="82" cy="60" r="2.5" fill={GOLD} />
      <circle cx="30" cy="70" r="8" fill={INK} />
      <circle cx="70" cy="70" r="8" fill={INK} />
      <circle cx="30" cy="70" r="3" fill={STEEL} />
      <circle cx="70" cy="70" r="3" fill={STEEL} />
      <circle cx="40" cy="33" r="6" fill="#fff" {...thin} />
      <circle cx="52" cy="29" r="7.5" fill="#fff" {...thin} />
      <circle cx="64" cy="33" r="5" fill="#fff" {...thin} />
      <path d="M20 22s-4 5-4 7.5a4 4 0 0 0 8 0c0-2.5-4-7.5-4-7.5z" fill={SKY} {...thin} />
      <path d="M82 26s-3.5 4-3.5 6a3.5 3.5 0 0 0 7 0c0-2-3.5-6-3.5-6z" fill={SKY} {...thin} />
    </QTile>
  );
}

export function QuestReading({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#EEE8FF">
      <path d="M14 36v40c12-4 26-3 36 3 10-6 24-7 36-3V36z" fill={INDIGO} {...ink} />
      <path d="M50 34C42 28 28 28 18 32v40c10-4 24-4 32 2z" fill="#fff" {...ink} />
      <path d="M50 34c8-6 22-6 32-2v40c-10-4-24-4-32 2z" fill="#fff" {...ink} />
      <path
        d="M24 42c6-2 13-2 20 0M24 50c6-2 13-2 20 0M24 58c6-2 13-2 20 0M56 42c7-2 14-2 20 0M56 50c7-2 14-2 20 0M56 58c7-2 10-2 13-1"
        fill="none"
        stroke={STEEL}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <path d="M50 34v40" stroke={INK} strokeOpacity={0.15} strokeWidth={3} strokeLinecap="round" />
      <Twinkle cx={50} cy={18} r={7} />
      <Twinkle cx={30} cy={20} r={4} fill="#fff" />
      <Twinkle cx={70} cy={20} r={5} fill={PINK} />
    </QTile>
  );
}

export function QuestMusic({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#FFE8F4">
      <rect x="14" y="54" width="72" height="30" rx="6" fill="#fff" {...ink} />
      <path d="M26 56v26M38 56v26M50 56v26M62 56v26M74 56v26" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <rect x="22.5" y="54" width="7" height="16" rx="2" fill={INK} />
      <rect x="34.5" y="54" width="7" height="16" rx="2" fill={INK} />
      <rect x="58.5" y="54" width="7" height="16" rx="2" fill={INK} />
      <rect x="70.5" y="54" width="7" height="16" rx="2" fill={INK} />
      <path d="M42 44V18l24-6v26M42 25l24-6" fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="37" cy="44" rx="6" ry="4.5" transform="rotate(-20 37 44)" fill={GRAPE} {...thin} />
      <ellipse cx="61" cy="38" rx="6" ry="4.5" transform="rotate(-20 61 38)" fill={GRAPE} {...thin} />
      <Twinkle cx={24} cy={26} r={6} />
      <Twinkle cx={80} cy={30} r={4.5} fill="#fff" />
    </QTile>
  );
}

export function QuestPetfood({ size = 64, className, ...rest }: ArtProps) {
  const bone = (
    <>
      <rect x="56" y="21" width="24" height="8" rx="4" />
      <circle cx="56" cy="21" r="4.5" />
      <circle cx="56" cy="29" r="4.5" />
      <circle cx="80" cy="21" r="4.5" />
      <circle cx="80" cy="29" r="4.5" />
    </>
  );
  return (
    <QTile size={size} className={className} rest={rest} tint="#FFF0E6">
      <g transform="rotate(-20 68 25)">
        <g fill={INK} stroke={INK} strokeWidth={6} strokeLinejoin="round">
          {bone}
        </g>
        <g fill={CREAM}>{bone}</g>
      </g>
      <Shadow cy={84} rx={32} />
      <path d="M24 58c2-10 50-10 52 0z" fill={BROWN} {...ink} />
      <circle cx="34" cy="54" r="3" fill="#8E4F1F" />
      <circle cx="44" cy="51" r="3" fill="#8E4F1F" />
      <circle cx="55" cy="51" r="3" fill="#8E4F1F" />
      <circle cx="65" cy="54" r="3" fill="#8E4F1F" />
      <path d="M16 58h68l-6 18a6 6 0 0 1-6 4H28a6 6 0 0 1-6-4z" fill={INDIGO} {...ink} />
      <rect x="12" y="54" width="76" height="9" rx="4.5" fill={INDIGO} {...ink} />
      <Hi cx={24} cy={57.5} rx={6} ry={1.6} />
      <circle cx="50" cy="72" r="4" fill="#fff" />
      <circle cx="44.5" cy="66.5" r="1.9" fill="#fff" />
      <circle cx="50" cy="65" r="1.9" fill="#fff" />
      <circle cx="55.5" cy="66.5" r="1.9" fill="#fff" />
      <Twinkle cx={26} cy={30} r={6} />
    </QTile>
  );
}

/** Generic star tile used when an unknown id slips through. */
export function QuestGeneric({ size = 64, className, ...rest }: ArtProps) {
  return (
    <QTile size={size} className={className} rest={rest} tint="#FFF6D1">
      <Shadow cy={82} rx={22} />
      <path d={starPath(50, 50, 30, 15)} fill={GOLD} {...ink} />
      <Hi cx={40} cy={40} rx={6} ry={3} rot={-30} />
      <circle cx="44" cy="52" r="2.5" fill={INK} />
      <circle cx="56" cy="52" r="2.5" fill={INK} />
      <path d="M46.5 58q3.5 3 7 0" fill="none" {...thin} />
    </QTile>
  );
}

const CORE_QUEST_ART = {
  bed: QuestBed,
  dishes: QuestDishes,
  trash: QuestTrash,
  laundry: QuestLaundry,
  dog: QuestDog,
  plant: QuestPlant,
  broom: QuestBroom,
  vacuum: QuestVacuum,
  homework: QuestHomework,
  toothbrush: QuestToothbrush,
  table: QuestTable,
  toys: QuestToys,
  carwash: QuestCarwash,
  reading: QuestReading,
  music: QuestMusic,
  petfood: QuestPetfood,
};

const CORE_QUEST_LABELS = {
  bed: 'Make your bed',
  dishes: 'Do the dishes',
  trash: 'Take out the trash',
  laundry: 'Help with laundry',
  dog: 'Walk the dog',
  plant: 'Water the plants',
  broom: 'Sweep the floor',
  vacuum: 'Vacuum your room',
  homework: 'Finish your homework',
  toothbrush: 'Brush your teeth',
  table: 'Set the table',
  toys: 'Pick up your toys',
  carwash: 'Wash the car',
  reading: 'Read for 20 minutes',
  music: 'Practice music',
  petfood: 'Feed the pet',
};

/** Every quest sticker. `satisfies` fails the build if a shared id has no art or label. */
export const QUEST_ART = { ...CORE_QUEST_ART, ...MORE_QUEST_ART_A, ...MORE_QUEST_ART_B } satisfies Record<QuestIconId, (p: ArtProps) => ReactElement>;
export const QUEST_LABELS = { ...CORE_QUEST_LABELS, ...MORE_QUEST_LABELS_A, ...MORE_QUEST_LABELS_B } satisfies Record<QuestIconId, string>;

/** A quest's sticker, or a letter tile from its title when it has no picture. */
export function QuestIcon({ id, title = '', ...p }: Omit<ArtProps, 'id'> & { id: QuestIconId | null; title?: string }) {
  if (!id) return <LetterTile title={title} shape="square" {...p} />;
  const Art = (QUEST_ART as Record<string, ((p: ArtProps) => ReactElement) | undefined>)[id] ?? QuestGeneric;
  return <Art {...p} />;
}
