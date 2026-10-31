import { useId } from 'react';
import type { ReactElement } from 'react';
import type { RewardIconId } from '@kk/shared';
import type { ArtProps } from './types';
import { MORE_REWARD_ART, MORE_REWARD_LABELS } from './reward-icons-2';
import { INK, INDIGO, GOLD, SHADE, MINT, CORAL, SKY, GRAPE, PINK, CREAM, ORANGE, BROWN, STEEL, NIGHT, Hi, Shadow, Twinkle, starPath, RTile, ink, thin, LetterTile } from './sticker-kit';

export function RewardIcecream({ size = 64, className, ...rest }: ArtProps) {
  const clip = useId();
  const cone = 'M36 50h28L52 86a2.2 2.2 0 0 1-4 0z';
  return (
    <RTile size={size} className={className} rest={rest} tint="#FFE6F2">
      <clipPath id={clip}>
        <path d={cone} />
      </clipPath>
      <path d={cone} fill={GOLD} />
      <g clipPath={`url(#${clip})`} stroke={SHADE} strokeWidth={2.5}>
        <path d="M30 50l40 40M30 64l30 30M40 46l40 40M70 50L30 90M70 64L40 94M60 46L20 86" />
      </g>
      <path d={cone} fill="none" {...ink} />
      <circle cx="50" cy="34" r="14" fill={PINK} {...ink} />
      <Hi cx={44} cy={27} rx={4} ry={2.5} rot={-30} />
      <path
        d="M32 52a18 16 0 0 1 36 0c0 3-3 5-6 3-3 3-6 3-8 0-3 3-6 3-8 0-3 3-6 3-8 0-3 2-6 0-6-3z"
        fill={MINT}
        {...ink}
      />
      <Hi cx={39} cy={42} rx={4} ry={2.2} rot={-30} />
      <circle cx="44" cy="47" r="2.5" fill={INK} />
      <circle cx="56" cy="47" r="2.5" fill={INK} />
      <path d="M47 51q3 3 6 0" fill="none" {...thin} />
      <path d="M50 14q2-6 8-7" fill="none" {...thin} />
      <circle cx="50" cy="18" r="5" fill={CORAL} {...thin} />
      <Twinkle cx={78} cy={30} r={6} />
    </RTile>
  );
}

export function RewardGamepad({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint="#E6E8FF">
      <Shadow cy={80} rx={28} />
      <path
        d="M30 34h40c10 0 16 8 18 22 2 12-2 20-8 20-5 0-8-4-12-10H32c-4 6-7 10-12 10-6 0-10-8-8-20 2-14 8-22 18-22z"
        fill={INDIGO}
        {...ink}
      />
      <Hi cx={30} cy={40} rx={6} ry={3} rot={-15} />
      <path d="M30 44h6v6h6v6h-6v6h-6v-6h-6v-6h6z" fill="#fff" stroke="#fff" strokeWidth={1.5} strokeLinejoin="round" />
      <circle cx="66" cy="45" r="3.8" fill={GOLD} stroke={INK} strokeWidth={2} />
      <circle cx="73" cy="52" r="3.8" fill={CORAL} stroke={INK} strokeWidth={2} />
      <circle cx="59" cy="52" r="3.8" fill={MINT} stroke={INK} strokeWidth={2} />
      <circle cx="66" cy="59" r="3.8" fill={SKY} stroke={INK} strokeWidth={2} />
      <Twinkle cx={80} cy={22} r={6} />
      <Twinkle cx={22} cy={24} r={4} fill="#fff" />
    </RTile>
  );
}

