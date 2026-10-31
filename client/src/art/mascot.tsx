import { useId } from 'react';
import type { ArtProps } from './types';
import { sparklePath } from './decor';

export type PennyMood = 'happy' | 'cheer' | 'wow' | 'sleepy' | 'think' | 'sad';

const INK = '#1F2547';
const PINK = '#FF8FC7';
const PINK_SHADE = '#EE68AC';
const PINK_LIGHT = '#FFC2E1';

/** A friendly face-forward eye: dark oval + white glint. */
function Eye({ cx, cy, rx = 4.2, ry = 5.4, look = 0 }: { cx: number; cy: number; rx?: number; ry?: number; look?: number }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy + look} rx={rx} ry={ry} fill={INK} />
      <circle cx={cx - rx * 0.32} cy={cy + look - ry * 0.38} r={rx * 0.42} fill="#fff" />
      <circle cx={cx + rx * 0.35} cy={cy + look + ry * 0.35} r={rx * 0.16} fill="#fff" />
    </g>
  );
}

function Arm({ x, y, rot }: { x: number; y: number; rot: number }) {
  return (
    <ellipse
      cx={x}
      cy={y}
      rx={6}
      ry={8.5}
      transform={`rotate(${rot} ${x} ${y})`}
      fill={PINK}
      stroke={INK}
      strokeWidth={3}
    />
  );
}

/**
 * Penny, the Kid Kapital mascot: a round, face-forward piggy bank.
 */
