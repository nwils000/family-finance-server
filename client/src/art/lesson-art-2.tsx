// Lesson illustrations, library expansion A: money basics, earning, spending, banking and credit.
// Same 200x140 rounded tile and sticker style as lesson-art.tsx; `size` sets the width (height is 0.7x).
// lesson-art.tsx imports this file, so the small scene helpers below are local (importing back would be circular).
import { useId, type ReactElement, type ReactNode } from 'react';
import type { LessonArtId } from '@kk/shared';
import type { ArtProps } from './types';
import {
  BROWN, CORAL, CREAM, GOLD, GRAPE, Hi, INDIGO, INK, InkText, MINT, NIGHT, ORANGE, PINK, SHADE, SKY, STEEL,
  Shadow, Twinkle, heartPath, ink, starPath, thin,
} from './sticker-kit';
import { CoinFace, PiggyBank } from './money';

const SKIN = '#FFD3B0';
const LEAF = '#1FB386';
const LIME = '#B5E35A';

const useUid = () => useId().replace(/:/g, '');

/* ------------------------------------------------------------------ helpers */

function Frame({ size, className, rest, tint, children }: {
  size: number | string;
  className?: string;
  rest: Omit<ArtProps, 'size' | 'className'>;
  tint: string;
  children: ReactNode;
}) {
  const clip = `kk-lesson2-${useUid()}`;
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

function Ground({ cy = 122, rx = 82, color = MINT }: { cy?: number; rx?: number; color?: string }) {
  return <ellipse cx={100} cy={cy} rx={rx} ry={8} fill={color} opacity={0.3} />;
}

function Arm({ x1, y1, x2, y2, color, s = 1 }: { x1: number; y1: number; x2: number; y2: number; color: string; s?: number }) {
  return (
    <g>
      <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={INK} strokeWidth={8 * s} strokeLinecap="round" />
      <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={color} strokeWidth={4.4 * s} strokeLinecap="round" />
      <circle cx={x2} cy={y2} r={3.8 * s} fill={SKIN} stroke={INK} strokeWidth={2.2 * s} />
    </g>
  );
}

/** Chibi kid with feet at (x, y), about 62 tall at s = 1. Shoulders sit at (x +/- 10s, y - 31s). */
function Kid({
  x, y, s = 1, shirt = INDIGO, hair = BROWN, pants = NIGHT, mood = 'happy', legs = true,
}: { x: number; y: number; s?: number; shirt?: string; hair?: string; pants?: string; mood?: 'happy' | 'think'; legs?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {legs && (
        <g>
          <Shadow cx={0} cy={0} rx={14} />
          <rect x={-8} y={-17} width={7} height={15} rx={3} fill={pants} {...thin} />
          <rect x={1} y={-17} width={7} height={15} rx={3} fill={pants} {...thin} />
          <ellipse cx={-5} cy={-2} rx={5} ry={3} fill={CORAL} {...thin} />
          <ellipse cx={5} cy={-2} rx={5} ry={3} fill={CORAL} {...thin} />
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
          <path d="M-7 -53 L-2 -52 M3 -52 L8 -54" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <ellipse cx={-4.5} cy={-47} rx={1.9} ry={2.5} fill={INK} />
          <ellipse cx={4.5} cy={-47} rx={1.9} ry={2.5} fill={INK} />
          <circle cx={-5.1} cy={-48} r={0.8} fill="#fff" />
          <circle cx={3.9} cy={-48} r={0.8} fill="#fff" />
          <path d="M-3.2 -42 Q0 -38.8 3.2 -42" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
        </g>
      )}
      <ellipse cx={-8.5} cy={-43} rx={2.6} ry={1.6} fill={PINK} opacity={0.65} />
      <ellipse cx={8.5} cy={-43} rx={2.6} ry={1.6} fill={PINK} opacity={0.65} />
    </g>
  );
}

/** Two dot eyes, blush and a smile centered on (cx, cy), for faces on objects. */
function Face({ cx, cy, s = 1 }: { cx: number; cy: number; s?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <ellipse cx={-5} cy={-2} rx={1.9} ry={2.5} fill={INK} />
      <ellipse cx={5} cy={-2} rx={1.9} ry={2.5} fill={INK} />
      <circle cx={-5.6} cy={-3} r={0.8} fill="#fff" />
      <circle cx={4.4} cy={-3} r={0.8} fill="#fff" />
      <path d="M-3 2.5 Q0 5.5 3 2.5" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <ellipse cx={-9} cy={2} rx={2.4} ry={1.4} fill={PINK} opacity={0.7} />
      <ellipse cx={9} cy={2} rx={2.4} ry={1.4} fill={PINK} opacity={0.7} />
    </g>
  );
}

/** Price tag pointing left, its body w x h, the hole end at (x, cy). */
function Tag({ x, cy, w, h, fill, children }: { x: number; cy: number; w: number; h: number; fill: string; children?: ReactNode }) {
  const t = cy - h / 2;
  const b = cy + h / 2;
  return (
    <g>
      <path d={`M${x + 8} ${t} H${x + w - 4} Q${x + w} ${t} ${x + w} ${t + 4} V${b - 4} Q${x + w} ${b} ${x + w - 4} ${b} H${x + 8} L${x} ${cy} Z`} fill={fill} {...thin} />
      <circle cx={x + 7} cy={cy} r={2} fill="#fff" stroke={INK} strokeWidth={1.5} />
      {children}
    </g>
  );
}

/** Dashed guide path with an arrow head at its end, pointing along `angle` degrees. */
function DashArrow({ d, ex, ey, angle, color = INK }: { d: string; ex: number; ey: number; angle: number; color?: string }) {
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth={2.5} strokeDasharray="4 5" strokeLinecap="round" opacity={0.6} />
      <path
        d={`M${ex - 6} ${ey - 5} L${ex} ${ey} L${ex - 6} ${ey + 5}`}
        transform={`rotate(${angle} ${ex} ${ey})`}
        fill="none"
        stroke={color}
        strokeWidth={2.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.75}
      />
    </g>
  );
}

