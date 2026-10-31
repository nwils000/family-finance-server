import { useId } from 'react';
import type { ArtProps } from './types';
import { sparklePath, starPath } from './decor';

const INK = '#1F2547';
const GOLD = '#FFC83D';
const GOLD_SHADE = '#F59E0B';
const GOLD_HL = '#FFE68A';

const useUid = () => useId().replace(/:/g, '');

/** Face-on coin centered at (cx, cy) with radius r. */
export function CoinFace({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const k = r / 42;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={GOLD_SHADE} stroke={INK} strokeWidth={3 * Math.max(k, 0.6)} />
      <circle cx={cx - r * 0.05} cy={cy - r * 0.07} r={r * 0.86} fill={GOLD} />
      <circle cx={cx - r * 0.05} cy={cy - r * 0.07} r={r * 0.66} fill="none" stroke={GOLD_SHADE} strokeWidth={r * 0.07} />
      <path d={starPath(cx - r * 0.05, cy - r * 0.04, r * 0.4, r * 0.19)} fill={GOLD_HL} stroke={GOLD_SHADE} strokeWidth={r * 0.06} strokeLinejoin="round" />
      <ellipse cx={cx - r * 0.45} cy={cy - r * 0.45} rx={r * 0.2} ry={r * 0.09} transform={`rotate(-45 ${cx - r * 0.45} ${cy - r * 0.45})`} fill="#fff" opacity={0.65} />
    </g>
  );
}

function Twinkle({ x, y, r, color = '#fff', delay = 1 }: { x: number; y: number; r: number; color?: string; delay?: number }) {
  return (
    <path className={`kk-twinkle kk-delay-${delay}`} d={sparklePath(x, y, r)} fill={color} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
  );
}

export function Coin({ size = 64, className, ...rest }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true" {...rest}>
      <CoinFace cx={48} cy={52} r={42} />
      <Twinkle x={86} y={16} r={8} color={GOLD_HL} />
    </svg>
  );
}

function SideCoin({ cx, y, rx = 30, ry = 10, h = 9, top = false }: { cx: number; y: number; rx?: number; ry?: number; h?: number; top?: boolean }) {
  return (
    <g strokeLinejoin="round">
      <path d={`M${cx - rx} ${y} v${h} a${rx} ${ry} 0 0 0 ${rx * 2} 0 v${-h} Z`} fill={GOLD_SHADE} stroke={INK} strokeWidth={3} />
      <g stroke="#D97F06" strokeWidth={1.6} strokeLinecap="round">
        {[-0.7, -0.35, 0, 0.35, 0.7].map((t) => (
          <path key={t} d={`M${cx + t * rx} ${y + ry * Math.sqrt(1 - t * t) + 1.5} v${h - 3}`} />
        ))}
      </g>
      <ellipse cx={cx} cy={y} rx={rx} ry={ry} fill={GOLD} stroke={INK} strokeWidth={3} />
      <ellipse cx={cx} cy={y} rx={rx * 0.68} ry={ry * 0.62} fill="none" stroke={GOLD_SHADE} strokeWidth={1.8} />
      {top && (
        <g transform={`translate(${cx} ${y}) scale(1 ${ry / rx})`}>
          <path d={starPath(0, 1, 12, 5.6)} fill={GOLD_HL} stroke={GOLD_SHADE} strokeWidth={2.4} strokeLinejoin="round" />
        </g>
      )}
      <ellipse cx={cx - rx * 0.55} cy={y - ry * 0.3} rx={5} ry={1.8} fill="#fff" opacity={0.6} />
    </g>
  );
}

export function CoinStack({ size = 64, className, ...rest }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true" {...rest}>
      <ellipse cx={50} cy={90} rx={34} ry={5} fill={INK} opacity={0.12} />
      <SideCoin cx={47} y={72} />
      <SideCoin cx={53} y={59} />
      <SideCoin cx={48} y={46} top />
      <Twinkle x={84} y={24} r={8} color={GOLD_HL} />
      <Twinkle x={16} y={30} r={5} delay={2} />
    </svg>
  );
}

