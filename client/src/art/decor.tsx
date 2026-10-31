import { useId, type ReactNode } from 'react';
import type { ArtProps } from './types';

const INK = '#1F2547';

/** Path for an n-point star centered at (cx, cy). */
export function starPath(cx: number, cy: number, outer: number, inner = outer * 0.48, points = 5): string {
  const step = Math.PI / points;
  let d = '';
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = -Math.PI / 2 + i * step;
    d += `${i === 0 ? 'M' : 'L'}${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)} `;
  }
  return `${d}Z`;
}

/** Path for a soft 4-point sparkle centered at (cx, cy) with radius r. */
export function sparklePath(cx: number, cy: number, r: number): string {
  const k = r * 0.16;
  return `M${cx} ${cy - r} Q${cx + k} ${cy - k} ${cx + r} ${cy} Q${cx + k} ${cy + k} ${cx} ${cy + r} Q${cx - k} ${cy + k} ${cx - r} ${cy} Q${cx - k} ${cy - k} ${cx} ${cy - r} Z`;
}

function Svg({ size, className, children, rest }: { size: number | string; className?: string; children: ReactNode; rest: Omit<ArtProps, 'size' | 'className'> }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true" {...rest}>
      {children}
    </svg>
  );
}

export function Sparkle({ size = 64, className, ...rest }: ArtProps) {
  return (
    <Svg size={size} className={className} rest={rest}>
      <g className="kk-twinkle">
        <path d={sparklePath(50, 50, 44)} fill="#FFC83D" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        <path d={sparklePath(50, 50, 18)} fill="#FFE68A" />
        <circle cx={44} cy={42} r={3.5} fill="#fff" opacity={0.8} />
      </g>
    </Svg>
  );
}

export function Star({ size = 64, className, filled = true, ...rest }: ArtProps & { filled?: boolean }) {
  const uid = useId().replace(/:/g, '');
  const clip = `star-${uid}`;
  const d = starPath(50, 54, 44, 21);
  if (!filled) {
    return (
      <Svg size={size} className={className} rest={rest}>
        <path d={d} fill="#fff" fillOpacity={0.55} stroke={INK} strokeOpacity={0.28} strokeWidth={4} strokeLinejoin="round" />
      </Svg>
    );
  }
  return (
    <Svg size={size} className={className} rest={rest}>
      <defs>
        <clipPath id={clip}>
          <path d={d} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect width={100} height={100} fill="#F59E0B" />
        <path d={starPath(48, 50, 42, 20)} fill="#FFC83D" />
        <ellipse cx={38} cy={40} rx={9} ry={5} transform="rotate(-30 38 40)" fill="#fff" opacity={0.45} />
      </g>
      <path d={d} fill="none" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
    </Svg>
  );
}

export function Cloud({ size = 64, className, ...rest }: ArtProps) {
  const uid = useId().replace(/:/g, '');
  const clip = `cloud-${uid}`;
  const d = 'M22 74 C10 74 8 56 21 54 C19 40 36 34 44 44 C48 28 72 26 76 44 C90 42 96 60 84 70 C82 74 80 74 76 74 Z';
  return (
    <Svg size={size} className={className} rest={rest}>
      <defs>
        <clipPath id={clip}>
          <path d={d} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect width={100} height={100} fill="#D6F1FB" />
        <path d="M24 70 C14 70 12 58 23 57 C21 45 37 39 45 48 C49 33 71 31 74 48 C86 46 90 60 82 66 Z" fill="#fff" />
      </g>
      <path d={d} fill="none" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <ellipse cx={58} cy={40} rx={6} ry={3} transform="rotate(-20 58 40)" fill="#fff" />
    </Svg>
  );
}

const CONFETTI: { x: number; y: number; r: number; c: string; kind: 'rect' | 'dot' | 'squig' | 'tri' }[] = [
  { x: 20, y: 22, r: -25, c: '#FF6B6B', kind: 'rect' },
  { x: 50, y: 14, r: 15, c: '#FFC83D', kind: 'tri' },
  { x: 78, y: 24, r: 30, c: '#4CC9F0', kind: 'rect' },
  { x: 34, y: 46, r: 0, c: '#9B5DE5', kind: 'squig' },
  { x: 66, y: 50, r: 0, c: '#2ED3A0', kind: 'dot' },
  { x: 14, y: 66, r: 0, c: '#FF8FC7', kind: 'dot' },
  { x: 86, y: 62, r: -20, c: '#FF9F43', kind: 'tri' },
  { x: 48, y: 76, r: 40, c: '#5B5BF7', kind: 'rect' },
  { x: 74, y: 84, r: 0, c: '#FFC83D', kind: 'dot' },
  { x: 24, y: 88, r: 0, c: '#2ED3A0', kind: 'squig' },
];