export function RewardPizza({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint="#FFEBD9">
      <path d="M20 30Q50 18 80 30L52 84a2.5 2.5 0 0 1-4 0z" fill={GOLD} {...ink} />
      <path d="M17 30Q50 14 83 30l-3.5 8Q50 24 20.5 38z" fill={ORANGE} {...ink} />
      <Hi cx={36} cy={27} rx={6} ry={1.8} rot={-12} />
      <circle cx="42" cy="46" r="6" fill={CORAL} {...thin} />
      <circle cx="58" cy="49" r="5.5" fill={CORAL} {...thin} />
      <circle cx="50" cy="63" r="5" fill={CORAL} {...thin} />
      <circle cx="40.5" cy="44.5" r="1.3" fill="#fff" fillOpacity={0.6} />
      <circle cx="56.5" cy="47.5" r="1.3" fill="#fff" fillOpacity={0.6} />
      <path d="M33 56l3 2M62 60l-2 3M48 75l3 1" stroke={MINT} strokeWidth={3} strokeLinecap="round" />
      <path d="M58 57c0 4 2 6 2 9" fill="none" stroke={SHADE} strokeWidth={2.5} strokeLinecap="round" />
    </RTile>
  );
}

export function RewardMovie({ size = 64, className, ...rest }: ArtProps) {
  const clip = useId();
  const bucket = 'M28 42h44l-5.5 39a4 4 0 0 1-4 3.5h-25a4 4 0 0 1-4-3.5z';
  return (
    <RTile size={size} className={className} rest={rest} tint="#FFE5E5">
      <circle cx="35" cy="36" r="8" fill={CREAM} {...thin} />
      <circle cx="65" cy="36" r="8" fill={CREAM} {...thin} />
      <circle cx="46" cy="28" r="9" fill={CREAM} {...thin} />
      <circle cx="57" cy="30" r="8" fill={CREAM} {...thin} />
      <circle cx="42" cy="39" r="7" fill={CREAM} {...thin} />
      <circle cx="56" cy="40" r="7" fill={CREAM} {...thin} />
      <circle cx="44" cy="25" r="2" fill="#fff" />
      <clipPath id={clip}>
        <path d={bucket} />
      </clipPath>
      <path d={bucket} fill="#fff" />
      <g clipPath={`url(#${clip})`} fill={CORAL}>
        <rect x="33" y="40" width="7" height="50" />
        <rect x="46.5" y="40" width="7" height="50" />
        <rect x="60" y="40" width="7" height="50" />
        <rect x="24" y="76" width="52" height="12" fill={INK} fillOpacity={0.1} />
      </g>
      <path d={bucket} fill="none" {...ink} />
      <rect x="25" y="40" width="50" height="7" rx="3.5" fill="#fff" {...ink} />
      <path d={starPath(50, 63, 7.5)} fill={GOLD} {...thin} />
      <Twinkle cx={80} cy={58} r={6} />
      <Twinkle cx={20} cy={60} r={4} fill="#fff" />
    </RTile>
  );
}

export function RewardToycar({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint="#E6F7FF">
      <Shadow cy={79} rx={34} />
      <path d="M18 34h8M13 40h8" stroke={INK} strokeOpacity={0.3} strokeWidth={3} strokeLinecap="round" />
      <path
        d="M12 64c0-8 6-12 14-12l10-10h20l12 10h10c6 0 10 4 10 10v4a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4z"
        fill={ORANGE}
        {...ink}
      />
      <path d="M38 45h16l7 7H32z" fill="#CDEFFB" {...thin} />
      <path d="M14 61h72" stroke="#fff" strokeOpacity={0.6} strokeWidth={3} strokeLinecap="round" />
      <Hi cx={24} cy={56} rx={5} ry={1.8} />
      <circle cx="52" cy="62" r="6" fill="#fff" stroke={INK} strokeWidth={2} />
      <path d="M50.8 59.6l2-1.4v7.6" fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="85" cy="58" r="2.3" fill={GOLD} />
      <circle cx="30" cy="70" r="9" fill={INK} />
      <circle cx="72" cy="70" r="9" fill={INK} />
      <circle cx="30" cy="70" r="3.5" fill={GOLD} />
      <circle cx="72" cy="70" r="3.5" fill={GOLD} />
    </RTile>
  );
}