/** Puffy cloud centered on (cx, cy), about 60 wide at s = 1. */
function Cloud({ cx, cy, s = 1, fill = '#fff', grumpy = false }: { cx: number; cy: number; s?: number; fill?: string; grumpy?: boolean }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <path d="M-24 10 C-34 10 -34 -4 -24 -4 C-24 -16 -8 -18 -4 -10 C0 -20 18 -20 18 -6 C30 -8 32 10 22 10 Z" fill={fill} {...ink} />
      <Hi cx={-12} cy={-8} rx={5} ry={2} rot={-15} />
      {grumpy ? (
        <g>
          <ellipse cx={-6} cy={2} rx={1.7} ry={2.2} fill={INK} />
          <ellipse cx={5} cy={2} rx={1.7} ry={2.2} fill={INK} />
          <path d="M-9 -2.5 L-3 -1 M8 -2.5 L2 -1" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
          <path d="M-2.5 7.5 Q0 5.5 2.5 7.5" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
        </g>
      ) : null}
    </g>
  );
}

/** Point on a circle, angle in degrees counterclockwise from +x (screen y points down). */
const polar = (cx: number, cy: number, r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy - r * Math.sin(a)] as const;
};

/** Arc from angle a0 down to a1 (degrees, a0 > a1), drawn clockwise on screen. */
function arcPath(cx: number, cy: number, r: number, a0: number, a1: number) {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${a0 - a1 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}

/* ------------------------------------------------------------------ scenes */

/** Paper bill centered on the origin, 68 x 40. */
function PaperBill({ value, base, light, corner }: { value: string; base: string; light: string; corner?: 'left' | 'right' }) {
  return (
    <g>
      <rect x={-34} y={-20} width={68} height={40} rx={6} fill={base} {...ink} />
      <rect x={-30} y={-16} width={60} height={32} rx={4} fill={light} />
      <rect x={-27} y={-13} width={54} height={26} rx={3} fill="none" stroke="#fff" strokeWidth={1.6} strokeDasharray="3 3" opacity={0.85} />
      <ellipse cx={0} cy={0} rx={13} ry={11} fill="#fff" stroke={INK} strokeWidth={2} />
      <InkText cx={0} cy={0} fontSize={value.length > 1 ? 12 : 14} fill={base} strokeWidth={2.4}>
        {value}
      </InkText>
      <circle cx={-22} cy={-9} r={3} fill="#fff" opacity={0.8} />
      <circle cx={22} cy={9} r={3} fill="#fff" opacity={0.8} />
      <Hi cx={-20} cy={-14} rx={6} ry={1.4} />
      {/* fanned-out bills show their value in the corner that peeks out */}
      {corner && (
        <g>
          <circle cx={corner === 'left' ? -22 : 22} cy={-8} r={8} fill="#fff" stroke={INK} strokeWidth={1.8} />
          <InkText cx={corner === 'left' ? -22 : 22} cy={-8} fontSize={value.length > 1 ? 8.5 : 10} fill={base} strokeWidth={2}>
            {value}
          </InkText>
        </g>
      )}
    </g>
  );
}

export function LessonArtMoneyBasics({ size = 200, className, ...rest }: ArtProps) {
  const bills = [
    { a: -30, value: '1', base: '#1DB98A', light: MINT, corner: 'left' as const },
    { a: 30, value: '10', base: GRAPE, light: '#BE94F5', corner: 'right' as const },
    { a: 0, value: '5', base: '#1FA2D2', light: SKY, corner: undefined },
  ];
  return (
    <Frame size={size} className={className} rest={rest} tint="#FFF3C4">
      <Ground cy={124} rx={86} color={SHADE} />
      {bills.map((b) => (
        <g key={b.value} transform={`translate(78 124) rotate(${b.a}) translate(0 -58)`}>
          <PaperBill value={b.value} base={b.base} light={b.light} corner={b.corner} />
        </g>
      ))}
      {/* coins of different sizes in front */}
      <Shadow cx={136} cy={124} rx={40} />
      <CoinFace cx={106} cy={114} r={8} />
      <CoinFace cx={124} cy={110} r={11} />
      <CoinFace cx={154} cy={104} r={17} />
      <Face cx={153} cy={104} s={0.9} />
      {/* friendly price tag on a string */}
      <path d="M150 8 Q158 18 156 30" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <g transform="rotate(28 156 32)">
        <Tag x={154} cy={32} w={38} h={20} fill={CORAL}>
          <InkText cx={175} cy={32} fontSize={12} fill="#fff" strokeWidth={2.6}>
            $3
          </InkText>
        </Tag>
      </g>
      <Twinkle cx={186} cy={76} r={5} />
      <Twinkle cx={20} cy={22} r={5} />
      <Twinkle cx={128} cy={20} r={3.5} fill="#fff" />
    </Frame>
  );
}

export function LessonArtBarter({ size = 200, className, ...rest }: ArtProps) {
  const flags = [CORAL, GOLD, MINT, SKY, GRAPE, PINK, ORANGE, CORAL, GOLD];
  return (
    <Frame size={size} className={className} rest={rest} tint="#FFEBD6">
      <Ground cy={124} color={ORANGE} />
      {/* market bunting */}
      <path d="M-4 10 Q100 34 204 10" fill="none" stroke={INK} strokeWidth={2} />
      {flags.map((c, i) => {
        const x = 8 + i * 23;
        const t = (x + 4) / 208;
        const y = 10 + 48 * t * (1 - t);
        return <path key={i} d={`M${x - 7} ${y} L${x + 7} ${y + 0.5} L${x} ${y + 13} Z`} fill={c} {...thin} strokeWidth={2} />;
      })}
      {/* the swap */}
      <DashArrow d="M68 52 Q100 34 130 50" ex={132} ey={51} angle={25} color={INDIGO} />
      <DashArrow d="M132 68 Q100 84 70 70" ex={68} ey={69} angle={205} color={CORAL} />
      {/* left kid with an apple basket */}
      <Kid x={38} y={126} s={1.1} shirt={MINT} hair={NIGHT} />
      <g>
        <path d="M58 88 Q72 66 86 88" fill="none" stroke={INK} strokeWidth={5.5} strokeLinecap="round" />
        <path d="M58 88 Q72 66 86 88" fill="none" stroke={BROWN} strokeWidth={2.6} strokeLinecap="round" />
        {[[64, 86], [80, 86], [72, 82]].map(([x, y]) => (
          <g key={x}>
            <circle cx={x} cy={y} r={6} fill={CORAL} {...thin} strokeWidth={2} />
            <Hi cx={x - 2} cy={y - 2} rx={1.8} ry={1.1} rot={-30} />
            <path d={`M${x} ${y - 6} l1.5 -3`} stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
          </g>
        ))}
        <path d="M54 88 H90 L86 106 Q85 110 81 110 H63 Q59 110 58 106 Z" fill={GOLD} {...ink} />
        <path d="M57 96 H87 M59 103 H85 M66 89 V109 M78 89 V109" stroke={SHADE} strokeWidth={1.6} />
        <path d="M54 88 H90 L86 106 Q85 110 81 110 H63 Q59 110 58 106 Z" fill="none" {...ink} />
      </g>
      <Arm x1={27} y1={92} x2={23} y2={107} color={MINT} s={1.1} />
      <Arm x1={49} y1={92} x2={58} y2={99} color={MINT} s={1.1} />
      {/* right kid with a fish */}
      <Kid x={162} y={126} s={1.1} shirt={CORAL} hair={ORANGE} />
      <g transform="translate(-6 0) rotate(-8 130 96)">
        <path d="M150 96 L162 86 L160 106 Z" fill={SKY} {...thin} />
        <path d="M106 96 C112 84 138 82 152 96 C138 110 112 108 106 96 Z" fill={SKY} {...ink} />
        <path d="M126 88 Q130 96 126 104" fill="none" stroke="#1FA2D2" strokeWidth={2} strokeLinecap="round" />
        <path d="M134 89 Q138 96 134 103" fill="none" stroke="#1FA2D2" strokeWidth={2} strokeLinecap="round" />
        <circle cx={115} cy={94} r={2.2} fill={INK} />
        <circle cx={114.3} cy={93.2} r={0.8} fill="#fff" />
        <path d="M108 99 q2 1.5 4 0" fill="none" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
        <Hi cx={122} cy={88} rx={6} ry={1.6} rot={-8} />
      </g>
      <Arm x1={151} y1={92} x2={140} y2={100} color={CORAL} s={1.1} />
      <Arm x1={173} y1={92} x2={177} y2={107} color={CORAL} s={1.1} />
      <Twinkle cx={100} cy={100} r={5} />
      <Twinkle cx={186} cy={44} r={4} fill="#fff" />
    </Frame>
  );
}

export function LessonArtJobs({ size = 200, className, ...rest }: ArtProps) {
  const puffs: [number, number, number][] = [[30, 76, 10], [50, 76, 10], [40, 64, 13], [28, 66, 8], [52, 66, 8]];
  return (
    <Frame size={size} className={className} rest={rest} tint="#DCF3FD">
      {/* shelf */}
      <rect x={10} y={104} width={180} height={9} rx={3} fill={BROWN} {...ink} />
      <path d="M30 113 L36 124 M170 113 L164 124" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <path d="M30 113 L36 124 M170 113 L164 124" stroke={BROWN} strokeWidth={2.2} strokeLinecap="round" />
      <Hi cx={40} cy={106.5} rx={14} ry={1.4} />
      {/* chef hat: outline every puff, then fill over the inside lines */}
      <g>
        {puffs.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#fff" stroke={INK} strokeWidth={6} />
        ))}
        {puffs.map(([x, y, r], i) => (
          <circle key={`f${i}`} cx={x} cy={y} r={r} fill="#fff" />
        ))}
        <rect x={26} y={78} width={28} height={24} rx={3} fill="#fff" {...ink} />
        <path d="M33 84 V98 M40 84 V98 M47 84 V98" stroke={STEEL} strokeWidth={2} strokeLinecap="round" />
        <Hi cx={34} cy={60} rx={5} ry={2.4} rot={-30} />
      </g>
      {/* hard hat */}
      <g>
        <path d="M76 96 Q76 64 100 62 Q124 64 124 96 Z" fill={GOLD} {...ink} />
        <path d="M95 63 Q95 80 96 96 H104 Q105 80 105 63" fill={SHADE} {...thin} strokeWidth={2} />
        <rect x={68} y={93} width={64} height={9} rx={4.5} fill={GOLD} {...ink} />
        <Hi cx={86} cy={72} rx={5} ry={2.6} rot={-40} />
      </g>
      {/* painter's palette and brush */}
      <g>
        <path d="M144 98 C132 96 134 74 150 68 C166 62 186 68 186 84 C186 94 178 92 172 94 C166 96 170 102 162 102 C156 102 152 99 144 98 Z" fill={CREAM} {...ink} />
        <ellipse cx={170} cy={86} rx={4} ry={3} fill={INK} opacity={0.2} />
        <circle cx={148} cy={84} r={4.5} fill={CORAL} {...thin} strokeWidth={2} />
        <circle cx={154} cy={74} r={4.5} fill={GOLD} {...thin} strokeWidth={2} />
        <circle cx={166} cy={72} r={4.5} fill={SKY} {...thin} strokeWidth={2} />
        <circle cx={177} cy={78} r={4.5} fill={MINT} {...thin} strokeWidth={2} />
        <circle cx={157} cy={94} r={4} fill={GRAPE} {...thin} strokeWidth={2} />
        <path d="M184 52 L162 90" stroke={INK} strokeWidth={6.5} strokeLinecap="round" />
        <path d="M184 52 L162 90" stroke={BROWN} strokeWidth={3.2} strokeLinecap="round" />
        <path d="M166 83 L161 92 Q158 97 158 99 Q161 98 164 94 L169 85 Z" fill={CORAL} {...thin} strokeWidth={2} />
      </g>
      {/* the pay */}
      <path d="M100 42 v6 M80 36 l4 4 M120 36 l-4 4" stroke={INK} strokeWidth={2.5} strokeLinecap="round" opacity={0.5} />
      <CoinFace cx={100} cy={24} r={13} />
      <InkText cx={126} cy={20} fontSize={13} fill={MINT} strokeWidth={3}>
        +
      </InkText>
      <Twinkle cx={66} cy={30} r={5} />
      <Twinkle cx={180} cy={30} r={4} fill="#fff" />
      <Twinkle cx={18} cy={40} r={4} fill="#fff" />
    </Frame>
  );
}

