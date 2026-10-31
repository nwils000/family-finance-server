import { useId, type ComponentType, type ReactNode } from 'react';
import type { HatId } from '@kk/shared';
import type { ArtProps } from './types';
import { InkText } from './sticker-kit';

/* ------------------------------------------------------------------ */
/* Palette + shared helpers                                            */
/* ------------------------------------------------------------------ */

const INK = '#1F2547';
const C = {
  indigo: '#5B5BF7',
  indigoDark: '#3F3FCF',
  indigoLight: '#A5A5FF',
  gold: '#FFC83D',
  goldShade: '#F59E0B',
  goldLight: '#FFE68A',
  mint: '#2ED3A0',
  mintShade: '#1DB98A',
  coral: '#FF6B6B',
  coralShade: '#E84A4A',
  sky: '#4CC9F0',
  skyShade: '#1FA6D6',
  grape: '#9B5DE5',
  grapeShade: '#7A3FC8',
  pink: '#FF8FC7',
  pinkShade: '#F06AAE',
  cream: '#FFF8EC',
  creamShade: '#EBDDC6',
  orange: '#FF9F43',
  orangeShade: '#E8801F',
  white: '#FFFFFF',
} as const;

const useSvgId = (prefix: string) => `kk-${prefix}-${useId().replace(/:/g, '')}`;

type Hl = [cx: number, cy: number, rx: number, ry: number, rot: number];

/**
 * Sticker-style shape: shade underneath, main fill nudged up-left so a darker
 * crescent shows bottom-right, optional clipped decoration + soft highlight,
 * and the ink outline on top.
 */
function Sticker({
  d,
  fill,
  shade,
  hl,
  sw = 3,
  children,
}: {
  d: string;
  fill: string;
  shade: string;
  hl?: Hl;
  sw?: number;
  children?: ReactNode;
}) {
  const id = useSvgId('cos');
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={d} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <path d={d} fill={shade} />
        <path d={d} fill={fill} transform="translate(-2.5 -3.5)" />
        {children}
        {hl && (
          <ellipse cx={hl[0]} cy={hl[1]} rx={hl[2]} ry={hl[3]} transform={`rotate(${hl[4]} ${hl[0]} ${hl[1]})`} fill="#fff" opacity={0.35} />
        )}
      </g>
      <path d={d} fill="none" stroke={INK} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round" />
    </g>
  );
}