const GEM_TONES = {
  grape: { main: '#9B5DE5', light: '#BE94F5', table: '#E2CCFF', dark: '#7A3BCB', mid: '#8A4CDB' },
  sky: { main: '#4CC9F0', light: '#86DDF6', table: '#CFF3FD', dark: '#1FA2D2', mid: '#33B6E4' },
} as const;

export function Gem({ size = 64, className, tone = 'grape', ...rest }: ArtProps & { tone?: 'grape' | 'sky' }) {
  const c = GEM_TONES[tone];
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true" {...rest}>
      <path d="M30 22 L70 22 L90 42 L50 92 L10 42 Z" fill={c.main} />
      <path d="M30 22 L70 22 L90 42 L10 42 Z" fill={c.light} />
      <path d="M40 22 L60 22 L66 42 L34 42 Z" fill={c.table} />
      <path d="M10 42 L34 42 L50 92 Z" fill={c.dark} />
      <path d="M66 42 L90 42 L50 92 Z" fill={c.mid} />
      <g fill="none" stroke={INK} strokeWidth={2} strokeLinejoin="round" strokeOpacity={0.55}>
        <path d="M10 42 H90 M40 22 L34 42 L50 92 L66 42 L60 22" />
      </g>
      <path d="M30 22 L70 22 L90 42 L50 92 L10 42 Z" fill="none" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M22 38 L32 27" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.7} />
      <Twinkle x={78} y={18} r={8} />
      <Twinkle x={24} y={74} r={5} delay={3} />
    </svg>
  );
}

const dollar = 'M1.8 -2.2 C0.8 -3.2 -2 -2.9 -2 -1.2 C-2 0.6 2 -0.2 2 1.6 C2 3.1 -0.8 3.3 -2.1 2.2 M0 -4.2 V4.2';

export function Bill({ size = 64, className, ...rest }: ArtProps) {
  const clip = `kk-bill-${useUid()}`;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true" {...rest}>
      <defs>
        <clipPath id={clip}>
          <rect x={8} y={26} width={84} height={48} rx={7} />
        </clipPath>
      </defs>
      <g transform="rotate(-8 50 50)">
        <rect x={12} y={32} width={84} height={48} rx={7} fill="#1DB98A" stroke={INK} strokeWidth={3} opacity={0.9} />
        <g clipPath={`url(#${clip})`}>
          <rect x={0} y={0} width={100} height={100} fill="#1DB98A" />
          <rect x={6} y={23} width={84} height={46} rx={7} fill="#2ED3A0" />
          <ellipse cx={24} cy={34} rx={9} ry={4} transform="rotate(-15 24 34)" fill="#fff" opacity={0.35} />
        </g>
        <rect x={15} y={33} width={70} height={34} rx={4} fill="none" stroke="#DFFAF0" strokeWidth={2} strokeDasharray="4 3" opacity={0.8} />
        <rect x={8} y={26} width={84} height={48} rx={7} fill="none" stroke={INK} strokeWidth={3} />
        <ellipse cx={50} cy={50} rx={15} ry={13.5} fill="#DFFAF0" stroke={INK} strokeWidth={2.4} />
        <g className="kk-blink">
          <ellipse cx={45} cy={47} rx={2} ry={2.6} fill={INK} />
          <ellipse cx={55} cy={47} rx={2} ry={2.6} fill={INK} />
        </g>
        <ellipse cx={41} cy={53} rx={2.6} ry={1.6} fill="#FF8FC7" opacity={0.7} />
        <ellipse cx={59} cy={53} rx={2.6} ry={1.6} fill="#FF8FC7" opacity={0.7} />
        <path d="M45 53 Q50 58 55 53" fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
        {[[22, 40], [78, 60]].map(([x, y]) => (
          <g key={x}>
            <circle cx={x} cy={y} r={6} fill="#DFFAF0" stroke={INK} strokeWidth={2} />
            <path d={dollar} transform={`translate(${x} ${y}) scale(0.9)`} fill="none" stroke="#1DB98A" strokeWidth={1.8} strokeLinecap="round" />
          </g>
        ))}
      </g>
    </svg>
  );
}