export function LessonArtBusiness({ size = 200, className, ...rest }: ArtProps) {
  return (
    <Frame size={size} className={className} rest={rest} tint="#FFEBD6">
      <Ground cy={124} color={ORANGE} />
      {/* posts and awning */}
      <rect x={16} y={34} width={6} height={56} rx={2} fill={BROWN} {...thin} />
      <rect x={110} y={34} width={6} height={56} rx={2} fill={BROWN} {...thin} />
      <path d="M10 22 H122 V36 H10 Z" fill="#fff" {...ink} />
      {[10, 32, 54, 76, 98].map((x) => (
        <rect key={x} x={x + 1.5} y={23.5} width={11} height={11} fill={CORAL} />
      ))}
      <path d="M10 22 H122 V36 H10 Z" fill="none" {...ink} />
      <path d="M10 36 q5.6 7 11.2 0 q5.6 7 11.2 0 q5.6 7 11.2 0 q5.6 7 11.2 0 q5.6 7 11.2 0 q5.6 7 11.2 0 q5.6 7 11.2 0 q5.6 7 11.2 0 q5.6 7 11.2 0 q5.6 7 11.2 0" fill={CORAL} {...thin} />
      {/* shopkeeper behind the counter */}
      <Kid x={48} y={118} s={0.9} shirt={INDIGO} hair={BROWN} legs={false} />
      {/* counter with the OPEN sign */}
      <rect x={8} y={82} width={116} height={38} rx={5} fill={GOLD} {...ink} />
      <path d="M8 90 H124" stroke={SHADE} strokeWidth={2} />
      <Hi cx={22} cy={86} rx={8} ry={1.5} />
      <path d="M44 92 L52 86 M88 92 L80 86" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <rect x={36} y={92} width={60} height={20} rx={6} fill={MINT} {...ink} />
      <InkText cx={66} cy={102} fontSize={13} fill="#fff" strokeWidth={3} letterSpacing={1}>
        OPEN
      </InkText>
      {/* cookies */}
      <ellipse cx={24} cy={80} rx={12} ry={3.5} fill="#fff" {...thin} strokeWidth={2} />
      <circle cx={20} cy={74} r={6} fill={BROWN} {...thin} strokeWidth={2} />
      <circle cx={29} cy={75} r={6} fill={ORANGE} {...thin} strokeWidth={2} />
      <circle cx={18.5} cy={73} r={1.2} fill={INK} />
      <circle cx={22} cy={76} r={1.2} fill={INK} />
      <circle cx={28} cy={74} r={1.2} fill={INK} />
      <circle cx={31} cy={77} r={1.2} fill={INK} />
      {/* cash box */}
      <rect x={82} y={64} width={30} height={18} rx={3} fill={NIGHT} {...ink} />
      <rect x={82} y={64} width={30} height={6} rx={3} fill={INDIGO} {...thin} strokeWidth={2} />
      <rect x={91} y={66} width={12} height={2.4} rx={1.2} fill={INK} />
      <circle cx={97} cy={76} r={2.6} fill={GOLD} stroke={INK} strokeWidth={1.5} />
      <CoinFace cx={97} cy={58} r={6} />
      {/* happy customer paying */}
      <Kid x={156} y={126} s={1.08} shirt={PINK} hair={NIGHT} />
      <Arm x1={145} y1={93} x2={128} y2={78} color={PINK} s={1.08} />
      <CoinFace cx={126} cy={70} r={7} />
      <path d={heartPath(176, 52, 6)} fill={CORAL} {...thin} strokeWidth={2} />
      <Twinkle cx={180} cy={22} r={5} />
      <Twinkle cx={140} cy={40} r={3.5} fill="#fff" />
    </Frame>
  );
}