const starPath = (cx: number, cy: number, R: number, r: number, n = 5, rot = -90) => {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const rad = i % 2 === 0 ? R : r;
    const a = ((rot + (i * 180) / n) * Math.PI) / 180;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(2)} ${(cy + rad * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join(' L')} Z`;
};

const sparklePath = (x: number, y: number, r: number) =>
  `M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r} Z`;

function Sparkle({ x, y, r, fill = '#fff', delay = 0 }: { x: number; y: number; r: number; fill?: string; delay?: 0 | 1 | 2 | 3 }) {
  return (
    <g className={`kk-twinkle${delay ? ` kk-delay-${delay}` : ''}`}>
      <path d={sparklePath(x, y, r)} fill={fill} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
    </g>
  );
}

function Coin({ x, y, r = 6, tilt = 0 }: { x: number; y: number; r?: number; tilt?: number }) {
  return (
    <g transform={`rotate(${tilt} ${x} ${y})`}>
      <ellipse cx={x + 0.8} cy={y + 1} rx={r} ry={r * 0.92} fill={C.goldShade} />
      <ellipse cx={x} cy={y} rx={r} ry={r * 0.92} fill={C.gold} stroke={INK} strokeWidth={2.2} />
      <ellipse cx={x} cy={y} rx={r * 0.58} ry={r * 0.54} fill="none" stroke={C.goldShade} strokeWidth={1.4} />
      <ellipse cx={x - r * 0.35} cy={y - r * 0.4} rx={r * 0.28} ry={r * 0.16} transform={`rotate(-30 ${x - r * 0.35} ${y - r * 0.4})`} fill="#fff" opacity={0.7} />
    </g>
  );
}

function Gem({ x, y, s = 1, fill, shade }: { x: number; y: number; s?: number; fill: string; shade: string }) {
  const d = `M${x - 6 * s} ${y - 2 * s} L${x - 3 * s} ${y - 6 * s} L${x + 3 * s} ${y - 6 * s} L${x + 6 * s} ${y - 2 * s} L${x} ${y + 6 * s} Z`;
  return (
    <g>
      <path d={d} fill={fill} />
      <path d={`M${x} ${y + 6 * s} L${x + 6 * s} ${y - 2 * s} L${x + 2 * s} ${y - 2 * s} Z`} fill={shade} />
      <path d={`M${x - 6 * s} ${y - 2 * s} L${x + 6 * s} ${y - 2 * s}`} stroke="#fff" strokeOpacity={0.6} strokeWidth={1.2} />
      <path d={`M${x - 3 * s} ${y - 5 * s} L${x - 1 * s} ${y - 3 * s}`} stroke="#fff" strokeWidth={1.4} strokeLinecap="round" opacity={0.85} />
      <path d={d} fill="none" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
    </g>
  );
}

const svgBase = (size: number | string | undefined, className: string | undefined) => ({
  viewBox: '0 0 100 100',
  width: size,
  height: size,
  className,
  'aria-hidden': true as const,
});

/* ------------------------------------------------------------------ */
/* Hats (drawn in avatar space: sit on a head whose top is ~y 25-30)   */
/* ------------------------------------------------------------------ */

function PartyHat() {
  const cone = 'M35 32 Q49 9 51.5 7 Q54.5 9 67 31 Q51 36.5 35 32 Z';
  return (
    <g transform="rotate(12 51 30)">
      <Sticker d={cone} fill={C.coral} shade={C.coralShade} hl={[46, 20, 2.5, 7, 25]}>
        <path d="M30 16 L72 6 L72 12 L30 22 Z" fill={C.gold} />
        <path d="M30 27 L72 17 L72 23 L30 33 Z" fill={C.gold} />
        <circle cx={56} cy={27} r={1.6} fill="#fff" />
        <circle cx={45} cy={22} r={1.4} fill="#fff" />
        <circle cx={53} cy={15} r={1.2} fill="#fff" />
      </Sticker>
      {/* ruffle trim */}
      <g fill={C.mint} stroke={INK} strokeWidth={2}>
        {[36, 41.5, 47, 52.5, 58, 63.5].map((x, i) => (
          <circle key={x} cx={x} cy={32.5 + (i === 0 || i === 5 ? -0.6 : 0.6)} r={3.4} />
        ))}
      </g>
      {/* pompom */}
      <g>
        <circle cx={51.5} cy={6.5} r={5.4} fill={C.gold} stroke={INK} strokeWidth={2.4} />
        <circle cx={49.8} cy={4.8} r={1.8} fill="#fff" opacity={0.7} />
        <path d="M47 9 Q51.5 11 56 8.5" stroke={C.goldShade} strokeWidth={1.4} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
}

function CapHat() {
  const dome = 'M30 33 C29 18 38 9 50 9 C62 9 71 18 70 33 Q50 30 30 33 Z';
  const brim = 'M60 29.5 C70 25.5 84 26.5 90 31.5 C86 36.5 72 37 58 34.5 Z';
  return (
    <g transform="rotate(-6 50 30)">
      <Sticker d={dome} fill={C.indigo} shade={C.indigoDark} hl={[39, 17, 6, 3, -30]}>
        <path d="M50 9 C46 16 45 24 46 32" fill="none" stroke={INK} strokeWidth={1.4} opacity={0.5} />
        <path d="M50 9 C56 15 59 23 60 31" fill="none" stroke={INK} strokeWidth={1.4} opacity={0.5} />
        <path d="M28 29 Q50 26 72 29 L72 34 L28 34 Z" fill={C.mint} />
      </Sticker>
      <path d={starPath(41, 21, 5.2, 2.4)} fill={C.gold} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      <Sticker d={brim} fill={C.indigoDark} shade="#2E2EA8" sw={2.8}>
        <path d="M62 31 C72 28.5 82 29 87 31.5" fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={1.6} strokeLinecap="round" />
      </Sticker>
      <circle cx={50} cy={9} r={3} fill={C.mint} stroke={INK} strokeWidth={2} />
    </g>
  );
}

function BowHat() {
  const left = 'M65 25 C58 12 45 11 44.5 21 C44 31 56 34 65 25 Z';
  const right = 'M67 25 C74 12 87 11 87.5 21 C88 31 76 34 67 25 Z';
  return (
    <g transform="rotate(14 66 25)">
      <path d="M63 27 L57 41 L61.5 39.5 L63.5 43.5 L67 28 Z" fill={C.pinkShade} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M69 27 L75 41 L70.5 39.5 L68.5 43.5 L65 28 Z" fill={C.pinkShade} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <Sticker d={left} fill={C.pink} shade={C.pinkShade} hl={[51, 18, 4, 2, -20]} sw={2.8}>
        <circle cx={53} cy={25} r={1.8} fill="#fff" />
        <circle cx={58.5} cy={20} r={1.4} fill="#fff" />
        <circle cx={49} cy={19.5} r={1.2} fill="#fff" />
      </Sticker>
      <Sticker d={right} fill={C.pink} shade={C.pinkShade} hl={[78, 17, 4, 2, 20]} sw={2.8}>
        <circle cx={79} cy={25} r={1.8} fill="#fff" />
        <circle cx={73.5} cy={20} r={1.4} fill="#fff" />
        <circle cx={83} cy={19.5} r={1.2} fill="#fff" />
      </Sticker>
      <path d="M58 21 Q61 23 62 26" fill="none" stroke={INK} strokeWidth={1.4} strokeLinecap="round" opacity={0.5} />
      <path d="M74 21 Q71 23 70 26" fill="none" stroke={INK} strokeWidth={1.4} strokeLinecap="round" opacity={0.5} />
      <ellipse cx={66} cy={25} rx={5} ry={5.6} fill={C.pinkShade} stroke={INK} strokeWidth={2.6} />
      <ellipse cx={64.6} cy={23.4} rx={1.6} ry={1.1} fill="#fff" opacity={0.6} />
    </g>
  );
}

function CrownHat() {
  const crown = 'M30 34 L27.5 13 L39.5 22.5 L50 7 L60.5 22.5 L72.5 13 L70 34 Q50 37 30 34 Z';
  return (
    <g transform="rotate(-8 50 30)">
      <Sticker d={crown} fill={C.gold} shade={C.goldShade} hl={[37, 24, 2.5, 6, 0]}>
        <path d="M26 27 Q50 24.5 74 27 L74 40 L26 40 Z" fill={C.goldShade} opacity={0.55} />
        <path d="M26 27 Q50 24.5 74 27" fill="none" stroke={INK} strokeWidth={2} />
      </Sticker>
      <circle cx={27.5} cy={12.5} r={3.2} fill={C.goldLight} stroke={INK} strokeWidth={2.2} />
      <circle cx={50} cy={6} r={3.6} fill={C.goldLight} stroke={INK} strokeWidth={2.2} />
      <circle cx={72.5} cy={12.5} r={3.2} fill={C.goldLight} stroke={INK} strokeWidth={2.2} />
      <Gem x={50} y={30.5} s={0.7} fill={C.coral} shade={C.coralShade} />
      <circle cx={37.5} cy={31} r={2.6} fill={C.sky} stroke={INK} strokeWidth={1.8} />
      <circle cx={62.5} cy={31} r={2.6} fill={C.mint} stroke={INK} strokeWidth={1.8} />
      <circle cx={36.8} cy={30.2} r={0.8} fill="#fff" />
      <circle cx={61.8} cy={30.2} r={0.8} fill="#fff" />
      <Sparkle x={80} y={6} r={4} fill={C.goldLight} />
    </g>
  );
}

function WizardHat() {
  const cone = 'M34 31 C40 22 44 12 52 6 C59 1.5 67 3 73 10 C65 8 59 12 59 18 C60 24 64 28 66 31 Q50 35 34 31 Z';
  return (
    <g transform="rotate(8 50 30)">
      <Sticker d="M20 31.5 C20 26 80 26 80 31.5 C80 37 20 37 20 31.5 Z" fill={C.grape} shade={C.grapeShade} sw={2.8} />
      <Sticker d={cone} fill={C.grape} shade={C.grapeShade} hl={[46, 16, 2.5, 7, 30]}>
        <path d="M30 24 Q50 22 70 24 L70 29.5 Q50 27.5 30 29.5 Z" fill={C.gold} />
        <path d="M30 24 Q50 22 70 24 M30 29.5 Q50 27.5 70 29.5" fill="none" stroke={INK} strokeWidth={1.8} />
      </Sticker>
      <path d={starPath(49, 17, 3.6, 1.6)} fill={C.goldLight} stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M58 13 a3.5 3.5 0 1 0 2.5 5.5 a2.8 2.8 0 1 1 -2.5 -5.5 Z" fill={C.goldLight} stroke={INK} strokeWidth={1.3} strokeLinejoin="round" />
      <circle cx={43} cy={23} r={1.2} fill={C.goldLight} />
      {/* droopy tip pompom */}
      <circle cx={73.5} cy={11} r={3.4} fill={C.gold} stroke={INK} strokeWidth={2} />
      <Sparkle x={80} y={22} r={3.4} fill={C.goldLight} delay={1} />
    </g>
  );
}

function PirateHat() {
  const hat = 'M17 28 C23 21 30 21 36 23.5 C38 12 44 8 50 8 C56 8 62 12 64 23.5 C70 21 77 21 83 28 C73 37 27 37 17 28 Z';
  return (
    <g transform="rotate(-6 50 28)">
      {/* feather */}
      <path d="M64 22 C70 10 80 4 88 4 C84 12 76 20 66 24 Z" fill={C.coral} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M66 23 C72 15 79 9 86 6" fill="none" stroke={INK} strokeWidth={1.2} strokeLinecap="round" opacity={0.6} />
      <Sticker d={hat} fill="#353A66" shade="#252948" hl={[42, 15, 5, 2.5, -20]}>
        <path d="M17 28 C27 37 73 37 83 28" fill="none" stroke={C.gold} strokeWidth={5} />
      </Sticker>
      {/* skull + crossbones */}
      <g strokeLinecap="round">
        <path d="M43 27 L57 18 M43 18 L57 27" stroke={INK} strokeWidth={5} />
        <path d="M43 27 L57 18 M43 18 L57 27" stroke="#fff" strokeWidth={2.6} />
      </g>
      <path d="M44.5 19 C44.5 14.5 47 12.5 50 12.5 C53 12.5 55.5 14.5 55.5 19 C55.5 21 54 22 53 22.5 L53 24.5 L47 24.5 L47 22.5 C46 22 44.5 21 44.5 19 Z" fill="#fff" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
      <circle cx={47.8} cy={18.5} r={1.5} fill={INK} />
      <circle cx={52.2} cy={18.5} r={1.5} fill={INK} />
      <path d="M49 24.5 V23 M51 24.5 V23" stroke={INK} strokeWidth={1} />
    </g>
  );
}

function AstronautHelmet() {
  const glass = useSvgId('glass');
  return (
    <g>
      <defs>
        <radialGradient id={glass} cx="0.42" cy="0.38" r="0.62">
          <stop offset="0" stopColor={C.sky} stopOpacity={0.02} />
          <stop offset="0.72" stopColor={C.sky} stopOpacity={0.12} />
          <stop offset="1" stopColor={C.sky} stopOpacity={0.42} />
        </radialGradient>
      </defs>
      {/* antenna */}
      <path d="M73 15 L80 6" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
      <circle cx={81} cy={5} r={3.4} fill={C.coral} stroke={INK} strokeWidth={2} />
      {/* glass bubble */}
      <circle cx={50} cy={50} r={44} fill={`url(#${glass})`} />
      <circle cx={50} cy={50} r={40.5} fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={2} />
      <path d="M17 44 C18 28 30 15 46 12.5" fill="none" stroke="#fff" strokeOpacity={0.85} strokeWidth={4.5} strokeLinecap="round" />
      <path d="M17.5 53 L17.5 56" stroke="#fff" strokeOpacity={0.85} strokeWidth={4.5} strokeLinecap="round" />
      <path d="M78 70 C74 78 68 83 61 86" fill="none" stroke="#fff" strokeOpacity={0.45} strokeWidth={2.4} strokeLinecap="round" />
      <circle cx={50} cy={50} r={44} fill="none" stroke={INK} strokeWidth={3} />
      {/* collar ring */}
      <Sticker d="M15 78 C28 92 72 92 85 78 L89 86 C74 101 26 101 11 86 Z" fill="#EEF1FA" shade="#C9CEE3" sw={2.8}>
        <rect x={44} y={88} width={12} height={8} rx={2} fill={C.coral} stroke={INK} strokeWidth={1.6} />
      </Sticker>
      <circle cx={24} cy={88.5} r={1.6} fill={INK} />
      <circle cx={76} cy={88.5} r={1.6} fill={INK} />
      <circle cx={35} cy={92.5} r={1.6} fill={INK} />
      <circle cx={65} cy={92.5} r={1.6} fill={INK} />
    </g>
  );
}