const JAR = 'M30 28 H70 V32 C80 36 84 44 84 56 V80 C84 88 78 92 70 92 H30 C22 92 16 88 16 80 V56 C16 44 20 36 30 32 Z';

export function CoinJar({ size = 64, className, fill = 0.5, ...rest }: Omit<ArtProps, 'fill'> & { fill?: number }) {
  const clip = `kk-jar-${useUid()}`;
  const f = Math.min(1, Math.max(0, Number.isFinite(fill) ? fill : 0));
  const level = 91 - f * 57;
  const coins: { x: number; y: number }[] = [];
  if (f > 0) {
    for (let row = 0; row < 8; row++) {
      const y = 88 - row * 7.5;
      if (y < level + 3) break;
      for (let col = 0; col < 6; col++) coins.push({ x: 20 + col * 12 + (row % 2 ? 6 : 0), y });
    }
  }
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true" {...rest}>
      <defs>
        <clipPath id={clip}>
          <path d={JAR} />
        </clipPath>
      </defs>
      <path d={JAR} fill="#4CC9F0" fillOpacity={0.22} />
      <g clipPath={`url(#${clip})`}>
        {f > 0 && <rect x={0} y={level + 3} width={100} height={100} fill={GOLD_SHADE} />}
        {coins.map((c) => (
          <g key={`${c.x}-${c.y}`}>
            <circle cx={c.x} cy={c.y} r={6.2} fill={GOLD} stroke={INK} strokeWidth={1.6} />
            <circle cx={c.x - 0.4} cy={c.y - 0.4} r={3.2} fill="none" stroke={GOLD_SHADE} strokeWidth={1.2} />
          </g>
        ))}
        <path d="M68 40 C76 44 78 52 78 60 V82" fill="none" stroke="#1FA2D2" strokeOpacity={0.35} strokeWidth={5} strokeLinecap="round" />
      </g>
      <rect x={22} y={44} width={5.5} height={34} rx={2.75} fill="#fff" opacity={0.6} />
      <rect x={22} y={81} width={5.5} height={4} rx={2} fill="#fff" opacity={0.6} />
      <path d={JAR} fill="none" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      {/* lid */}
      <rect x={25} y={13} width={50} height={16} rx={5} fill="#FF6B6B" stroke={INK} strokeWidth={3} />
      <path d="M33 17 v8 M41 17 v8 M49 17 v8 M57 17 v8 M65 17 v8" stroke="#E84B5A" strokeWidth={2.4} strokeLinecap="round" />
      <rect x={29} y={15.5} width={14} height={3} rx={1.5} fill="#fff" opacity={0.45} />
      {f >= 1 && <Twinkle x={86} y={14} r={7} color={GOLD_HL} />}
    </svg>
  );
}