export function LessonArtPaycheck({ size = 200, className, ...rest }: ArtProps) {
  return (
    <Frame size={size} className={className} rest={rest} tint="#DDF6EA">
      <Ground cy={126} color={LEAF} />
      {/* the pay stub */}
      <g transform="rotate(-4 70 70)">
        <Shadow cx={70} cy={128} rx={46} />
        <rect x={22} y={10} width={96} height={116} rx={7} fill="#fff" {...ink} />
        <path d="M22 17 Q22 10 29 10 H111 Q118 10 118 17 V30 H22 Z" fill={INDIGO} {...ink} />
        <InkText cx={70} cy={20.5} fontSize={10} fill="#fff" strokeWidth={2.4} letterSpacing={0.8}>
          PAY STUB
        </InkText>
        <InkText cx={70} cy={48} fontSize={26} fill={GOLD} strokeWidth={4}>
          $50
        </InkText>
        <rect x={32} y={66} width={36} height={4} rx={2} fill={STEEL} />
        <rect x={32} y={74} width={26} height={4} rx={2} fill={STEEL} />
        <InkText cx={95} cy={72} fontSize={11} fill={CORAL} strokeWidth={2.4}>
          -$8
        </InkText>
        <path d="M30 86 H110" stroke={INK} strokeWidth={2} strokeDasharray="4 4" strokeLinecap="round" opacity={0.5} />
        <InkText cx={70} cy={96} fontSize={8.5} fill={INK} strokeWidth={0} letterSpacing={0.6}>
          TAKE HOME
        </InkText>
        <InkText cx={70} cy={112} fontSize={18} fill={MINT} strokeWidth={3.4}>
          $42
        </InkText>
      </g>
      {/* calculator */}
      <g transform="rotate(6 160 88)">
        <Shadow cx={160} cy={126} rx={26} />
        <rect x={136} y={52} width={48} height={70} rx={9} fill={GRAPE} {...ink} />
        <rect x={142} y={58} width={36} height={18} rx={4} fill="#E6F7EE" {...thin} strokeWidth={2} />
        <InkText cx={164} cy={67} fontSize={11} fill={INK} strokeWidth={0}>
          42
        </InkText>
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => (
            <rect
              key={`${r}${c}`}
              x={143 + c * 12}
              y={82 + r * 12}
              width={9}
              height={8}
              rx={3}
              fill={r === 2 && c === 2 ? CORAL : '#fff'}
              stroke={INK}
              strokeWidth={1.6}
            />
          )),
        )}
        <Hi cx={145} cy={56} rx={5} ry={1.4} />
      </g>
      <CoinFace cx={174} cy={28} r={11} />
      <Twinkle cx={148} cy={22} r={5} />
      <Twinkle cx={188} cy={52} r={3.5} fill="#fff" />
    </Frame>
  );
}