export function RewardBook({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint="#E8F8EE">
      <Shadow cx={49} cy={80} rx={32} />
      <rect x="18" y="64" width="62" height="14" rx="4" fill={CORAL} {...ink} />
      <path d="M26 71h40" stroke="#fff" strokeOpacity={0.55} strokeWidth={3} strokeLinecap="round" />
      <rect x="24" y="50" width="56" height="14" rx="4" fill={SKY} {...ink} />
      <path d="M72 50v14" stroke="#fff" strokeOpacity={0.55} strokeWidth={3} />
      <path d="M30 57h28" stroke={INK} strokeOpacity={0.15} strokeWidth={3} strokeLinecap="round" />
      <g transform="rotate(-6 47 43)">
        <rect x="20" y="36" width="54" height="14" rx="4" fill={GOLD} {...ink} />
        <path d="M28 43h30" stroke={SHADE} strokeWidth={3} strokeLinecap="round" />
        <Hi cx={30} cy={39.5} rx={6} ry={1.4} />
      </g>
      <path d="M64 64v10l3-2.4 3 2.4V64z" fill={PINK} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <Twinkle cx={50} cy={22} r={7} />
      <Twinkle cx={72} cy={26} r={4} fill="#fff" />
    </RTile>
  );
}

export function RewardTablet({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint="#E3F2FF">
      <g transform="rotate(8 50 50)">
        <rect x="24" y="18" width="52" height="66" rx="9" fill={NIGHT} {...ink} />
        <rect x="30" y="25" width="40" height="50" rx="4" fill={SKY} />
        <path d="M30 42L47 25h9L30 51z" fill="#fff" fillOpacity={0.3} />
        <circle cx="50" cy="50" r="11" fill="#fff" {...thin} />
        <path d="M47 44.5l9 5.5-9 5.5z" fill={CORAL} stroke={CORAL} strokeWidth={2} strokeLinejoin="round" />
        <circle cx="50" cy="79.5" r="2" fill="#fff" fillOpacity={0.6} />
      </g>
      <Twinkle cx={82} cy={30} r={6} />
      <Twinkle cx={18} cy={70} r={4.5} fill="#fff" />
    </RTile>
  );
}

export function RewardPark({ size = 64, className, ...rest }: ArtProps) {
  const clip = useId();
  const crown = (
    <>
      <circle cx="31" cy="36" r="12" />
      <circle cx="22" cy="45" r="8" />
      <circle cx="40" cy="45" r="8" />
    </>
  );
  return (
    <RTile size={size} className={className} rest={rest} tint="#E2F4FF">
      <clipPath id={clip}>
        <circle cx="50" cy="50" r="46" />
      </clipPath>
      <path d="M66 16l9 11-9 13-9-13z" fill={CORAL} {...thin} />
      <path d="M66 16v24M57 27h18" stroke={INK} strokeOpacity={0.35} strokeWidth={1.5} />
      <path d="M66 40q-5 6 0 10t0 10" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <path d="M63 47l3 1.5 3-1.5M63 56l3 1.5 3-1.5" fill="none" stroke={GOLD} strokeWidth={2.5} strokeLinecap="round" />
      <g clipPath={`url(#${clip})`}>
        <path d="M2 68Q30 54 55 66T98 60V98H2z" fill={MINT} {...ink} />
        <path d="M10 80q20-6 40 0" fill="none" stroke="#fff" strokeOpacity={0.3} strokeWidth={3} strokeLinecap="round" />
      </g>
      <rect x="27.5" y="44" width="7" height="22" rx="2" fill={BROWN} {...thin} />
      <g fill={INK} stroke={INK} strokeWidth={6}>
        {crown}
      </g>
      <g fill="#22B07D">{crown}</g>
      <Hi cx={26} cy={31} rx={4} ry={2.5} rot={-30} />
      <circle cx="58" cy="72" r="2.5" fill={PINK} />
      <circle cx="72" cy="68" r="2.5" fill={GOLD} />
      <circle cx="44" cy="76" r="2.5" fill="#fff" />
    </RTile>
  );
}