export function PiggyBank({ size = 64, className, ...rest }: ArtProps) {
  const clip = `kk-piggy-${useUid()}`;
  const body = 'M14 54 C14 38 28 28 48 28 C68 28 82 38 82 54 C82 70 68 80 48 80 C28 80 14 70 14 54 Z';
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true" {...rest}>
      <defs>
        <clipPath id={clip}>
          <path d={body} />
        </clipPath>
      </defs>
      <ellipse cx={48} cy={92} rx={34} ry={4} fill={INK} opacity={0.12} />
      {/* coin dropping in */}
      <g className="kk-bob">
        <rect x={39} y={6} width={14} height={18} rx={7} fill={GOLD} stroke={INK} strokeWidth={2.5} />
        <path d="M46 10 v10" stroke={GOLD_SHADE} strokeWidth={2.4} strokeLinecap="round" />
      </g>
      {/* tail */}
      <path d="M16 52 c-6 -2 -10 2 -7 5 c3 3 6 -2 3 -3 c-3 -1 -7 1 -8 -4" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 52 c-6 -2 -10 2 -7 5 c3 3 6 -2 3 -3 c-3 -1 -7 1 -8 -4" fill="none" stroke="#FF8FC7" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      {/* back legs */}
      <rect x={34} y={68} width={11} height={20} rx={4.5} fill="#EE68AC" stroke={INK} strokeWidth={3} />
      <rect x={64} y={68} width={11} height={20} rx={4.5} fill="#EE68AC" stroke={INK} strokeWidth={3} />
      {/* front legs */}
      <rect x={24} y={70} width={12} height={20} rx={5} fill="#FF8FC7" stroke={INK} strokeWidth={3} />
      <rect x={54} y={70} width={12} height={20} rx={5} fill="#FF8FC7" stroke={INK} strokeWidth={3} />
      {/* ear (back) */}
      <path d="M58 32 L64 16 L74 34 Z" fill="#EE68AC" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      {/* body */}
      <g clipPath={`url(#${clip})`}>
        <rect x={0} y={0} width={100} height={100} fill="#EE68AC" />
        <path d={body} transform="translate(-2 -4)" fill="#FF8FC7" />
        <ellipse cx={34} cy={38} rx={11} ry={5} transform="rotate(-15 34 38)" fill="#fff" opacity={0.35} />
      </g>
      <path d={body} fill="none" stroke={INK} strokeWidth={3} />
      {/* ear (front) */}
      <path d="M64 33 L70 18 L79 37 Z" fill="#FF8FC7" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <path d="M67 32 L70 24 L74 33 Z" fill="#EE68AC" />
      {/* slot */}
      <rect x={38} y={26} width={17} height={5} rx={2.5} fill={INK} />
      {/* snout */}
      <ellipse cx={84} cy={56} rx={8} ry={10} fill="#FFC2E1" stroke={INK} strokeWidth={3} />
      <ellipse cx={82.5} cy={52.5} rx={1.5} ry={2.2} fill="#EE68AC" />
      <ellipse cx={86.5} cy={59} rx={1.5} ry={2.2} fill="#EE68AC" />
      {/* face */}
      <g className="kk-blink">
        <ellipse cx={68} cy={47} rx={3.4} ry={4.4} fill={INK} />
        <circle cx={67} cy={45.4} r={1.4} fill="#fff" />
      </g>
      <ellipse cx={70} cy={60} rx={5} ry={3.2} fill="#EE68AC" opacity={0.7} />
      <path d="M72 67 Q75 70 78 67" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  );
}