/** A cereal box with its left edge at x. */
function CerealBox({ x, color }: { x: number; color: string }) {
  return (
    <g>
      <Shadow cx={x + 26} cy={116} rx={30} />
      <path d={`M${x + 48} ${24} L${x + 56} ${18} V${106} L${x + 48} ${112} Z`} fill={SHADE} {...ink} />
      <path d={`M${x} ${24} L${x + 8} ${18} H${x + 56} L${x + 48} ${24} Z`} fill={GOLD} {...ink} />
      <rect x={x} y={24} width={48} height={88} rx={3} fill={color} {...ink} />
      <rect x={x + 4} y={30} width={40} height={14} rx={4} fill="#fff" {...thin} strokeWidth={2} />
      <InkText cx={x + 24} cy={37} fontSize={10} fill={color} strokeWidth={2.2} letterSpacing={0.6}>
        YUM
      </InkText>
      {/* bowl of cereal */}
      <circle cx={x + 17} cy={60} r={4} fill={GOLD} stroke={INK} strokeWidth={1.6} />
      <circle cx={x + 26} cy={57} r={4} fill={ORANGE} stroke={INK} strokeWidth={1.6} />
      <circle cx={x + 33} cy={61} r={4} fill={GOLD} stroke={INK} strokeWidth={1.6} />
      <path d={`M${x + 8} ${63} H${x + 40} Q${x + 39} ${78} ${x + 24} ${78} Q${x + 9} ${78} ${x + 8} ${63} Z`} fill="#fff" {...thin} />
      <Hi cx={x + 10} cy={50} rx={2} ry={8} />
    </g>
  );
}

export function LessonArtCompare({ size = 200, className, ...rest }: ArtProps) {
  return (
    <Frame size={size} className={className} rest={rest} tint="#E6E6FF">
      <rect x={10} y={116} width={180} height={7} rx={3.5} fill={INDIGO} opacity={0.2} />
      <CerealBox x={22} color={CORAL} />
      <CerealBox x={98} color={CORAL} />
      <Tag x={40} cy={98} w={34} h={20} fill="#fff">
        <InkText cx={59} cy={98} fontSize={13} fill={CORAL} strokeWidth={2.6}>
          $5
        </InkText>
      </Tag>
      <Tag x={116} cy={98} w={34} h={20} fill="#fff">
        <InkText cx={135} cy={98} fontSize={13} fill={MINT} strokeWidth={2.6}>
          $3
        </InkText>
      </Tag>
      {/* magnifying glass over the cheaper tag */}
      <path d="M150 112 L170 130" stroke={INK} strokeWidth={11} strokeLinecap="round" />
      <path d="M150 112 L170 130" stroke={NIGHT} strokeWidth={6} strokeLinecap="round" />
      <circle cx={134} cy={97} r={22} fill={SKY} fillOpacity={0.22} stroke={INK} strokeWidth={8} />
      <circle cx={134} cy={97} r={22} fill="none" stroke={GRAPE} strokeWidth={3.6} />
      <path d="M120 88 Q124 80 132 79" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.85} />
      {/* thumbs-up star for the better deal */}
      <path d={starPath(176, 70, 12)} fill={GOLD} {...thin} />
      <Hi cx={172} cy={66} rx={2.5} ry={1.4} rot={-30} />
      <Twinkle cx={92} cy={14} r={5} />
      <Twinkle cx={184} cy={30} r={4} fill="#fff" />
    </Frame>
  );
}