export function RewardBike({ size = 64, className, ...rest }: ArtProps) {
  const frame = 'M28 62L42 40H64M42 40L50 62L28 62M50 62L64 40L72 62';
  return (
    <RTile size={size} className={className} rest={rest} tint="#FFE8E0">
      <Shadow cy={79} rx={34} />
      {[28, 72].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="62" r="14" fill="#fff" fillOpacity={0.6} stroke={INK} strokeWidth={5} />
          <circle cx={cx} cy="62" r="9" fill="none" stroke={SKY} strokeWidth={2.5} />
          <circle cx={cx} cy="62" r="3" fill={INK} />
        </g>
      ))}
      <path d={frame} fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
      <path d={frame} fill="none" stroke={CORAL} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M42 40l-1.5-6M64 40l-3-8M57 31.5h8" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      <path d="M35 33.5h11" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <circle cx="50" cy="62" r="4" fill={GOLD} stroke={INK} strokeWidth={2} />
      <Twinkle cx={80} cy={26} r={6} />
    </RTile>
  );
}

export function RewardCandy({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint="#F3E8FF">
      <path d="M50 54v32" stroke={INK} strokeWidth={9} strokeLinecap="round" />
      <path d="M50 54v32" stroke="#fff" strokeWidth={4.5} strokeLinecap="round" />
      <circle cx="50" cy="36" r="20" fill={PINK} {...ink} />
      <path
        d="M50 36a4 4 0 0 1 4 4 8 8 0 0 1-8 8 12 12 0 0 1-12-12 16 16 0 0 1 16-16"
        fill="none"
        stroke="#fff"
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      <Hi cx={40} cy={24} rx={5} ry={2.5} rot={-35} />
      <path d="M66 70l-6-5v10zM82 70l6-5v10z" fill={GOLD} {...thin} />
      <ellipse cx="74" cy="70" rx="8" ry="6.5" fill={GOLD} {...thin} />
      <path d="M71 67q3-2 6 0" fill="none" stroke="#fff" strokeOpacity={0.6} strokeWidth={2} strokeLinecap="round" />
      <path d="M18 72l-6-5v10zM34 72l6-5v10z" fill={MINT} {...thin} />
      <ellipse cx="26" cy="72" rx="8" ry="6.5" fill={MINT} {...thin} />
      <path d="M23 69q3-2 6 0" fill="none" stroke="#fff" strokeOpacity={0.6} strokeWidth={2} strokeLinecap="round" />
      <Twinkle cx={80} cy={28} r={5} />
    </RTile>
  );
}

export function RewardTeddy({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint="#FFF0DE">
      <circle cx="29" cy="30" r="10" fill={BROWN} {...ink} />
      <circle cx="71" cy="30" r="10" fill={BROWN} {...ink} />
      <circle cx="29" cy="30" r="5" fill="#F5B98A" />
      <circle cx="71" cy="30" r="5" fill="#F5B98A" />
      <circle cx="50" cy="52" r="28" fill={BROWN} {...ink} />
      <Hi cx={38} cy={36} rx={7} ry={3.5} rot={-25} />
      <ellipse cx="50" cy="63" rx="12" ry="9" fill="#F5D3AE" />
      <circle cx="40" cy="49" r="3.5" fill={INK} />
      <circle cx="60" cy="49" r="3.5" fill={INK} />
      <circle cx="41.2" cy="47.8" r="1.2" fill="#fff" />
      <circle cx="61.2" cy="47.8" r="1.2" fill="#fff" />
      <ellipse cx="33" cy="58" rx="3.5" ry="2.2" fill={PINK} fillOpacity={0.8} />
      <ellipse cx="67" cy="58" rx="3.5" ry="2.2" fill={PINK} fillOpacity={0.8} />
      <path d="M50 61v3M45 64q5 4 10 0" fill="none" {...thin} />
      <ellipse cx="50" cy="58.5" rx="4.5" ry="3.2" fill={INK} />
      <path d="M50 81l-12-7v14zM50 81l12-7v14z" fill={CORAL} {...thin} />
      <circle cx="50" cy="81" r="4" fill={CORAL} {...thin} />
    </RTile>
  );
}