export function Rocket({ size = 64, className, ...rest }: ArtProps) {
  const clip = `kk-rocket-${useUid()}`;
  const body = 'M50 8 C64 20 68 40 66 66 H34 C32 40 36 20 50 8 Z';
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true" {...rest}>
      <defs>
        <clipPath id={clip}>
          <path d={body} />
        </clipPath>
      </defs>
      <Twinkle x={16} y={20} r={6} color={GOLD_HL} />
      <Twinkle x={86} y={70} r={5} color="#4CC9F0" delay={2} />
      <g transform="rotate(28 50 52)">
        <g className="kk-wiggle">
          <path d="M40 72 C40 84 46 90 50 98 C54 90 60 84 60 72 Z" fill="#FF9F43" stroke={INK} strokeWidth={2.8} strokeLinejoin="round" />
          <path d="M44 72 C44 80 48 84 50 90 C52 84 56 80 56 72 Z" fill={GOLD} />
        </g>
        <rect x={39} y={64} width={22} height={9} rx={3} fill="#5B5BF7" stroke={INK} strokeWidth={3} />
        <path d="M35 48 C24 52 20 62 22 74 L36 66 Z" fill="#FF6B6B" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        <path d="M65 48 C76 52 80 62 78 74 L64 66 Z" fill="#FF6B6B" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        <g clipPath={`url(#${clip})`}>
          <rect x={0} y={0} width={100} height={100} fill="#DCDFF0" />
          <rect x={20} y={0} width={40} height={100} fill="#fff" />
          <path d="M28 26 Q50 33 72 26 V0 H28 Z" fill="#FF6B6B" />
          <path d="M60 0 V27 Q66 26 72 24 V0 Z" fill="#E84B5A" />
          <ellipse cx={42} cy={22} rx={2.5} ry={6} transform="rotate(20 42 22)" fill="#fff" opacity={0.5} />
        </g>
        <path d={body} fill="none" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        <path d="M30 27 Q50 34 70 27" fill="none" stroke={INK} strokeWidth={2.5} />
        <circle cx={50} cy={44} r={9.5} fill="#4CC9F0" stroke={INK} strokeWidth={3} />
        <circle cx={50} cy={44} r={6} fill="none" stroke="#fff" strokeOpacity={0.5} strokeWidth={1.5} />
        <ellipse cx={46.5} cy={40.5} rx={3} ry={1.8} transform="rotate(-40 46.5 40.5)" fill="#fff" />
        <path d="M50 66 V56" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function TreasureChest({ size = 64, className, open = false, ...rest }: ArtProps & { open?: boolean }) {
  const uid = useUid();
  const glow = `kk-chest-glow-${uid}`;
  const wood = '#C68645';
  const woodDark = '#A86B32';
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true" {...rest}>
      <defs>
        <radialGradient id={glow} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={GOLD_HL} stopOpacity={0.95} />
          <stop offset="60%" stopColor={GOLD} stopOpacity={0.35} />
          <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={50} cy={92} rx={38} ry={4} fill={INK} opacity={0.12} />
      {open ? (
        <g>
          <circle className="kk-twinkle" cx={50} cy={40} r={44} fill={`url(#${glow})`} />
          {/* open lid, tipped back */}
          <path d="M18 46 L22 14 C32 9 68 9 78 14 L82 46 Z" fill="#8A5A2E" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          <path d="M24 42 L27 18 C36 14 64 14 73 18 L76 42 Z" fill="#6E4524" />
          {/* gold pile */}
          <path d="M16 54 C18 44 28 40 34 44 C38 34 54 32 60 40 C66 36 80 38 84 54 Z" fill={GOLD} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          {[[30, 46], [44, 40], [58, 44], [70, 47], [50, 49]].map(([x, y]) => (
            <g key={`${x}`}>
              <circle cx={x} cy={y} r={5} fill={GOLD} stroke={GOLD_SHADE} strokeWidth={1.8} />
              <path d={sparklePath(x, y, 2.4)} fill={GOLD_HL} />
            </g>
          ))}
          <path d={sparklePath(40, 30, 3)} fill="#fff" />
          <Twinkle x={16} y={22} r={6} color={GOLD_HL} />
          <Twinkle x={86} y={26} r={7} color={GOLD_HL} delay={2} />
          <Twinkle x={52} y={8} r={5} delay={3} />
        </g>
      ) : (
        <g>
          <path d="M14 54 V40 C14 28 26 22 50 22 C74 22 86 28 86 40 V54 Z" fill={wood} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          <path d="M18 38 C20 30 30 27 44 26" fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={3.5} strokeLinecap="round" />
          <path d="M26 54 V25 M74 54 V25" stroke={GOLD} strokeWidth={7} />
          <path d="M22.5 54 V26.5 M29.5 54 V23.5 M70.5 54 V23.5 M77.5 54 V26.5" stroke={INK} strokeWidth={2} />
        </g>
      )}
      {/* base */}
      <rect x={14} y={52} width={72} height={36} rx={5} fill={wood} stroke={INK} strokeWidth={3} />
      <path d="M17 70 H83" stroke={woodDark} strokeWidth={2.5} />
      <rect x={16} y={80} width={68} height={6} rx={2} fill={woodDark} />
      <rect x={22.5} y={53.5} width={7} height={33} fill={GOLD} stroke={INK} strokeWidth={2} />
      <rect x={70.5} y={53.5} width={7} height={33} fill={GOLD} stroke={INK} strokeWidth={2} />
      <rect x={14} y={52} width={72} height={36} rx={5} fill="none" stroke={INK} strokeWidth={3} />
      {/* lock */}
      <rect x={42} y={50} width={16} height={18} rx={4} fill={GOLD} stroke={INK} strokeWidth={2.6} />
      <circle cx={50} cy={57} r={2.3} fill={INK} />
      <path d="M50 58 v5" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
    </svg>
  );
}