/** Starburst polygon path around (cx, cy). */
function burstPath(cx: number, cy: number, rx: number, ry: number, spikes: number, depth: number) {
  let d = '';
  for (let i = 0; i < spikes * 2; i++) {
    const k = i % 2 ? 1 - depth : 1;
    const a = (i * Math.PI) / spikes;
    d += `${i ? 'L' : 'M'}${(cx + rx * k * Math.cos(a)).toFixed(1)} ${(cy + ry * k * Math.sin(a)).toFixed(1)}`;
  }
  return `${d}Z`;
}

export function LessonArtAds({ size = 200, className, ...rest }: ArtProps) {
  return (
    <Frame size={size} className={className} rest={rest} tint="#EFE4FF">
      <Ground cy={124} color={GRAPE} />
      {/* the shout */}
      <path d={burstPath(78, 32, 62, 26, 14, 0.2)} fill={GOLD} {...ink} />
      <InkText cx={78} cy={32} fontSize={17} fill="#fff" strokeWidth={3.6} letterSpacing={0.5}>
        BUY ME!
      </InkText>
      {/* megaphone */}
      <g transform="rotate(-16 44 86)">
        <rect x={20} y={90} width={9} height={18} rx={3} fill={NIGHT} {...thin} />
        <rect x={10} y={78} width={16} height={16} rx={4} fill={STEEL} {...ink} />
        <path d="M24 78 L66 62 V110 L24 94 Z" fill={CORAL} {...ink} />
        <path d="M36 76 L58 68" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.5} />
        <ellipse cx={66} cy={86} rx={8} ry={24} fill={ORANGE} {...ink} />
        <ellipse cx={67} cy={86} rx={4} ry={17} fill={NIGHT} opacity={0.35} />
      </g>
      <path d="M86 70 L96 66 M88 84 L100 84 M86 98 L96 104" stroke={INK} strokeWidth={2.8} strokeLinecap="round" />
      <Twinkle cx={146} cy={20} r={6} />
      <Twinkle cx={18} cy={54} r={4.5} fill="#fff" />
      <Twinkle cx={112} cy={60} r={4} fill={PINK} />
      {/* thoughtful kid, hand on chin */}
      <Kid x={156} y={126} s={1.1} shirt={SKY} hair={BROWN} mood="think" />
      <Arm x1={145} y1={92} x2={141} y2={108} color={SKY} s={1.1} />
      <Arm x1={167} y1={92} x2={160} y2={82} color={SKY} s={1.1} />
      <circle cx={174} cy={46} r={2.4} fill="#fff" {...thin} strokeWidth={1.8} />
      <circle cx={180} cy={38} r={3.4} fill="#fff" {...thin} strokeWidth={1.8} />
      <circle cx={184} cy={24} r={9} fill="#fff" {...thin} strokeWidth={2.2} />
      <InkText cx={184} cy={24} fontSize={13} fill={GRAPE} strokeWidth={2.4}>
        ?
      </InkText>
    </Frame>
  );
}

