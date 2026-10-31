import type { ReactNode } from 'react';
import type { ArtProps } from './types';
import { heartPath } from './sticker-kit';
import { Penny } from './mascot';
import { Coin, CoinJar, Trophy } from './money';
import { Blob, Cloud, Confetti, Sparkle, sparklePath, starPath } from './decor';

const INK = '#1F2547';

/** Scenes use a 200x160 canvas; `size` controls the width (height follows the aspect ratio). */
function Scene({ size, className, rest, children }: { size: number | string; className?: string; rest: Omit<ArtProps, 'size' | 'className'>; children: ReactNode }) {
  const height = typeof size === 'number' ? size * 0.8 : undefined;
  return (
    <svg viewBox="0 0 200 160" width={size} height={height} className={className} aria-hidden="true" {...rest}>
      {children}
    </svg>
  );
}

const Ground = ({ color = '#2ED3A0', y = 140 }: { color?: string; y?: number }) => (
  <ellipse cx={100} cy={y} rx={78} ry={10} fill={color} opacity={0.35} />
);


export function SceneAllDone({ size = 200, className, ...rest }: ArtProps) {
  return (
    <Scene size={size} className={className} rest={rest}>
      <Blob x={30} y={8} size={140} color="#FFE68A" opacity={0.6} />
      <Ground />
      <Confetti x={8} y={6} size={58} />
      <Confetti x={140} y={0} size={54} />
      <Trophy x={124} y={66} size={70} />
      <Penny x={30} y={36} size={106} mood="cheer" />
      <g className="kk-twinkle">
        <path d={sparklePath(178, 92, 7)} fill="#FFC83D" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      </g>
    </Scene>
  );
}

export function SceneEmptyShop({ size = 200, className, ...rest }: ArtProps) {
  return (
    <Scene size={size} className={className} rest={rest}>
      <Blob x={36} y={4} size={130} color="#B9A6FF" opacity={0.35} />
      <Ground color="#5B5BF7" y={146} />
      {/* awning */}
      <path d="M38 22 H162 L170 40 H30 Z" fill="#fff" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <path d="M58 22 L54 40 M82 22 L80 40 M106 22 L106 40 M130 22 L132 40 M150 22 L156 40" stroke="#FF6B6B" strokeWidth={9} />
      <path d="M38 22 H162 L170 40 H30 Z" fill="none" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <path d="M30 40 q8 10 17.5 0 q8 10 17.5 0 q8 10 17.5 0 q8 10 17.5 0 q8 10 17.5 0 q8 10 17.5 0 q8 10 17.5 0 q8 10 17.5 0" fill="#FF6B6B" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      {/* shelf unit */}
      <rect x={40} y={50} width={120} height={92} rx={6} fill="#FFF8EC" stroke={INK} strokeWidth={3} />
      <rect x={46} y={56} width={108} height={80} rx={3} fill="#F4E6CF" />
      {[84, 114].map((y) => (
        <g key={y}>
          <rect x={42} y={y} width={116} height={7} rx={2} fill="#C68645" stroke={INK} strokeWidth={2.6} />
          <path d={`M44 ${y + 2} H156`} stroke="#fff" strokeOpacity={0.35} strokeWidth={1.5} />
        </g>
      ))}
      <rect x={40} y={136} width={120} height={8} rx={3} fill="#C68645" stroke={INK} strokeWidth={3} />
      {/* lonely price tag swinging from the top shelf */}
      <g className="kk-wiggle">
        <path d="M100 91 L100 97" stroke={INK} strokeWidth={2} strokeLinecap="round" />
        <path d="M100 96 L114 103 V113 H86 V103 Z" fill="#FFC83D" stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
        <circle cx={100} cy={101.5} r={1.8} fill="#FFF8EC" stroke={INK} strokeWidth={1.4} />
        <g className="kk-blink">
          <circle cx={95} cy={107} r={1.5} fill={INK} />
          <circle cx={105} cy={107} r={1.5} fill={INK} />
        </g>
        <path d="M97.5 110.5 Q100 109 102.5 110.5" fill="none" stroke={INK} strokeWidth={1.5} strokeLinecap="round" />
      </g>
      {/* soft sparkles: "restocking soon!" */}
      <path className="kk-twinkle" d={sparklePath(62, 72, 4)} fill="#FFC83D" stroke={INK} strokeWidth={1.4} />
      <path className="kk-twinkle kk-delay-2" d={sparklePath(138, 128, 3.5)} fill="#4CC9F0" stroke={INK} strokeWidth={1.4} />
      <path className="kk-twinkle kk-delay-3" d={starPath(140, 70, 4, 2)} fill="#FF8FC7" stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
    </Scene>
  );
}

export function SceneEmptyJar({ size = 200, className, ...rest }: ArtProps) {
  return (
    <Scene size={size} className={className} rest={rest}>
      <Blob x={40} y={10} size={124} color="#4CC9F0" opacity={0.2} />
      <Ground color="#4CC9F0" y={144} />
      <CoinJar x={45} y={36} size={110} fill={0} />
      {/* a hopeful little face on the jar (jar is scaled 1.1 from 45,36) */}
      <g className="kk-blink">
        <ellipse cx={90} cy={110} rx={3} ry={3.8} fill={INK} />
        <ellipse cx={110} cy={110} rx={3} ry={3.8} fill={INK} />
        <circle cx={89} cy={108.6} r={1.2} fill="#fff" />
        <circle cx={109} cy={108.6} r={1.2} fill="#fff" />
      </g>
      <ellipse cx={83} cy={117} rx={4} ry={2.4} fill="#FF8FC7" opacity={0.6} />
      <ellipse cx={117} cy={117} rx={4} ry={2.4} fill="#FF8FC7" opacity={0.6} />
      <ellipse cx={100} cy={119} rx={2.6} ry={2.2} fill={INK} />
      <g className="kk-bob">
        <Sparkle x={112} y={66} size={28} />
      </g>
    </Scene>
  );
}