export function Trophy({ size = 64, className, ...rest }: ArtProps) {
  const clip = `kk-trophy-${useUid()}`;
  const cup = 'M28 14 H72 V38 C72 52 62 62 50 62 C38 62 28 52 28 38 Z';
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true" {...rest}>
      <defs>
        <clipPath id={clip}>
          <path d={cup} />
        </clipPath>
      </defs>
      {/* handles */}
      {['M29 22 C14 20 12 44 32 48', 'M71 22 C86 20 88 44 68 48'].map((d) => (
        <g key={d} fill="none" strokeLinecap="round">
          <path d={d} stroke={INK} strokeWidth={9} />
          <path d={d} stroke={GOLD} strokeWidth={4} />
        </g>
      ))}
      <g clipPath={`url(#${clip})`}>
        <rect x={0} y={0} width={100} height={100} fill={GOLD_SHADE} />
        <path d={cup} transform="translate(-3 -3)" fill={GOLD} />
        <rect x={34} y={18} width={5} height={30} rx={2.5} fill="#fff" opacity={0.5} />
      </g>
      <path d={cup} fill="none" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <path d={starPath(50, 36, 11, 5)} fill={GOLD_HL} stroke={GOLD_SHADE} strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M44 61 H56 L58 74 H42 Z" fill={GOLD_SHADE} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <rect x={28} y={72} width={44} height={18} rx={4} fill="#5B5BF7" stroke={INK} strokeWidth={3} />
      <rect x={38} y={78} width={24} height={6} rx={2} fill={GOLD} stroke={INK} strokeWidth={1.8} />
      <rect x={31} y={74.5} width={14} height={2.5} rx={1.2} fill="#fff" opacity={0.35} />
      <Twinkle x={84} y={10} r={7} color={GOLD_HL} />
      <Twinkle x={14} y={62} r={5} delay={2} />
    </svg>
  );
}

export function Wallet({ size = 64, className, ...rest }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true" {...rest}>
      {/* bill peeking out */}
      <g transform="rotate(-10 44 32)">
        <rect x={20} y={18} width={48} height={28} rx={4} fill="#2ED3A0" stroke={INK} strokeWidth={2.6} />
        <circle cx={44} cy={30} r={6} fill="#DFFAF0" stroke={INK} strokeWidth={1.8} />
        <path d={dollar} transform="translate(44 30) scale(0.9)" fill="none" stroke="#1DB98A" strokeWidth={1.8} strokeLinecap="round" />
      </g>
      <CoinFace cx={74} cy={28} r={12} />
      {/* body */}
      <rect x={10} y={34} width={80} height={56} rx={11} fill="#4747D9" stroke={INK} strokeWidth={3} />
      <rect x={10} y={34} width={77} height={52} rx={11} fill="#5B5BF7" />
      <rect x={10} y={34} width={80} height={56} rx={11} fill="none" stroke={INK} strokeWidth={3} />
      <rect x={16} y={40} width={68} height={44} rx={7} fill="none" stroke="#fff" strokeOpacity={0.45} strokeWidth={1.8} strokeDasharray="4 3" />
      <ellipse cx={24} cy={44} rx={8} ry={3.5} transform="rotate(-15 24 44)" fill="#fff" opacity={0.35} />
      {/* flap + clasp */}
      <path d="M90 50 H66 C60 50 56 54 56 60 C56 66 60 70 66 70 H90 Z" fill="#7B7BFF" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <circle cx={67} cy={60} r={5} fill={GOLD} stroke={INK} strokeWidth={2.4} />
      <circle cx={65.6} cy={58.6} r={1.6} fill="#fff" opacity={0.8} />
      <Twinkle x={90} y={12} r={6} color={GOLD_HL} />
    </svg>
  );
}