export function LessonArtImpulse({ size = 200, className, ...rest }: ArtProps) {
  const basket = 'M20 52 H106 L98 92 H32 Z';
  return (
    <Frame size={size} className={className} rest={rest} tint="#DCF3FD">
      <Ground cy={124} color={SKY} />
      {/* toy robot in the cart */}
      <g>
        <path d="M62 22 V30" stroke={INK} strokeWidth={2.5} />
        <circle cx={62} cy={20} r={3.4} fill={CORAL} stroke={INK} strokeWidth={2} />
        <rect x={46} y={30} width={32} height={24} rx={7} fill={STEEL} {...ink} />
        <ellipse cx={56} cy={41} rx={2.2} ry={2.8} fill={INK} />
        <ellipse cx={68} cy={41} rx={2.2} ry={2.8} fill={INK} />
        <path d="M58 47 Q62 50 66 47" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
        <Hi cx={52} cy={34} rx={3} ry={1.4} rot={-20} />
        <rect x={76} y={40} width={16} height={14} rx={3} fill={PINK} {...thin} />
        <path d="M84 40 V54 M76 47 H92" stroke={GOLD} strokeWidth={2.4} />
        <rect x={30} y={40} width={14} height={14} rx={3} fill={MINT} {...thin} />
      </g>
      {/* cart */}
      <path d="M20 52 L13 36 H8" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 52 L13 36 H8" fill="none" stroke={CORAL} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
      <path d={basket} fill="#fff" fillOpacity={0.6} {...ink} />
      <path d="M41 54 V90 M58 54 V90 M75 54 V90 M90 54 V90 M25 72 H102" stroke={INK} strokeWidth={2} opacity={0.5} />
      <path d={basket} fill="none" {...ink} />
      <path d="M32 92 L38 104 H92" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      <Shadow cx={64} cy={122} rx={40} />
      <circle cx={42} cy={112} r={7} fill={NIGHT} {...ink} />
      <circle cx={88} cy={112} r={7} fill={NIGHT} {...ink} />
      <circle cx={42} cy={112} r={2.2} fill={STEEL} />
      <circle cx={88} cy={112} r={2.2} fill={STEEL} />
      {/* alarm clock that says wait */}
      <g>
        <Shadow cx={152} cy={104} rx={26} />
        <path d="M132 96 L126 104 M172 96 L178 104" stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <path d="M128 34 Q130 22 142 24 Z" fill={GOLD} {...ink} />
        <path d="M176 34 Q174 22 162 24 Z" fill={GOLD} {...ink} />
        <rect x={148} y={20} width={8} height={8} rx={2} fill={STEEL} {...thin} strokeWidth={2} />
        <circle cx={152} cy={62} r={34} fill={CORAL} {...ink} />
        <circle cx={152} cy={62} r={26} fill="#fff" {...thin} />
        {[0, 90, 180, 270].map((a) => {
          const [x0, y0] = polar(152, 62, 22, a);
          const [x1, y1] = polar(152, 62, 18, a);
          return <path key={a} d={`M${x0} ${y0} L${x1} ${y1}`} stroke={INK} strokeWidth={2.4} strokeLinecap="round" />;
        })}
        <path d="M152 62 V46 M152 62 L162 68" stroke={INK} strokeWidth={3.4} strokeLinecap="round" />
        <circle cx={152} cy={62} r={3} fill={GOLD} stroke={INK} strokeWidth={1.6} />
        <Hi cx={132} cy={44} rx={5} ry={2.4} rot={-45} />
      </g>
      <rect x={120} y={104} width={64} height={22} rx={11} fill={GOLD} {...ink} />
      <InkText cx={152} cy={115} fontSize={12} fill="#fff" strokeWidth={2.8} letterSpacing={0.5}>
        WAIT 24H
      </InkText>
      <Twinkle cx={190} cy={20} r={5} />
      <Twinkle cx={112} cy={22} r={4} fill="#fff" />
    </Frame>
  );
}

export function LessonArtEmergency({ size = 200, className, ...rest }: ArtProps) {
  const drops: [number, number][] = [[14, 52], [26, 70], [18, 92], [30, 112], [176, 54], [188, 76], [172, 96], [186, 112], [40, 44], [160, 42]];
  const canopy = 'M44 70 Q46 34 100 32 Q154 34 156 70 Q147 63 138 70 Q129 63 120 70 Q111 63 100 70 Q89 63 80 70 Q71 63 62 70 Q53 63 44 70 Z';
  return (
    <Frame size={size} className={className} rest={rest} tint="#DCEBF7">
      <ellipse cx={100} cy={124} rx={86} ry={8} fill={SKY} opacity={0.35} />
      <ellipse cx={30} cy={126} rx={14} ry={3} fill={SKY} opacity={0.6} />
      <ellipse cx={174} cy={126} rx={12} ry={3} fill={SKY} opacity={0.6} />
      {/* rain */}
      {drops.map(([x, y]) => (
        <path key={`${x}-${y}`} d={`M${x} ${y - 6} Q${x + 4} ${y + 1} ${x} ${y + 3} Q${x - 4} ${y + 1} ${x} ${y - 6} Z`} fill={SKY} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      ))}
      {/* umbrella pole sits behind Penny-style piggy */}
      <path d="M100 32 V98" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <path d="M100 32 V98" stroke={STEEL} strokeWidth={2.2} strokeLinecap="round" />
      <path d={canopy} fill={CORAL} {...ink} />
      <path d="M100 32 Q78 44 80 70 M100 32 Q122 44 120 70 M100 32 Q58 40 62 70 M100 32 Q142 40 138 70" fill="none" stroke={INK} strokeWidth={2} opacity={0.55} />
      <path d="M100 32 Q78 44 80 70 Q89 63 100 70 Q111 63 120 70 Q122 44 100 32 Z" fill={GOLD} />
      <path d={canopy} fill="none" {...ink} />
      <Hi cx={70} cy={46} rx={8} ry={2.4} rot={-28} />
      <path d="M100 32 V25" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      <PiggyBank x={70} y={64} width={62} height={62} />
      {/* splashes on top of the umbrella */}
      <path d="M66 36 l-4 -4 M70 33 l0 -5 M134 36 l4 -4 M130 33 l0 -5" stroke={SKY} strokeWidth={2.2} strokeLinecap="round" />
      {/* grumpy rain clouds */}
      <Cloud cx={44} cy={20} s={1} fill={STEEL} grumpy />
      <Cloud cx={156} cy={18} s={0.95} fill={STEEL} grumpy />
      <Twinkle cx={100} cy={12} r={4.5} fill="#fff" />
    </Frame>
  );
}

/** Bank card centered on the origin, 78 x 50. */
function BankCard({ base, stripe, label }: { base: string; stripe: string; label: string }) {
  return (
    <g>
      <rect x={-39} y={-25} width={78} height={50} rx={7} fill={base} {...ink} />
      <path d="M-36 6 Q0 -6 36 10 V18 Q36 22 32 22 H-32 Q-36 22 -36 18 Z" fill={stripe} opacity={0.5} />
      <rect x={-31} y={-14} width={14} height={11} rx={2.5} fill={GOLD} stroke={INK} strokeWidth={1.8} />
      <path d="M-24 -14 V-3 M-31 -8.5 H-17" stroke={SHADE} strokeWidth={1.2} />
      <InkText cx={12} cy={-14} fontSize={10} fill="#fff" strokeWidth={2.4} letterSpacing={0.8}>
        {label}
      </InkText>
      {[-30, -14, 2, 18].map((x) => (
        <g key={x}>
          {[0, 3.5, 7].map((d) => (
            <circle key={d} cx={x + d} cy={9} r={1.3} fill="#fff" />
          ))}
        </g>
      ))}
      <Hi cx={-24} cy={-20} rx={8} ry={1.6} />
    </g>
  );
}