export function Confetti({ size = 64, className, ...rest }: ArtProps) {
  return (
    <Svg size={size} className={className} rest={rest}>
      <g stroke={INK} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round">
        {CONFETTI.map((p, i) => {
          const t = `rotate(${p.r} ${p.x} ${p.y})`;
          const cls = `kk-twinkle kk-delay-${(i % 3) + 1}`;
          if (p.kind === 'rect') return <rect key={i} className={cls} x={p.x - 8} y={p.y - 4.5} width={16} height={9} rx={2.5} fill={p.c} transform={t} />;
          if (p.kind === 'dot') return <circle key={i} className={cls} cx={p.x} cy={p.y} r={6} fill={p.c} />;
          if (p.kind === 'tri') return <path key={i} className={cls} d={`M${p.x} ${p.y - 8} L${p.x + 8} ${p.y + 5} L${p.x - 8} ${p.y + 5} Z`} fill={p.c} transform={t} />;
          return (
            <g key={i} className={cls}>
              <path d={`M${p.x - 10.5} ${p.y} q3.5 -7 7 0 t7 0 t7 0`} fill="none" stroke={INK} strokeWidth={6} />
              <path d={`M${p.x - 10.5} ${p.y} q3.5 -7 7 0 t7 0 t7 0`} fill="none" stroke={p.c} strokeWidth={2.5} />
            </g>
          );
        })}
      </g>
    </Svg>
  );
}

export function Blob({ size = 64, className, color = '#5B5BF7', ...rest }: ArtProps & { color?: string }) {
  return (
    <Svg size={size} className={className} rest={rest}>
      <path
        d="M52 6 C72 4 92 18 94 40 C96 60 86 80 66 90 C46 100 22 94 12 76 C2 58 6 36 18 22 C26 12 38 7 52 6 Z"
        fill={color}
      />
    </Svg>
  );
}

export function Heart({ size = 64, className, ...rest }: ArtProps) {
  const uid = useId().replace(/:/g, '');
  const clip = `heart-${uid}`;
  const d = 'M50 88 C34 76 10 60 10 36 C10 22 21 12 33 12 C41 12 47 17 50 23 C53 17 59 12 67 12 C79 12 90 22 90 36 C90 60 66 76 50 88 Z';
  return (
    <Svg size={size} className={className} rest={rest}>
      <defs>
        <clipPath id={clip}>
          <path d={d} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect width={100} height={100} fill="#E84B5A" />
        <path d="M48 82 C32 70 7 56 7 33 C7 20 18 10 30 10 C40 10 46 16 49 22 C52 16 58 10 66 10 C78 10 86 20 86 33 C86 56 62 72 48 82 Z" fill="#FF6B6B" />
      </g>
      <path d={d} fill="none" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
      <ellipse cx={29} cy={30} rx={8} ry={5} transform="rotate(-40 29 30)" fill="#fff" opacity={0.5} />
      <circle cx={24} cy={41} r={2.4} fill="#fff" opacity={0.5} />
    </Svg>
  );
}

export function Flame({ size = 64, className, ...rest }: ArtProps) {
  return (
    <Svg size={size} className={className} rest={rest}>
      <g className="kk-flicker">
      <path
        d="M50 94 C28 94 16 78 18 60 C20 44 32 36 34 20 C44 28 46 38 46 44 C52 36 54 22 52 6 C70 18 84 38 84 60 C84 80 70 94 50 94 Z"
        fill="#FF9F43"
        stroke={INK}
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
      <path d="M78 64 C78 80 68 90 52 91 C68 84 74 74 74 58 C76 60 78 62 78 64 Z" fill="#F07A1A" />
      <g>
        <path
          d="M50 88 C38 88 31 80 32 70 C33 61 40 56 42 48 C48 52 50 58 50 62 C54 58 57 52 57 46 C65 54 69 62 69 72 C69 82 61 88 50 88 Z"
          fill="#FFC83D"
        />
        <path d="M50 84 C44 84 40 80 41 74 C42 70 45 67 47 63 C52 68 54 70 55 66 C58 70 60 73 59 77 C58 82 55 84 50 84 Z" fill="#FFE68A" />
      </g>
      <ellipse cx={30} cy={58} rx={4} ry={7} transform="rotate(20 30 58)" fill="#fff" opacity={0.4} />
      </g>
    </Svg>
  );
}

function Flower({ x, y, petal }: { x: number; y: number; petal: string }) {
  return (
    <g>
      <path d={`M${x} ${y} v12`} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      <g fill={petal} stroke={INK} strokeWidth={1.8}>
        <circle cx={x} cy={y - 5} r={3.6} />
        <circle cx={x + 5} cy={y - 1} r={3.6} />
        <circle cx={x + 3} cy={y + 5} r={3.6} />
        <circle cx={x - 3} cy={y + 5} r={3.6} />
        <circle cx={x - 5} cy={y - 1} r={3.6} />
      </g>
      <circle cx={x} cy={y + 1} r={2.8} fill="#FFC83D" stroke={INK} strokeWidth={1.8} />
    </g>
  );
}

