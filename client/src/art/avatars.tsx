import { useId, type ReactElement, type ReactNode } from 'react';
import type { AvatarId } from '@kk/shared';
import type { ArtProps } from './types';

const INK = '#1F2547';
const CHEEK = '#FF8FC7';

/** Background color behind each avatar, handy for theming a kid's UI. */
export const AVATAR_COLORS: Record<AvatarId, string> = {
  fox: '#5B5BF7',
  panda: '#FF8FC7',
  frog: '#FF6B6B',
  cat: '#FF9F43',
  bunny: '#9B5DE5',
  bear: '#2ED3A0',
  owl: '#4CC9F0',
  unicorn: '#B9A6FF',
  dino: '#FFC83D',
  octopus: '#14B8A6',
};

/**
 * A sticker-style body part: main fill with a bottom-right shade crescent,
 * optional soft highlight, and the ink outline on top.
 */
function Part({ d, fill, shade, hl, sw = 3 }: { d: string; fill: string; shade: string; hl?: [number, number, number, number, number]; sw?: number }) {
  const id = `kk-part-${useId().replace(/:/g, '')}`;
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
        {hl && <ellipse cx={hl[0]} cy={hl[1]} rx={hl[2]} ry={hl[3]} transform={`rotate(${hl[4]} ${hl[0]} ${hl[1]})`} fill="#fff" opacity={0.35} />}
      </g>
      <path d={d} fill="none" stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
    </g>
  );
}

const circ = (cx: number, cy: number, r: number) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0 Z`;
const ell = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${rx * 2} 0 a${rx} ${ry} 0 1 0 ${-rx * 2} 0 Z`;

function Eyes({ y, lx = 39, rx = 61, w = 3.8, h = 4.8 }: { y: number; lx?: number; rx?: number; w?: number; h?: number }) {
  return (
    <g className="kk-blink">
      {[lx, rx].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={y} rx={w} ry={h} fill={INK} />
          <circle cx={x - w * 0.32} cy={y - h * 0.38} r={w * 0.42} fill="#fff" />
        </g>
      ))}
    </g>
  );
}

function Cheeks({ y, l = 30, r = 70 }: { y: number; l?: number; r?: number }) {
  return (
    <g fill={CHEEK} opacity={0.6}>
      <ellipse cx={l} cy={y} rx={5} ry={3.2} />
      <ellipse cx={r} cy={y} rx={5} ry={3.2} />
    </g>
  );
}

const Mirror = ({ children }: { children: ReactNode }) => (
  <>
    {children}
    <g transform="translate(100 0) scale(-1 1)">{children}</g>
  </>
);