export function SceneWelcome({ size = 200, className, ...rest }: ArtProps) {
  return (
    <Scene size={size} className={className} rest={rest}>
      <Blob x={34} y={10} size={134} color="#FF8FC7" opacity={0.25} />
      <Cloud x={4} y={4} size={58} />
      <Cloud x={146} y={18} size={48} />
      <Ground />
      <g className="kk-bob">
        <Coin x={22} y={72} size={30} />
      </g>
      <g className="kk-bob kk-delay-2">
        <Coin x={150} y={70} size={34} />
      </g>
      <g className="kk-bob kk-delay-3">
        <Coin x={128} y={24} size={22} />
      </g>
      <Penny x={50} y={36} size={104} mood="cheer" />
      <path className="kk-twinkle kk-delay-1" d={sparklePath(40, 46, 5)} fill="#4CC9F0" stroke={INK} strokeWidth={1.6} />
      <path className="kk-twinkle kk-delay-2" d={sparklePath(170, 122, 5)} fill="#2ED3A0" stroke={INK} strokeWidth={1.6} />
    </Scene>
  );
}

export function SceneFamily({ size = 200, className, ...rest }: ArtProps) {
  return (
    <Scene size={size} className={className} rest={rest}>
      <Blob x={40} y={6} size={124} color="#FFE68A" opacity={0.5} />
      <Cloud x={6} y={14} size={44} />
      <Cloud x={156} y={40} size={36} />
      {/* heart smoke */}
      <path className="kk-bob" d={heartPath(132, 36, 5)} fill="#FF8FC7" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <path className="kk-bob kk-delay-2" d={heartPath(140, 22, 7)} fill="#FF6B6B" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
      <path className="kk-bob kk-delay-3" d={heartPath(131, 6, 4)} fill="#FF8FC7" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" opacity={0.8} />
      {/* ground: a rounded mound inside the frame, not a strip cut off at the edges */}
      <ellipse cx={100} cy={152} rx={84} ry={5} fill={INK} opacity={0.1} />
      <path d="M22 146 C34 130 70 126 100 129 C130 126 166 130 178 146 C180 151 177 154 171 154 H29 C23 154 20 151 22 146 Z" fill="#2ED3A0" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <path d="M40 137 C60 131 80 130 96 131" stroke="#fff" strokeOpacity={0.4} strokeWidth={3} strokeLinecap="round" fill="none" />
      {/* chimney */}
      <rect x={122} y={44} width={16} height={26} rx={2} fill="#FF6B6B" stroke={INK} strokeWidth={3} />
      <rect x={119} y={40} width={22} height={8} rx={2.5} fill="#E84B5A" stroke={INK} strokeWidth={3} />
      {/* house body */}
      <rect x={60} y={78} width={82} height={58} rx={5} fill="#FFF8EC" stroke={INK} strokeWidth={3} />
      <path d="M61 126 H141 V131 C141 134 139 136 136 136 H66 C63 136 61 134 61 131 Z" fill="#F4E6CF" />
      {/* roof */}
      <path d="M50 84 L101 42 L152 84 Z" fill="#5B5BF7" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M62 78 L101 47" stroke="#fff" strokeOpacity={0.35} strokeWidth={4} strokeLinecap="round" />
      {/* round attic window with heart */}
      <circle cx={101} cy={66} r={8} fill="#FFE68A" stroke={INK} strokeWidth={2.6} />
      <path d={heartPath(101, 66, 3.6)} fill="#FF6B6B" />
      {/* door */}
      <path d="M90 136 V112 C90 104 112 104 112 112 V136 Z" fill="#FF9F43" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <circle cx={107} cy={122} r={1.8} fill={INK} />
      {/* windows */}
      {[[68, 94], [118, 94]].map(([x, y]) => (
        <g key={x}>
          <rect x={x} y={y} width={16} height={16} rx={3} fill="#FFC83D" stroke={INK} strokeWidth={2.6} />
          <path d={`M${x + 8} ${y + 1} V${y + 15} M${x + 1} ${y + 8} H${x + 15}`} stroke={INK} strokeWidth={2} />
          <rect x={x + 2.5} y={y + 2.5} width={4} height={3} rx={1} fill="#fff" opacity={0.6} />
        </g>
      ))}
      {/* bushes + flowers */}
      <circle cx={56} cy={134} r={9} fill="#1DB98A" stroke={INK} strokeWidth={2.6} />
      <circle cx={148} cy={134} r={10} fill="#1DB98A" stroke={INK} strokeWidth={2.6} />
      <circle cx={54} cy={131} r={2.2} fill="#FF8FC7" />
      <circle cx={151} cy={130} r={2.2} fill="#FFC83D" />
      <circle cx={144} cy={137} r={2.2} fill="#fff" />
    </Scene>
  );
}