function Tree({ x, base, s = 1 }: { x: number; base: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${base}) scale(${s})`}>
      <rect x={-3.5} y={-22} width={7} height={24} rx={2} fill="#B5713C" stroke={INK} strokeWidth={2.5} />
      <circle cx={0} cy={-34} r={16} fill="#1DB98A" stroke={INK} strokeWidth={3} />
      <circle cx={-5} cy={-39} r={5} fill="#fff" opacity={0.35} />
      <circle cx={6} cy={-30} r={2.5} fill="#FF6B6B" />
      <circle cx={-6} cy={-26} r={2.5} fill="#FF6B6B" />
    </g>
  );
}

/** Wide landscape strip for page bottoms (viewBox 400x120). Default width 100%. */
/** Every hill line ends flat at both edges, so mirrored copies in HillsBand join without a kink. */
export function Hills({ size = '100%', className, ...rest }: ArtProps) {
  return (
    <svg viewBox="0 0 400 120" width={size} className={className} aria-hidden="true" {...rest}>
      {/* back hill */}
      <path
        d="M-4 124 V50 C24 50 90 36 130 54 C170 72 220 50 262 44 C320 36 372 46 404 46 V124 Z"
        fill="#9BEBCF"
        stroke={INK}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <Tree x={112} base={60} s={0.85} />
      <Tree x={268} base={52} s={0.7} />
      {/* front hill */}
      <path
        d="M-4 124 V68 C30 68 100 60 150 74 C200 88 250 92 300 74 C340 60 380 68 404 68 V124 Z"
        fill="#2ED3A0"
        stroke={INK}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <path d="M-4 124 V102 C50 102 160 112 240 108 C320 104 380 100 404 100 V124 Z" fill="#22B98B" />
      <path d="M40 70 C70 63 100 63 128 70" fill="none" stroke="#fff" strokeOpacity={0.45} strokeWidth={4} strokeLinecap="round" />
      <path d="M312 68 C330 62 350 61 370 63" fill="none" stroke="#fff" strokeOpacity={0.45} strokeWidth={4} strokeLinecap="round" />
      <Tree x={340} base={70} />
      {/* grass tufts */}
      <g fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round">
        <path d="M80 92 l2 -6 M84 92 l0 -8 M88 92 l-2 -6" />
        <path d="M226 100 l2 -6 M230 100 l0 -8 M234 100 l-2 -6" />
        <path d="M300 92 l2 -6 M304 92 l0 -8 M308 92 l-2 -6" />
      </g>
      <Flower x={40} y={84} petal="#FF8FC7" />
      <Flower x={170} y={92} petal="#fff" />
      <Flower x={196} y={98} petal="#FF6B6B" />
      <Flower x={378} y={86} petal="#9B5DE5" />
    </svg>
  );
}

export function Sun({ size = 64, className, ...rest }: ArtProps) {
  return (
    <Svg size={size} className={className} rest={rest}>
      <g className="kk-spin-slow">
        {Array.from({ length: 10 }, (_, i) => (
          <path
            key={i}
            d="M50 4 L55 16 L45 16 Z"
            transform={`rotate(${i * 36} 50 50)`}
            fill={i % 2 ? '#FF9F43' : '#FFC83D'}
            stroke={INK}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
        ))}
      </g>
      <circle cx={50} cy={50} r={30} fill="#FFC83D" stroke={INK} strokeWidth={3} />
      <path d="M77 58 A30 30 0 0 1 30 72 A30 26 0 0 0 77 58 Z" fill="#F59E0B" opacity={0.6} />
      <ellipse cx={38} cy={34} rx={8} ry={4.5} transform="rotate(-35 38 34)" fill="#fff" opacity={0.45} />
      <g className="kk-blink">
        <ellipse cx={40} cy={48} rx={3.4} ry={4.4} fill={INK} />
        <ellipse cx={60} cy={48} rx={3.4} ry={4.4} fill={INK} />
        <circle cx={39} cy={46.3} r={1.3} fill="#fff" />
        <circle cx={59} cy={46.3} r={1.3} fill="#fff" />
      </g>
      <ellipse cx={33} cy={57} rx={4.5} ry={3} fill="#FF8FC7" opacity={0.6} />
      <ellipse cx={67} cy={57} rx={4.5} ry={3} fill="#FF8FC7" opacity={0.6} />
      <path d="M43 59 Q50 66 57 59" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
    </Svg>
  );
}

/**
 * A full-width strip of hills that never stretches: copies of Hills at their true
 * shape, side by side, every other one mirrored so the edges meet seamlessly.
 * Wide screens just show more hills instead of squashing the trees and flowers.
 */
export function HillsBand({ height = 144, className }: { height?: number; className?: string }) {
  const width = (height / 120) * 400;
  // The copies are absolutely placed, so the band takes its container's width and
  // never widens its parent (a row of nine copies would otherwise push layouts out).
  return (
    // The caller owns positioning (e.g. absolute bottom-0), so the band's own anchor
    // lives on an inner wrapper instead of competing with the caller's classes.
    <div className={`w-full overflow-hidden ${className ?? ''}`} style={{ height }} aria-hidden="true">
      <div className="relative h-full">
        <div className="absolute left-1/2 top-0 flex -translate-x-1/2">
          {Array.from({ length: 9 }, (_, i) => (
            <Hills key={i} size={width} style={{ height, flexShrink: 0, transform: i % 2 ? 'scaleX(-1)' : undefined }} />
          ))}
        </div>
      </div>
    </div>
  );
}