const line = { fill: 'none', stroke: INK, strokeWidth: 2.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

function Fox() {
  return (
    <g>
      <Mirror>
        <path d="M26 48 L20 14 L46 32 Z" fill="#FF9F43" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        <path d="M27 38 L24 22 L37 31 Z" fill="#FFF8EC" />
      </Mirror>
      <Part d="M50 86 C30 86 16 72 16 56 C16 40 32 30 50 30 C68 30 84 40 84 56 C84 72 70 86 50 86 Z" fill="#FF9F43" shade="#F07A1A" hl={[34, 40, 9, 5, -25]} />
      <path d="M50 85 C38 85 25 77 22 64 C32 62 44 64 50 71 C56 64 68 62 78 64 C75 77 62 85 50 85 Z" fill="#FFF8EC" stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
      <Eyes y={54} lx={38} rx={62} />
      <Cheeks y={64} l={27} r={73} />
      <ellipse cx={50} cy={70} rx={4} ry={3} fill={INK} />
      <path d="M45 75 Q47.5 78 50 75 Q52.5 78 55 75" {...line} />
    </g>
  );
}

function Panda() {
  return (
    <g>
      <circle cx={24} cy={30} r={11} fill={INK} />
      <circle cx={76} cy={30} r={11} fill={INK} />
      <Part d={circ(50, 57, 32)} fill="#FFFFFF" shade="#DCDFF0" hl={[34, 38, 9, 5, -30]} />
      <ellipse cx={37} cy={56} rx={8} ry={10} transform="rotate(30 37 56)" fill={INK} />
      <ellipse cx={63} cy={56} rx={8} ry={10} transform="rotate(-30 63 56)" fill={INK} />
      <g className="kk-blink">
        <circle cx={38} cy={55} r={3.6} fill="#fff" />
        <circle cx={62} cy={55} r={3.6} fill="#fff" />
        <circle cx={38.6} cy={55.8} r={2} fill={INK} />
        <circle cx={61.4} cy={55.8} r={2} fill={INK} />
      </g>
      <Cheeks y={70} l={28} r={72} />
      <ellipse cx={50} cy={67} rx={4.5} ry={3} fill={INK} />
      <path d="M50 70 v3 M45 74 Q47.5 77 50 73 Q52.5 77 55 74" {...line} />
    </g>
  );
}

function Frog() {
  return (
    <g>
      <Part d={circ(32, 38, 13)} fill="#2ED3A0" shade="#1DB98A" />
      <Part d={circ(68, 38, 13)} fill="#2ED3A0" shade="#1DB98A" />
      <Part d={ell(50, 64, 37, 25)} fill="#2ED3A0" shade="#1DB98A" hl={[28, 52, 8, 4, -20]} />
      <circle cx={32} cy={38} r={8.5} fill="#fff" stroke={INK} strokeWidth={2} />
      <circle cx={68} cy={38} r={8.5} fill="#fff" stroke={INK} strokeWidth={2} />
      <Eyes y={39} lx={33} rx={67} w={4.6} h={5.4} />
      <Cheeks y={66} l={24} r={76} />
      <circle cx={46} cy={58} r={1.4} fill={INK} />
      <circle cx={54} cy={58} r={1.4} fill={INK} />
      <path d="M32 66 Q50 82 68 66" {...line} strokeWidth={3} />
      <path d="M45 73 Q50 78 55 73.5" fill="#FF6B6B" />
    </g>
  );
}

function Cat() {
  return (
    <g>
      <Mirror>
        <path d="M22 50 L22 16 L46 32 Z" fill="#A9B4D6" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        <path d="M26 38 L26 24 L37 31 Z" fill="#FF8FC7" />
      </Mirror>
      <Part d={ell(50, 59, 33, 28)} fill="#A9B4D6" shade="#8994BD" hl={[33, 42, 9, 5, -25]} />
      <path d="M44 33 l1 7 M50 32 v8 M56 33 l-1 7" stroke="#7883AE" strokeWidth={3} strokeLinecap="round" />
      <Eyes y={57} />
      <Cheeks y={67} />
      <path d="M46.5 64 h7 l-3.5 4 Z" fill="#FF8FC7" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <path d="M45 71 Q47.5 74 50 70 Q52.5 74 55 71" {...line} />
      <g {...line} strokeWidth={2}>
        <path d="M30 68 L16 66 M30 72 L17 75" />
        <path d="M70 68 L84 66 M70 72 L83 75" />
      </g>
    </g>
  );
}

function Bunny() {
  return (
    <g>
      <Mirror>
        <g transform="rotate(-12 38 26)">
          <Part d={ell(38, 26, 8.5, 21)} fill="#FFFFFF" shade="#E2E0F2" />
          <ellipse cx={38} cy={27} rx={4} ry={14} fill="#FF8FC7" />
        </g>
      </Mirror>
      <Part d={circ(50, 63, 28)} fill="#FFFFFF" shade="#E2E0F2" hl={[36, 48, 8, 4.5, -30]} />
      <Eyes y={60} lx={40} rx={60} />
      <Cheeks y={70} l={31} r={69} />
      <ellipse cx={50} cy={67} rx={3.5} ry={2.6} fill="#FF6B6B" />
      <path d="M45 72 Q47.5 75 50 71 Q52.5 75 55 72" {...line} />
      <rect x={47.5} y={73.5} width={5} height={5} rx={1.2} fill="#fff" stroke={INK} strokeWidth={1.8} />
    </g>
  );
}

function Bear() {
  return (
    <g>
      {[[24, 32], [76, 32]].map(([x, y]) => (
        <g key={x}>
          <Part d={circ(x, y, 12)} fill="#C68645" shade="#A86B32" />
          <circle cx={x} cy={y + 1} r={6} fill="#F2C894" />
        </g>
      ))}
      <Part d={circ(50, 58, 32)} fill="#C68645" shade="#A86B32" hl={[34, 40, 9, 5, -30]} />
      <ellipse cx={50} cy={69} rx={14} ry={11} fill="#F2C894" stroke={INK} strokeWidth={2.6} />
      <Eyes y={54} lx={38} rx={62} />
      <Cheeks y={64} l={27} r={73} />
      <ellipse cx={50} cy={65} rx={5} ry={3.5} fill={INK} />
      <circle cx={48.5} cy={64} r={1.2} fill="#fff" />
      <path d="M50 68.5 v3 M45.5 72.5 Q47.8 75.5 50 71.5 Q52.2 75.5 54.5 72.5" {...line} />
    </g>
  );
}

function Owl() {
  return (
    <g>
      <Part
        d="M20 44 L20 16 L37 29 C45 26 55 26 63 29 L80 16 L80 44 C84 66 72 88 50 88 C28 88 16 66 20 44 Z"
        fill="#9B5DE5"
        shade="#7E3FCF"
        hl={[32, 38, 7, 4, -30]}
      />
      <path d="M38 76 q4 4 8 0 M54 76 q4 4 8 0 M46 83 q4 4 8 0" fill="none" stroke="#E4D2FF" strokeWidth={2.4} strokeLinecap="round" />
      <circle cx={38} cy={50} r={12} fill="#fff" stroke={INK} strokeWidth={2.6} />
      <circle cx={62} cy={50} r={12} fill="#fff" stroke={INK} strokeWidth={2.6} />
      <Eyes y={51} lx={39} rx={61} w={5.4} h={6} />
      <Cheeks y={66} l={27} r={73} />
      <path d="M45 61 L55 61 L50 69 Z" fill="#FFC83D" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
    </g>
  );
}

function Unicorn() {
  return (
    <g>
      {/* mane */}
      <g stroke={INK} strokeWidth={2.6}>
        <circle cx={74} cy={44} r={9} fill="#4CC9F0" />
        <circle cx={78} cy={58} r={8} fill="#2ED3A0" />
        <circle cx={76} cy={71} r={7} fill="#FFC83D" />
        <circle cx={66} cy={33} r={9} fill="#FF6B6B" />
      </g>
      <Mirror>
        <path d="M30 42 L26 22 L42 34 Z" fill="#fff" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        <path d="M31 36 L29 27 L37 33 Z" fill="#FF8FC7" />
      </Mirror>
      <Part d={ell(50, 60, 27, 28)} fill="#FFFFFF" shade="#E2E0F2" hl={[37, 44, 7, 4, -30]} />
      {/* horn */}
      <path d="M50 8 L57 34 L43 34 Z" fill="#FFC83D" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <path d="M45.5 26 L54 22 M44.5 31 L55.5 27" stroke="#F59E0B" strokeWidth={2} strokeLinecap="round" />
      {/* forelock */}
      <path d="M40 38 C42 30 54 30 58 36 C54 34 50 36 50 40 C47 36 43 36 40 38 Z" fill="#FF8FC7" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <Eyes y={56} lx={40} rx={60} />
      <Cheeks y={66} l={31} r={69} />
      <ellipse cx={50} cy={75} rx={14} ry={9} fill="#FFD6EA" stroke={INK} strokeWidth={2.6} />
      <ellipse cx={45} cy={74} rx={1.6} ry={2.2} fill={INK} />
      <ellipse cx={55} cy={74} rx={1.6} ry={2.2} fill={INK} />
      <path d="M46 79 Q50 82 54 79" {...line} strokeWidth={2.2} />
    </g>
  );
}

function Dino() {
  return (
    <g>
      {[[30, 36, -25], [50, 28, 0], [70, 36, 25]].map(([x, y, r]) => (
        <path key={x} d={`M${x - 8} ${y + 8} L${x} ${y - 8} L${x + 8} ${y + 8} Z`} transform={`rotate(${r} ${x} ${y})`} fill="#FF9F43" stroke={INK} strokeWidth={2.8} strokeLinejoin="round" />
      ))}
      <Part d={ell(50, 62, 33, 27)} fill="#2ED3A0" shade="#1DB98A" hl={[32, 46, 8, 4.5, -25]} />
      <circle cx={28} cy={52} r={3} fill="#1DB98A" />
      <circle cx={73} cy={48} r={2.4} fill="#1DB98A" />
      <circle cx={70} cy={56} r={1.6} fill="#1DB98A" />
      <Eyes y={55} lx={38} rx={62} />
      <Cheeks y={66} l={27} r={73} />
      <circle cx={46} cy={64} r={1.3} fill={INK} />
      <circle cx={54} cy={64} r={1.3} fill={INK} />
      <path d="M36 70 Q50 82 64 70 Z" fill={INK} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <path d="M42 72 L44.5 76 L47 72.6 Z" fill="#fff" />
      <path d="M53 72.6 L55.5 76 L58 72 Z" fill="#fff" />
    </g>
  );
}

function Octopus() {
  const t = ['M30 70 C24 78 30 88 22 92', 'M42 72 C40 82 46 88 40 96', 'M58 72 C60 82 54 88 60 96', 'M70 70 C76 78 70 88 78 92'];
  return (
    <g>
      <g fill="none" strokeLinecap="round">
        {t.map((d) => (
          <path key={d} d={d} stroke={INK} strokeWidth={10} />
        ))}
        {t.map((d) => (
          <path key={`${d}i`} d={d} stroke="#FF8FC7" strokeWidth={5} />
        ))}
      </g>
      <Part d="M18 60 C16 34 32 18 50 18 C68 18 84 34 82 60 C80 74 66 76 50 76 C34 76 20 74 18 60 Z" fill="#FF8FC7" shade="#EE68AC" hl={[34, 32, 9, 5, -35]} />
      <circle cx={64} cy={30} r={3.5} fill="#FFC2E1" />
      <circle cx={72} cy={40} r={2.2} fill="#FFC2E1" />
      <Eyes y={52} lx={39} rx={61} w={4.4} h={5.4} />
      <Cheeks y={62} l={28} r={72} />
      <path d="M44 63 Q50 69 56 63" {...line} strokeWidth={3} />
    </g>
  );
}

const HEADS: Record<AvatarId, () => ReactElement> = {
  fox: Fox,
  panda: Panda,
  frog: Frog,
  cat: Cat,
  bunny: Bunny,
  bear: Bear,
  owl: Owl,
  unicorn: Unicorn,
  dino: Dino,
  octopus: Octopus,
};

export function Avatar({ id, size = 64, className, ring = false, ...rest }: ArtProps & { id: AvatarId; ring?: boolean }) {
  const clip = `kk-avatar-${useId().replace(/:/g, '')}`;
  const Head = HEADS[id] ?? Fox;
  const bg = AVATAR_COLORS[id] ?? '#5B5BF7';
  const r = ring ? 41 : 50;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true" {...rest}>
      <defs>
        <clipPath id={clip}>
          <circle cx={50} cy={50} r={r} />
        </clipPath>
      </defs>
      {ring && <circle cx={50} cy={50} r={47.5} fill="#fff" stroke={INK} strokeWidth={3} />}
      <circle cx={50} cy={50} r={r} fill={bg} />
      <g clipPath={`url(#${clip})`}>
        <circle cx={50} cy={50} r={r * 0.92} fill="#fff" opacity={0.12} />
        <g transform={ring ? 'translate(50 52) scale(0.84) translate(-50 -50)' : 'translate(50 52) scale(0.98) translate(-50 -50)'}>
          <Head />
        </g>
      </g>
      {ring && <circle cx={50} cy={50} r={r} fill="none" stroke={INK} strokeWidth={2.5} />}
    </svg>
  );
}