export function RewardArt({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint="#FFF6D6">
      <path
        d="M50 18c20 0 34 14 34 30 0 10-8 14-16 12-6-2-10 2-8 8 2 7-3 14-12 14-20 0-34-14-34-32s16-32 36-32z"
        fill={CREAM}
        {...ink}
      />
      <Hi cx={36} cy={26} rx={7} ry={3} rot={-25} />
      <circle cx="40" cy="66" r="5" fill="#FFF6D6" {...thin} />
      <circle cx="33" cy="40" r="6" fill={CORAL} {...thin} />
      <circle cx="48" cy="31" r="6" fill={SKY} {...thin} />
      <circle cx="64" cy="35" r="6" fill={MINT} {...thin} />
      <circle cx="27" cy="55" r="6" fill={GRAPE} {...thin} />
      <g transform="rotate(-40 72 66)">
        <rect x="69" y="52" width="6" height="28" rx="3" fill={ORANGE} {...thin} />
        <rect x="68" y="46" width="8" height="8" rx="1.5" fill={STEEL} {...thin} />
        <path d="M68 46c0-6 4-10 4-12 0 2 4 6 4 12z" fill={PINK} {...thin} />
      </g>
    </RTile>
  );
}

export function RewardHeadphones({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint="#E8F0FF">
      <path d="M22 58V48a28 28 0 0 1 56 0v10" fill="none" stroke={INK} strokeWidth={11} strokeLinecap="round" />
      <path d="M22 58V48a28 28 0 0 1 56 0v10" fill="none" stroke={GRAPE} strokeWidth={5} strokeLinecap="round" />
      <rect x="28" y="56" width="9" height="20" rx="4" fill={PINK} {...thin} />
      <rect x="63" y="56" width="9" height="20" rx="4" fill={PINK} {...thin} />
      <rect x="14" y="52" width="18" height="28" rx="8" fill={GRAPE} {...ink} />
      <rect x="68" y="52" width="18" height="28" rx="8" fill={GRAPE} {...ink} />
      <Hi cx={19.5} cy={60} rx={2.2} ry={5} />
      <Hi cx={73.5} cy={60} rx={2.2} ry={5} />
      <path d="M53 60V42q6 2 8 7" fill="none" {...ink} />
      <ellipse cx="49" cy="60" rx="5" ry="4" transform="rotate(-20 49 60)" fill={MINT} {...thin} />
      <Twinkle cx={42} cy={44} r={4} />
    </RTile>
  );
}

export function RewardMoon({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint={NIGHT}>
      <path d="M58 24A28 28 0 1 0 78 64A22 22 0 0 1 58 24z" fill={GOLD} {...ink} />
      <Hi cx={32} cy={38} rx={6} ry={3} rot={-45} />
      <path d="M30 50q3.5 3 7 0M42 54q3.5 3 7 0" fill="none" {...thin} />
      <path d="M35 63q4 3 8 0" fill="none" {...thin} />
      <ellipse cx="29" cy="58" rx="3" ry="2" fill={PINK} />
      <path d="M66 20h7l-7 8h7M78 33h5l-5 6h5" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <Twinkle cx={24} cy={26} r={4.5} fill="#fff" />
      <Twinkle cx={76} cy={76} r={5} />
      <circle cx="62" cy="84" r="1.6" fill="#fff" />
      <circle cx="84" cy="54" r="1.6" fill="#fff" />
    </RTile>
  );
}

export function RewardTent({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint="#E3F6FF">
      <path d="M14 78h72" fill="none" {...ink} />
      <path d="M50 22V9" fill="none" {...ink} />
      <path d="M50 9l12 4.5L50 18z" fill={GOLD} {...thin} />
      <path d="M50 22L82 76H18z" fill={CORAL} {...ink} />
      <path d="M50 22L30 76M50 22L70 76" stroke="#fff" strokeOpacity={0.35} strokeWidth={3} strokeLinecap="round" />
      <path d="M50 44L60 76H40z" fill={NIGHT} {...thin} />
      <path d="M50 44L44 76h-4z" fill={CORAL} {...thin} />
      <circle cx="54" cy="68" r="1.8" fill={GOLD} />
      <circle cx="51" cy="64" r="1.2" fill={GOLD} />
      <Twinkle cx={22} cy={32} r={5} />
      <Twinkle cx={80} cy={36} r={4} fill="#fff" />
    </RTile>
  );
}