function UnicornHorn() {
  const horn = 'M43.5 32 Q49.5 8 51.5 3.5 Q54 8 59 32 Q51 35 43.5 32 Z';
  const flower = (x: number, y: number, petal: string) => (
    <g>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx={x} cy={y - 3.6} rx={2.6} ry={3.4} transform={`rotate(${a} ${x} ${y})`} fill={petal} stroke={INK} strokeWidth={1.4} />
      ))}
      <circle cx={x} cy={y} r={2.3} fill={C.gold} stroke={INK} strokeWidth={1.4} />
    </g>
  );
  return (
    <g transform="rotate(8 51 30)">
      <Sticker d={horn} fill={C.goldLight} shade={C.gold} hl={[48.5, 20, 1.5, 6, 12]}>
        <path d="M40 30 L62 22 M40 22 L62 14 M40 14 L62 6" stroke={C.pink} strokeWidth={3.4} />
        <path d="M40 30 L62 22 M40 22 L62 14 M40 14 L62 6" stroke={INK} strokeWidth={1.2} opacity={0.35} transform="translate(0 2)" />
      </Sticker>
      <path d="M36 34 C34 29 36 26 40 27 C40 31 39 33 36 34 Z" fill={C.mint} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M66 34 C68 29 66 26 62 27 C62 31 63 33 66 34 Z" fill={C.mint} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      {flower(40, 31.5, C.pink)}
      {flower(62.5, 31, C.grape)}
      <Sparkle x={38} y={10} r={3.6} fill={C.goldLight} />
      <Sparkle x={64} y={8} r={2.8} fill={C.pink} delay={2} />
    </g>
  );
}