export function Penny({ size = 64, className, mood = 'happy', ...rest }: ArtProps & { mood?: PennyMood }) {
  const uid = useId().replace(/:/g, '');
  const clip = `penny-body-${uid}`;

  const arms: Record<PennyMood, [number, number, number][]> = {
    happy: [[17, 64, 25], [83, 64, -25]],
    cheer: [[13, 36, -35], [87, 36, 35]],
    wow: [[11, 52, -65], [89, 52, 65]],
    sleepy: [[19, 68, 15], [81, 68, -15]],
    think: [[17, 64, 25], [72, 77, -50]],
    sad: [[20, 70, 8], [80, 70, -8]],
  };

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      {...rest}
    >
      <defs>
        <clipPath id={clip}>
          <circle cx={50} cy={52} r={34} />
        </clipPath>
      </defs>

      {/* curly tail (peeks out on the right) */}
      <path d="M82 66 c7 -1 10 5 6 8 c-4 3 -8 -2 -4 -4 c4 -2 9 1 9 6" fill="none" stroke={INK} strokeWidth={6.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M82 66 c7 -1 10 5 6 8 c-4 3 -8 -2 -4 -4 c4 -2 9 1 9 6" fill="none" stroke={PINK} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {/* ears */}
      {[false, true].map((flip) => (
        <g key={String(flip)} transform={flip ? 'translate(100 0) scale(-1 1)' : undefined}>
          <path
            d={mood === 'sad' ? 'M22 34 C14 30 10 24 12 18 C20 18 30 22 36 26 Z' : 'M22 32 C18 22 18 15 21 10 C28 11 35 16 40 22 Z'}
            fill={PINK}
            stroke={INK}
            strokeWidth={3}
            strokeLinejoin="round"
          />
          <path
            d={mood === 'sad' ? 'M23 29 C18 27 16 24 16 21 C21 21 26 23 30 26 Z' : 'M24 27 C22 21 22 17 24 15 C28 16 32 19 34 22 Z'}
            fill={PINK_SHADE}
          />
        </g>
      ))}

      {/* tiny legs */}
      {[33, 55].map((x) => (
        <g key={x}>
          <rect x={x} y={76} width={12} height={16} rx={5} fill={PINK} stroke={INK} strokeWidth={3} />
          <path d={`M${x + 1.5} 88 h9`} stroke={INK} strokeWidth={2} strokeLinecap="round" />
        </g>
      ))}

      {/* body */}
      <g clipPath={`url(#${clip})`}>
        <rect x={10} y={14} width={80} height={80} fill={PINK_SHADE} />
        <circle cx={47} cy={47} r={34} fill={PINK} />
        <ellipse cx={34} cy={30} rx={11} ry={6} transform="rotate(-35 34 30)" fill="#fff" opacity={0.35} />
      </g>
      <circle cx={50} cy={52} r={34} fill="none" stroke={INK} strokeWidth={3} />

      {/* coin slot (+ a coin popping out when excited) */}
      {(mood === 'cheer' || mood === 'wow') && (
        <g className="kk-bob">
          <rect x={42} y={4} width={16} height={18} rx={8} fill="#FFC83D" stroke={INK} strokeWidth={2.5} />
          <path d="M50 8 v10" stroke="#F59E0B" strokeWidth={2.5} strokeLinecap="round" />
        </g>
      )}
      <rect x={42} y={19.5} width={16} height={5} rx={2.5} fill={INK} />

      {/* arms */}
      {arms[mood].map(([x, y, r]) => (
        <Arm key={`${x}-${y}`} x={x} y={y} rot={r} />
      ))}

      {/* cheeks */}
      <ellipse cx={28} cy={60} rx={6} ry={4} fill={PINK_SHADE} opacity={0.6} />
      <ellipse cx={72} cy={60} rx={6} ry={4} fill={PINK_SHADE} opacity={0.6} />

      {/* eyes */}
      {mood === 'sleepy' ? (
        <g>
          <path d="M33 47 Q38 52 43 47" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
          <path d="M57 47 Q62 52 67 47" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
        </g>
      ) : (
        <g className="kk-blink">
          {mood === 'wow' ? (
            <>
              <Eye cx={38} cy={45} rx={5.4} ry={6.6} />
              <Eye cx={62} cy={45} rx={5.4} ry={6.6} />
            </>
          ) : (
            <>
              <Eye cx={38} cy={46} look={mood === 'think' ? -3 : 0} />
              <Eye cx={62} cy={46} look={mood === 'think' ? -3 : 0} />
            </>
          )}
        </g>
      )}
      {mood === 'wow' && (
        <g fill="#FFE68A" stroke={INK} strokeWidth={1}>
          <path d={sparklePath(36, 42, 3.2)} />
          <path d={sparklePath(60, 42, 3.2)} />
        </g>
      )}

      {/* brows */}
      {mood === 'sad' && (
        <g fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round">
          <path d="M31 39 Q36 36 42 35" />
          <path d="M69 39 Q64 36 58 35" />
        </g>
      )}
      {mood === 'wow' && (
        <g fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round">
          <path d="M32 33 Q37 30 42 32" />
          <path d="M58 32 Q63 30 68 33" />
        </g>
      )}
      {mood === 'think' && (
        <path d="M57 35 Q62 32 67 35" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      )}

      {/* snout */}
      <ellipse cx={50} cy={60} rx={12.5} ry={8.5} fill={PINK_LIGHT} stroke={INK} strokeWidth={3} />
      <ellipse cx={45.5} cy={60} rx={2} ry={3} fill={PINK_SHADE} />
      <ellipse cx={54.5} cy={60} rx={2} ry={3} fill={PINK_SHADE} />

      {/* mouth */}
      {mood === 'happy' && (
        <path d="M44 73 Q50 78.5 56 73" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      )}
      {mood === 'cheer' && (
        <g>
          <path d="M42.5 71.5 Q50 83 57.5 71.5 Z" fill={INK} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          <ellipse cx={50} cy={76.5} rx={3.6} ry={2} fill="#FF6B6B" />
        </g>
      )}
      {mood === 'wow' && (
        <g>
          <ellipse cx={50} cy={75} rx={4.2} ry={5} fill={INK} />
          <ellipse cx={50} cy={77.5} rx={2.4} ry={1.6} fill="#FF6B6B" />
        </g>
      )}
      {mood === 'sleepy' && <ellipse cx={50} cy={74} rx={2.4} ry={2} fill={INK} />}
      {mood === 'think' && (
        <path d="M45 74 Q49 72 55 73.5" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      )}
      {mood === 'sad' && (
        <path d="M44 76 Q50 71 56 76" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      )}

      {/* extras */}
      {mood === 'sad' && (
        <path d="M30 52 Q27 57 30 59 Q33 57 30 52 Z" fill="#4CC9F0" stroke={INK} strokeWidth={1.5} strokeLinejoin="round" />
      )}
      {mood === 'cheer' && (
        <g fill="#FFC83D" stroke={INK} strokeWidth={1.5} strokeLinejoin="round">
          <path className="kk-twinkle" d={sparklePath(8, 16, 6)} />
          <path className="kk-twinkle kk-delay-2" d={sparklePath(92, 14, 6)} />
          <path className="kk-twinkle kk-delay-1" d={sparklePath(28, 6, 3.5)} fill="#4CC9F0" />
          <path className="kk-twinkle kk-delay-3" d={sparklePath(74, 5, 3.5)} fill="#2ED3A0" />
        </g>
      )}
      {mood === 'sleepy' && (
        <g className="kk-bob" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M76 14 h7 l-7 8 h7" />
          <path d="M87 4 h5 l-5 5.5 h5" strokeWidth={2} />
        </g>
      )}
      {mood === 'think' && (
        <g className="kk-bob" fill="#fff" stroke={INK} strokeWidth={2}>
          <circle cx={80} cy={24} r={2} />
          <circle cx={86} cy={15} r={3} />
          <circle cx={93} cy={6} r={4} />
        </g>
      )}
    </svg>
  );
}