export function RewardGift({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint="#FFE6EC">
      <Shadow cy={84} rx={28} />
      <rect x="22" y="46" width="56" height="36" rx="5" fill={GRAPE} {...ink} />
      <circle cx="30" cy="58" r="2.5" fill="#fff" fillOpacity={0.5} />
      <circle cx="36" cy="72" r="2.5" fill="#fff" fillOpacity={0.5} />
      <circle cx="66" cy="60" r="2.5" fill="#fff" fillOpacity={0.5} />
      <circle cx="70" cy="74" r="2.5" fill="#fff" fillOpacity={0.5} />
      <rect x="45" y="46" width="10" height="36" fill={GOLD} {...thin} />
      <rect x="18" y="36" width="64" height="12" rx="5" fill={GRAPE} {...ink} />
      <rect x="45" y="36" width="10" height="12" fill={GOLD} {...thin} />
      <Hi cx={28} cy={40} rx={6} ry={1.8} />
      <path d="M50 36c-6-12-20-12-18-2 1 4 10 4 18 2z" fill={GOLD} {...thin} />
      <path d="M50 36c6-12 20-12 18-2-1 4-10 4-18 2z" fill={GOLD} {...thin} />
      <circle cx="50" cy="35" r="4" fill={GOLD} {...thin} />
      <Twinkle cx={80} cy={24} r={6} />
      <Twinkle cx={20} cy={24} r={4} fill="#fff" />
    </RTile>
  );
}

/** Generic star coin used when an unknown id slips through. */
export function RewardGeneric({ size = 64, className, ...rest }: ArtProps) {
  return (
    <RTile size={size} className={className} rest={rest} tint="#FFF6D1">
      <path d={starPath(50, 52, 30, 15)} fill={GOLD} {...ink} />
      <Hi cx={40} cy={42} rx={6} ry={3} rot={-30} />
      <circle cx="44" cy="54" r="2.5" fill={INK} />
      <circle cx="56" cy="54" r="2.5" fill={INK} />
      <path d="M46.5 60q3.5 3 7 0" fill="none" {...thin} />
    </RTile>
  );
}

const CORE_REWARD_ART = {
  icecream: RewardIcecream,
  gamepad: RewardGamepad,
  pizza: RewardPizza,
  movie: RewardMovie,
  toycar: RewardToycar,
  book: RewardBook,
  tablet: RewardTablet,
  park: RewardPark,
  bike: RewardBike,
  candy: RewardCandy,
  teddy: RewardTeddy,
  art: RewardArt,
  headphones: RewardHeadphones,
  moon: RewardMoon,
  tent: RewardTent,
  gift: RewardGift,
};

const CORE_REWARD_LABELS = {
  icecream: 'Ice cream trip',
  gamepad: '30 min video games',
  pizza: 'Pizza night',
  movie: 'Movie night',
  toycar: 'New toy',
  book: 'New book',
  tablet: 'Extra screen time',
  park: 'Trip to the park',
  bike: 'Bike ride adventure',
  candy: 'Sweet treat',
  teddy: 'New stuffed animal',
  art: 'Art supplies',
  headphones: 'Music time',
  moon: 'Stay up late',
  tent: 'Sleepover',
  gift: 'Surprise gift',
};

/** Every reward sticker. `satisfies` fails the build if a shared id has no art or label. */
export const REWARD_ART = { ...CORE_REWARD_ART, ...MORE_REWARD_ART } satisfies Record<RewardIconId, (p: ArtProps) => ReactElement>;
export const REWARD_LABELS = { ...CORE_REWARD_LABELS, ...MORE_REWARD_LABELS } satisfies Record<RewardIconId, string>;

/** A reward or goal sticker, or a letter tile from its title when it has no picture. */
export function RewardIcon({ id, title = '', ...p }: Omit<ArtProps, 'id'> & { id: RewardIconId | null; title?: string }) {
  if (!id) return <LetterTile title={title} shape="circle" {...p} />;
  const Art = (REWARD_ART as Record<string, ((p: ArtProps) => ReactElement) | undefined>)[id] ?? RewardGeneric;
  return <Art {...p} />;
}