function ChefHat() {
  const puff = 'M35 27 C26 25 23 13 31 9.5 C33 2.5 43 0.5 50 4.5 C57 0.5 67 2.5 69 9.5 C77 13 74 25 65 27 Z';
  const band = 'M34 25 L66 25 L66.5 33.5 Q50 37 33.5 33.5 Z';
  return (
    <g transform="rotate(-6 50 30)">
      <Sticker d={puff} fill="#FFFFFF" shade="#DADDF0" hl={[38, 10, 5, 3, -30]}>
        <path d="M42 14 Q44 20 43 26 M58 14 Q56 20 57 26 M50 8 Q51 16 50 26" fill="none" stroke="#C4C8E2" strokeWidth={1.6} strokeLinecap="round" />
      </Sticker>
      <Sticker d={band} fill="#FFFFFF" shade="#DADDF0" sw={2.8}>
        <path d="M40 25 V35 M46 25 V36 M54 25 V36 M60 25 V35" stroke="#C4C8E2" strokeWidth={1.4} />
        <path d="M33 31 Q50 34 67 31 L67 37 L33 37 Z" fill={C.coral} opacity={0.9} />
      </Sticker>
    </g>
  );
}

type HatArt = {
  Art: ComponentType;
  /** visual center + scale used by HatPreview to fit the hat in its own box */
  preview: { cx: number; cy: number; s: number };
};

export const HAT_ART: Record<Exclude<HatId, 'none'>, HatArt> = {
  party: { Art: PartyHat, preview: { cx: 51, cy: 19, s: 1.75 } },
  cap: { Art: CapHat, preview: { cx: 59, cy: 22, s: 1.25 } },
  bow: { Art: BowHat, preview: { cx: 66, cy: 26, s: 1.6 } },
  crown: { Art: CrownHat, preview: { cx: 51, cy: 20, s: 1.5 } },
  wizard: { Art: WizardHat, preview: { cx: 50, cy: 19, s: 1.35 } },
  pirate: { Art: PirateHat, preview: { cx: 51, cy: 20, s: 1.2 } },
  astronaut: { Art: AstronautHelmet, preview: { cx: 50, cy: 51, s: 0.86 } },
  'unicorn-horn': { Art: UnicornHorn, preview: { cx: 51, cy: 19, s: 1.65 } },
  chef: { Art: ChefHat, preview: { cx: 50, cy: 19, s: 1.45 } },
};

/**
 * A hat drawn in avatar space. Absolutely overlay it at the same size on top
 * of an <Avatar /> and it sits on the head. `none` renders nothing.
 */
export function Hat({ id, size = 64, className, style, ...rest }: ArtProps & { id: HatId }) {
  if (id === 'none') return null;
  const entry = HAT_ART[id];
  if (!entry) return null;
  const { Art } = entry;
  return (
    <svg {...svgBase(size, className)} style={{ overflow: 'visible', pointerEvents: 'none', ...style }} {...rest}>
      <Art />
    </svg>
  );
}