export function LessonArtCards({ size = 200, className, ...rest }: ArtProps) {
  return (
    <Frame size={size} className={className} rest={rest} tint="#E6E6FF">
      <Ground cy={124} color={INDIGO} rx={70} />
      <g transform="translate(56 54) rotate(-10)">
        <BankCard base={LEAF} stripe={MINT} label="DEBIT" />
      </g>
      <g transform="translate(144 54) rotate(10)">
        <BankCard base={GRAPE} stripe={PINK} label="CREDIT" />
      </g>
      {/* little lock with a face */}
      <g>
        <Shadow cx={100} cy={122} rx={22} />
        <path d="M88 96 V86 Q88 72 100 72 Q112 72 112 86 V96" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
        <path d="M88 96 V86 Q88 72 100 72 Q112 72 112 86 V96" fill="none" stroke={STEEL} strokeWidth={3.6} strokeLinecap="round" />
        <rect x={80} y={92} width={40} height={30} rx={8} fill={GOLD} {...ink} />
        <Hi cx={88} cy={97} rx={4} ry={1.6} />
        <Face cx={100} cy={106} s={0.85} />
        <circle cx={100} cy={116} r={2} fill={SHADE} />
      </g>
      <Twinkle cx={100} cy={30} r={6} />
      <Twinkle cx={24} cy={104} r={4} fill="#fff" />
      <Twinkle cx={178} cy={102} r={4.5} />
    </Frame>
  );
}

export function LessonArtCreditScore({ size = 200, className, ...rest }: ArtProps) {
  const cx = 100;
  const cy = 108;
  const r = 66;
  const bands = [CORAL, ORANGE, GOLD, LIME, MINT];
  const needle = 22;
  const [tx, ty] = polar(cx, cy, r - 14, needle);
  const [bx1, by1] = polar(cx, cy, 6, needle + 90);
  const [bx2, by2] = polar(cx, cy, 6, needle - 90);
  return (
    <Frame size={size} className={className} rest={rest} tint="#DDF6EA">
      <Ground cy={128} color={LEAF} rx={70} />
      {/* dial body */}
      <path d={`${arcPath(cx, cy, r + 14, 180, 0)} Z`} fill="#fff" {...ink} />
      <path d={arcPath(cx, cy, r, 180, 0)} fill="none" stroke={INK} strokeWidth={22} />
      {bands.map((c, i) => (
        <path key={c} d={arcPath(cx, cy, r, 180 - i * 36 - (i ? 0 : 0.01), 180 - (i + 1) * 36 + (i < 4 ? -0.5 : 0))} fill="none" stroke={c} strokeWidth={16} />
      ))}
      {[144, 108, 72, 36].map((a) => {
        const [x0, y0] = polar(cx, cy, r - 8, a);
        const [x1, y1] = polar(cx, cy, r + 8, a);
        return <path key={a} d={`M${x0.toFixed(1)} ${y0.toFixed(1)} L${x1.toFixed(1)} ${y1.toFixed(1)}`} stroke={INK} strokeWidth={2} />;
      })}
      <Hi cx={52} cy={60} rx={8} ry={2.6} rot={-50} />
      {/* needle into the green */}
      <path d={`M${bx1.toFixed(1)} ${by1.toFixed(1)} L${tx.toFixed(1)} ${ty.toFixed(1)} L${bx2.toFixed(1)} ${by2.toFixed(1)} Z`} fill={NIGHT} {...thin} />
      <circle cx={cx} cy={cy} r={15} fill={INDIGO} {...ink} />
      <g transform={`translate(${cx} ${cy - 1})`}>
        <ellipse cx={-5} cy={-2} rx={1.9} ry={2.5} fill="#fff" />
        <ellipse cx={5} cy={-2} rx={1.9} ry={2.5} fill="#fff" />
        <path d="M-3.5 3 Q0 6.5 3.5 3" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
      </g>
      <InkText cx={36} cy={124} fontSize={10} fill={CORAL} strokeWidth={2.4}>
        LOW
      </InkText>
      <InkText cx={164} cy={124} fontSize={10} fill={MINT} strokeWidth={2.4}>
        GREAT
      </InkText>
      <path d={starPath(180, 30, 11)} fill={GOLD} {...thin} />
      <Twinkle cx={160} cy={14} r={4} fill="#fff" />
      <Twinkle cx={22} cy={30} r={5} />
    </Frame>
  );
}

/* ------------------------------------------------------------------ lookup */

export const MORE_LESSON_ART_A = {
  'money-basics': LessonArtMoneyBasics,
  barter: LessonArtBarter,
  jobs: LessonArtJobs,
  business: LessonArtBusiness,
  paycheck: LessonArtPaycheck,
  compare: LessonArtCompare,
  ads: LessonArtAds,
  impulse: LessonArtImpulse,
  emergency: LessonArtEmergency,
  cards: LessonArtCards,
  'credit-score': LessonArtCreditScore,
} satisfies Partial<Record<LessonArtId, (p: ArtProps) => ReactElement>>;