/** The hat centered and scaled up in its own box, on a soft cream disc (for pickers). */
export function HatPreview({ id, size = 72, className, ...rest }: ArtProps & { id: HatId }) {
  const entry = id === 'none' ? null : HAT_ART[id];
  return (
    <svg {...svgBase(size, className)} {...rest}>
      <circle cx={50} cy={50} r={46} fill={C.cream} />
      <ellipse cx={36} cy={28} rx={14} ry={7} transform="rotate(-30 36 28)" fill="#fff" opacity={0.5} />
      {entry ? (
        <g transform={`translate(50 ${id === 'astronaut' ? 50 : 52}) scale(${entry.preview.s}) translate(${-entry.preview.cx} ${-entry.preview.cy})`}>
          <entry.Art />
        </g>
      ) : (
        <g fill="none" stroke={INK} strokeLinecap="round" opacity={0.35}>
          <circle cx={50} cy={50} r={22} strokeWidth={3.5} strokeDasharray="6 6" />
          <path d="M35 65 L65 35" strokeWidth={4} />
        </g>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Level shield                                                        */
/* ------------------------------------------------------------------ */

const TIERS = [
  { fill: C.mint, shade: C.mintShade, light: '#9BF2D6' },
  { fill: C.sky, shade: C.skyShade, light: '#B4ECFB' },
  { fill: C.grape, shade: C.grapeShade, light: '#D6BEF7' },
  { fill: C.coral, shade: C.coralShade, light: '#FFBABA' },
  { fill: C.gold, shade: C.goldShade, light: C.goldLight },
] as const;

const tierFor = (level: number) => (level >= 20 ? 4 : level >= 15 ? 3 : level >= 10 ? 2 : level >= 5 ? 1 : 0);

export function LevelShield({ level, size = 56, className, ...rest }: ArtProps & { level: number }) {
  const lv = Math.max(1, Math.floor(level || 1));
  const tierIdx = tierFor(lv);
  const t = TIERS[tierIdx];
  const label = String(lv);
  const fontSize = label.length >= 3 ? 24 : label.length === 2 ? 32 : 38;
  const shield = 'M50 15 L81 22.5 Q84 23.3 84 26.5 C84 56 72 78 50 94 C28 78 16 56 16 26.5 Q16 23.3 19 22.5 Z';
  return (
    <svg {...svgBase(size, className)} {...rest}>
      {/* little wings for grape tier and up */}
      {tierIdx >= 2 && (
        <g fill="#fff" stroke={INK} strokeWidth={2.4} strokeLinejoin="round">
          <path d="M18 34 C8 32 2 38 3 46 C8 44 10 46 8 50 C12 50 14 52 12 56 C16 56 18 56 20 52 Z" />
          <path d="M82 34 C92 32 98 38 97 46 C92 44 90 46 92 50 C88 50 86 52 88 56 C84 56 82 56 80 52 Z" />
        </g>
      )}
      <Sticker d={shield} fill={t.fill} shade={t.shade} hl={[33, 34, 7, 12, 20]}>
        <path d="M50 15 L50 96 L90 96 L90 15 Z" fill={t.shade} opacity={0.22} />
      </Sticker>
      <path
        d="M50 22.5 L76.5 28.8 C76 53 66.5 71.5 50 85 C33.5 71.5 24 53 23.5 28.8 Z"
        fill="none"
        stroke={t.light}
        strokeWidth={2.6}
        strokeLinejoin="round"
        opacity={0.9}
      />
      {/* tiny stars along the top, one per tier */}
      <g>
        {Array.from({ length: tierIdx + 1 }).map((_, i, arr) => {
          const x = 50 + (i - (arr.length - 1) / 2) * 7;
          return <path key={i} d={starPath(x, 32, 2.8, 1.3)} fill="#fff" opacity={0.9} />;
        })}
      </g>
      {/* Optical middle of the shield body, between the star row and the tip. */}
      <InkText cx={50} cy={58} fontSize={fontSize} fill="#fff" strokeWidth={5}>
        {label}
      </InkText>
      {tierIdx === 4 && (
        <g>
          <path
            d="M37.5 19 L35.5 5 L44 11 L50 2.5 L56 11 L64.5 5 L62.5 19 Q50 21 37.5 19 Z"
            fill={C.gold}
            stroke={INK}
            strokeWidth={2.4}
            strokeLinejoin="round"
          />
          <circle cx={50} cy={14} r={2.2} fill={C.coral} stroke={INK} strokeWidth={1.4} />
          <circle cx={35.5} cy={5} r={1.8} fill={C.goldLight} stroke={INK} strokeWidth={1.4} />
          <circle cx={50} cy={2.8} r={1.8} fill={C.goldLight} stroke={INK} strokeWidth={1.4} />
          <circle cx={64.5} cy={5} r={1.8} fill={C.goldLight} stroke={INK} strokeWidth={1.4} />
          <Sparkle x={86} y={14} r={4} fill={C.goldLight} />
          <Sparkle x={14} y={78} r={3} fill={C.goldLight} delay={2} />
        </g>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* XP star token                                                       */
/* ------------------------------------------------------------------ */

export function XpStar({ size = 40, className, ...rest }: ArtProps) {
  const star = starPath(50, 53, 45, 26);
  return (
    <svg {...svgBase(size, className)} {...rest}>
      <Sticker d={star} fill={C.indigo} shade={C.indigoDark} hl={[36, 36, 8, 4, -30]}>
        <path d={starPath(50, 53, 33, 19)} fill="none" stroke={C.indigoLight} strokeWidth={2.4} strokeLinejoin="round" opacity={0.7} />
      </Sticker>
      <InkText cx={50} cy={56} fontSize={25} letterSpacing={-0.5} fill={C.gold} strokeWidth={4.5}>
        XP
      </InkText>
      <Sparkle x={84} y={14} r={5} fill={C.goldLight} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Treasure chests                                                     */
/* ------------------------------------------------------------------ */

type ChestPalette = {
  wood: string;
  woodShade: string;
  woodLight: string;
  plank: string;
  band: string;
  bandShade: string;
};

const WOOD: ChestPalette = {
  wood: '#E08A3C',
  woodShade: '#B5612A',
  woodLight: C.orange,
  plank: '#A9561F',
  band: C.gold,
  bandShade: C.goldShade,
};

const GREY: ChestPalette = {
  wood: '#B9BED3',
  woodShade: '#959CB8',
  woodLight: '#C9CDDE',
  plank: '#8C93AE',
  band: '#DCDFEA',
  bandShade: '#B4B9CD',
};

const CHEST_BODY = 'M16 50 L84 50 L84 82 Q84 88 78 88 L22 88 Q16 88 16 82 Z';
const CHEST_LID = 'M14 50 L14 40 C14 26 30 19 50 19 C70 19 86 26 86 40 L86 50 Z';

function ChestBody({ p }: { p: ChestPalette }) {
  return (
    <Sticker d={CHEST_BODY} fill={p.wood} shade={p.woodShade}>
      <path d="M16 63 H84 M16 76 H84" stroke={p.plank} strokeWidth={1.8} />
      <circle cx={40} cy={69} r={1} fill={p.plank} />
      <circle cx={62} cy={82} r={1} fill={p.plank} />
      <rect x={23} y={46} width={8} height={46} fill={p.band} stroke={INK} strokeWidth={2} />
      <rect x={69} y={46} width={8} height={46} fill={p.band} stroke={INK} strokeWidth={2} />
      <path d="M29 50 V92 M75 50 V92" stroke={p.bandShade} strokeWidth={2} />
      {[58, 70, 82].map((y) => (
        <g key={y} fill={p.bandShade}>
          <circle cx={27} cy={y} r={1.2} />
          <circle cx={73} cy={y} r={1.2} />
        </g>
      ))}
    </Sticker>
  );
}

function ChestLid({ p }: { p: ChestPalette }) {
  return (
    <Sticker d={CHEST_LID} fill={p.woodLight} shade={p.wood} hl={[34, 28, 9, 3.5, -12]}>
      <path d="M14 39 C24 31 76 31 86 39" fill="none" stroke={p.plank} strokeWidth={1.8} opacity={0.8} />
      <rect x={23} y={12} width={8} height={40} fill={p.band} stroke={INK} strokeWidth={2} />
      <rect x={69} y={12} width={8} height={40} fill={p.band} stroke={INK} strokeWidth={2} />
      <path d="M29 14 V52 M75 14 V52" stroke={p.bandShade} strokeWidth={2} />
    </Sticker>
  );
}

function ChestRim({ p }: { p: ChestPalette }) {
  return (
    <g>
      <rect x={12.5} y={46.5} width={75} height={7.5} rx={3.75} fill={p.band} stroke={INK} strokeWidth={2.6} />
      <path d="M16 52 H84" stroke={p.bandShade} strokeWidth={1.6} strokeLinecap="round" />
      <path d="M17 49 H40" stroke="#fff" strokeOpacity={0.55} strokeWidth={1.6} strokeLinecap="round" />
    </g>
  );
}

function ChestShadow() {
  return <ellipse cx={50} cy={91} rx={38} ry={4.5} fill={INK} opacity={0.14} />;
}

export function ChestClosed({ size = 96, className, ...rest }: ArtProps) {
  const p = WOOD;
  return (
    <svg {...svgBase(size, className)} {...rest}>
      <ChestShadow />
      <ChestBody p={p} />
      <ChestLid p={p} />
      <ChestRim p={p} />
      {/* lock plate */}
      <path d="M42 45 Q42 42 45 42 L55 42 Q58 42 58 45 L58 58 Q58 63 50 65 Q42 63 42 58 Z" fill={C.gold} stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
      <path d="M44.5 45 L48 45" stroke="#fff" strokeOpacity={0.7} strokeWidth={1.6} strokeLinecap="round" />
      <circle cx={50} cy={51} r={2.6} fill={INK} />
      <path d="M50 52 L50 57" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
      <Sparkle x={84} y={22} r={4.5} fill={C.goldLight} />
      <Sparkle x={15} y={30} r={3} fill="#fff" delay={2} />
    </svg>
  );
}

export function ChestOpen({ size = 96, className, ...rest }: ArtProps) {
  const p = WOOD;
  const glow = useSvgId('glow');
  const pile = useSvgId('pile');
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 * Math.PI) / 180;
    const b = ((i * 30 + 11) * Math.PI) / 180;
    const R = 58;
    return `M50 44 L${(50 + R * Math.cos(a)).toFixed(2)} ${(44 + R * Math.sin(a)).toFixed(2)} L${(50 + R * Math.cos(b)).toFixed(2)} ${(44 + R * Math.sin(b)).toFixed(2)} Z`;
  });
  return (
    <svg {...svgBase(size, className)} {...rest}>
      <defs>
        <radialGradient id={glow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={C.goldLight} stopOpacity={0.95} />
          <stop offset="0.55" stopColor={C.gold} stopOpacity={0.45} />
          <stop offset="1" stopColor={C.gold} stopOpacity={0} />
        </radialGradient>
        <linearGradient id={pile} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.goldLight} />
          <stop offset="1" stopColor={C.gold} />
        </linearGradient>
      </defs>

      {/* glow rays */}
      <g className="kk-spin-slow">
        <g fill={C.goldLight} opacity={0.55}>
          {rays.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </g>
      <circle cx={50} cy={44} r={36} fill={`url(#${glow})`} />

      <ChestShadow />

      {/* lid flipped open (we see its inside) */}
      <Sticker d="M17 49 L12 21 C12 13 30 9 50 9 C70 9 88 13 88 21 L83 49 Z" fill="#9C5224" shade="#7A3D18">
        <path d="M14 30 C28 25 72 25 86 30" fill="none" stroke="#6B3414" strokeWidth={1.8} />
        <rect x={22} y={4} width={8} height={50} fill={p.band} stroke={INK} strokeWidth={2} />
        <rect x={70} y={4} width={8} height={50} fill={p.band} stroke={INK} strokeWidth={2} />
      </Sticker>

      <ChestBody p={p} />

      {/* dark opening + treasure heap */}
      <path d="M15 50 Q50 43 85 50 Q50 54 15 50 Z" fill="#4A230F" />
      <path d="M19 50 Q24 36 38 35 Q46 29 56 32 Q70 32 81 50 Z" fill={`url(#${pile})`} stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
      <Coin x={33} y={42} r={5.2} tilt={-15} />
      <Coin x={46} y={37} r={5.6} />
      <Coin x={61} y={39} r={5.2} tilt={20} />
      <Coin x={71} y={45} r={4.6} tilt={-10} />
      <Gem x={53} y={44} s={0.95} fill={C.sky} shade={C.skyShade} />
      <Gem x={39} y={46} s={0.75} fill={C.pink} shade={C.pinkShade} />
      <Gem x={64} y={31} s={0.7} fill={C.mint} shade={C.mintShade} />
      <ChestRim p={p} />

      {/* spilling over the front */}
      <Coin x={20} y={58} r={5} tilt={-30} />
      <Coin x={82} y={60} r={4.6} tilt={25} />
      <Gem x={85} y={84} s={0.85} fill={C.coral} shade={C.coralShade} />
      <Coin x={12} y={86} r={5} tilt={-60} />
      <Coin x={92} y={88} r={4} tilt={70} />

      {/* open lock plate hanging */}
      <path d="M43 52 L57 52 L57 61 Q57 65 50 67 Q43 65 43 61 Z" fill={C.gold} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <circle cx={50} cy={58} r={2.2} fill={INK} />

      <Sparkle x={18} y={18} r={5} fill="#fff" />
      <Sparkle x={86} y={12} r={4} fill={C.goldLight} delay={1} />
      <Sparkle x={50} y={22} r={3.4} fill="#fff" delay={2} />
      <Sparkle x={92} y={36} r={3} fill="#fff" delay={3} />
    </svg>
  );
}

export function ChestLocked({ size = 96, className, ...rest }: ArtProps) {
  const p = GREY;
  return (
    <svg {...svgBase(size, className)} {...rest}>
      <ChestShadow />
      <ChestBody p={p} />
      <ChestLid p={p} />
      <ChestRim p={p} />
      {/* padlock */}
      <path d="M41 56 V47 a9 9 0 0 1 18 0 V56" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
      <path d="M41 56 V47 a9 9 0 0 1 18 0 V56" fill="none" stroke="#C7CCDD" strokeWidth={4} strokeLinecap="round" />
      <Sticker d="M35 56 Q35 52 39 52 L61 52 Q65 52 65 56 L65 72 Q65 77 60 77 L40 77 Q35 77 35 72 Z" fill="#7C84A6" shade="#5E6688" hl={[42, 57, 4, 2, -20]} sw={2.8} />
      <circle cx={50} cy={62} r={3.2} fill={INK} />
      <path d="M50 63 L50 70" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      <g fill="#9AA1BE">
        <circle cx={14} cy={20} r={2} />
        <circle cx={86} cy={26} r={1.6} />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Dream-goal jar                                                      */
/* ------------------------------------------------------------------ */

const JAR =
  'M30 25 L70 25 Q72 25 72 27 L72 30 Q80 34 80 46 L80 85 Q80 95 70 95 L30 95 Q20 95 20 85 L20 46 Q20 34 28 30 L28 27 Q28 25 30 25 Z';

const BUBBLES: Array<[number, number, number]> = [
  [32, 86, 2.4],
  [44, 78, 1.6],
  [60, 88, 2],
  [68, 74, 2.6],
  [38, 64, 1.8],
  [56, 58, 2.2],
  [30, 48, 1.6],
  [66, 44, 1.8],
  [48, 40, 2],
];

export function GoalJar({ fill = 0.5, size = 96, className, ...rest }: Omit<ArtProps, 'fill'> & { fill?: number }) {
  const f = Math.min(1, Math.max(0, Number.isFinite(fill) ? fill : 0));
  const clip = useSvgId('jar');
  const liquid = useSvgId('liquid');
  const top = 93 - f * 60; // liquid surface y (93 empty -> 33 full)
  const wave = `M8 ${top} Q20 ${top - 3} 32 ${top} T56 ${top} T80 ${top} T104 ${top} V100 H8 Z`;
  const surface = `M8 ${top} Q20 ${top - 3} 32 ${top} T56 ${top} T80 ${top} T104 ${top}`;
  return (
    <svg {...svgBase(size, className)} {...rest}>
      <defs>
        <clipPath id={clip}>
          <path d={JAR} />
        </clipPath>
        <linearGradient id={liquid} gradientUnits="userSpaceOnUse" x1="0" y1="95" x2="0" y2="33">
          <stop offset="0" stopColor={C.mint} />
          <stop offset="0.55" stopColor="#9BE08A" />
          <stop offset="1" stopColor={C.gold} />
        </linearGradient>
      </defs>

      <ellipse cx={50} cy={96} rx={32} ry={3.5} fill={INK} opacity={0.14} />

      {/* ribbon tails (behind jar) */}
      <path d="M74 64 L86 80 L81 79.5 L79.5 84 L70 68 Z" fill={C.coralShade} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M78 64 L92 74 L87.5 75.5 L87.5 80 L75 69 Z" fill={C.coral} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />

      <g clipPath={`url(#${clip})`}>
        <rect x={0} y={0} width={100} height={100} fill="#E8F8FE" opacity={0.75} />
        {f > 0 && (
          <g>
            <path d={wave} fill={`url(#${liquid})`} />
            <path d={surface} fill="none" stroke="#fff" strokeOpacity={0.7} strokeWidth={2} />
            <path d="M68 0 L82 0 L82 100 L68 100 Z" fill={INK} opacity={0.06} />
            {BUBBLES.filter(([, cy, r]) => cy - r > top + 2).map(([cx, cy, r], i) => (
              <g key={`${cx}-${cy}`} className={`kk-twinkle kk-delay-${(i % 3) + 1}`}>
                <circle cx={cx} cy={cy} r={r} fill="#fff" opacity={0.75} />
              </g>
            ))}
          </g>
        )}
        {/* ribbon band */}
        <path d="M0 57 L100 57 L100 69 L0 69 Z" fill={C.coral} />
        <path d="M0 57 H100 M0 69 H100" stroke={INK} strokeWidth={2.2} />
        <path d="M0 66.5 H100" stroke={C.coralShade} strokeWidth={2} />
      </g>

      {/* glass shine */}
      <path d="M26 44 Q24.5 50 25 55" fill="none" stroke="#fff" strokeOpacity={0.85} strokeWidth={4} strokeLinecap="round" />
      <path d="M25.5 74 L25.5 84" fill="none" stroke="#fff" strokeOpacity={0.7} strokeWidth={4} strokeLinecap="round" />
      <path d="M73 78 Q74 84 71 88" fill="none" stroke="#fff" strokeOpacity={0.45} strokeWidth={2} strokeLinecap="round" />
      <path d={JAR} fill="none" stroke={INK} strokeWidth={3} strokeLinejoin="round" />

      {/* label */}
      <path d="M38 55.5 Q38 53 41 53 L59 53 Q62 53 62 55.5 L62 70.5 Q62 73 59 73 L41 73 Q38 73 38 70.5 Z" fill={C.cream} stroke={INK} strokeWidth={2.2} />
      <path d={starPath(50, 63.5, 6.4, 3)} fill={C.gold} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />

      {/* lid */}
      <Sticker d="M23 16 Q23 12.5 26.5 12.5 L73.5 12.5 Q77 12.5 77 16 L77 25 Q77 28.5 73.5 28.5 L26.5 28.5 Q23 28.5 23 25 Z" fill={C.indigo} shade={C.indigoDark} hl={[34, 16.5, 7, 1.8, 0]} sw={2.8}>
        <path d="M31 13 V29 M39 13 V29 M47 13 V29 M55 13 V29 M63 13 V29 M71 13 V29" stroke={C.indigoDark} strokeWidth={1.6} opacity={0.7} />
      </Sticker>
      <Sticker d={starPath(50, 12, 10, 4.8)} fill={C.gold} shade={C.goldShade} hl={[47, 9, 2.4, 1.4, -30]} sw={2.6} />

      {f >= 1 && (
        <g>
          <Sparkle x={14} y={30} r={5} fill={C.goldLight} />
          <Sparkle x={88} y={40} r={4} fill="#fff" delay={2} />
          <Sparkle x={84} y={10} r={3.4} fill={C.goldLight} delay={1} />
        </g>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Streak flame                                                        */
/* ------------------------------------------------------------------ */

const FLAME_LEVELS = [
  { outer: C.orange, outerShade: C.orangeShade, mid: C.gold, inner: C.goldLight, core: null, s: 0.72 },
  { outer: C.coral, outerShade: C.coralShade, mid: C.orange, inner: C.gold, core: null, s: 0.82 },
  { outer: C.orange, outerShade: C.coral, mid: C.gold, inner: C.goldLight, core: null, s: 0.92 },
  { outer: C.gold, outerShade: C.orange, mid: C.goldLight, inner: '#FFFDF4', core: C.sky, s: 1 },
] as const;

export function FlameBig({ size = 72, intensity = 1, className, ...rest }: ArtProps & { intensity?: number }) {
  const lvl = Math.min(3, Math.max(0, Math.round(Number.isFinite(intensity) ? intensity : 1)));
  const L = FLAME_LEVELS[lvl];
  const outer =
    'M50 5 C58 21 77 30 79 54 C81 77 67 92 50 92 C33 92 19 80 20 60 C21 46 29 40 31 29 C37 37 40 43 42 46 C42 32 44 18 50 5 Z';
  const mid =
    'M50 37 C56 48 67 55 67 70 C67 82 59 89 50 89 C41 89 33 82 33 71 C33 62 39 57 41 51 C44 55 45 57 46.5 59 C46.5 51 48 44 50 37 Z';
  const inner = 'M50 58 C56 66 60 71 60 77.5 C60 84 55 88 50 88 C45 88 40 84 40 77.5 C40 71 44 66 50 58 Z';
  return (
    <svg {...svgBase(size, className)} {...rest}>
      <g transform={`translate(50 94) scale(${L.s}) translate(-50 -94)`}>
        <ellipse cx={50} cy={92} rx={26} ry={4} fill={L.outer} opacity={0.35} />
        {/* Every layer and the face move together, from the base. */}
        <g className="kk-flicker">
        <Sticker d={outer} fill={L.outer} shade={L.outerShade} hl={[35, 52, 4, 10, 15]} />
        <path d={mid} fill={L.mid} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
        <path d={inner} fill={L.inner} />
        {/* The hottest core sits below the smile so it never covers the face. */}
        {L.core && <path d="M50 79.5 C53 82.5 54.5 84.6 54.5 86.6 C54.5 88.6 52.5 89.8 50 89.8 C47.5 89.8 45.5 88.6 45.5 86.6 C45.5 84.6 47 82.5 50 79.5 Z" fill={L.core} stroke={INK} strokeWidth={1.4} />}
        {/* happy little face */}
        <g className="kk-blink">
          <ellipse cx={43.5} cy={68} rx={2.4} ry={3} fill={INK} />
          <ellipse cx={56.5} cy={68} rx={2.4} ry={3} fill={INK} />
          <circle cx={42.7} cy={66.8} r={0.9} fill="#fff" />
          <circle cx={55.7} cy={66.8} r={0.9} fill="#fff" />
        </g>
        <path d="M46.5 74 Q50 77.5 53.5 74" fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
        <ellipse cx={39.5} cy={73} rx={2.6} ry={1.6} fill={C.pink} opacity={0.65} />
        <ellipse cx={60.5} cy={73} rx={2.6} ry={1.6} fill={C.pink} opacity={0.65} />
        </g>
        {lvl >= 2 && (
          <g>
            <Sparkle x={18} y={36} r={4} fill={C.goldLight} />
            <Sparkle x={84} y={28} r={3.4} fill={C.goldLight} delay={2} />
          </g>
        )}
        {lvl >= 3 && (
          <g>
            <circle cx={74} cy={14} r={2.4} fill={C.gold} stroke={INK} strokeWidth={1.4} />
            <circle cx={26} cy={18} r={1.8} fill={C.orange} stroke={INK} strokeWidth={1.2} />
            <Sparkle x={86} y={60} r={3} fill="#fff" delay={3} />
          </g>
        )}
      </g>
    </svg>
  );
}
