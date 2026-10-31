// Every sound is synthesized with WebAudio, adapted from Refill's audio engine:
// no audio files. The context starts on the first tap (browsers require it).
import { prefs } from './prefs';

let ctx: AudioContext | null = null;
let bus: GainNode | null = null;
let verb: ConvolverNode | null = null;

const init = () => {
  if (ctx) {
    if (ctx.state === 'suspended') void ctx.resume();
    return;
  }
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  const master = ctx.createGain();
  master.gain.value = 0.6;
  master.connect(ctx.destination);
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14;
  comp.ratio.value = 4;
  comp.connect(master);
  bus = ctx.createGain();
  bus.connect(comp);
  // A short generated-noise reverb for sparkle.
  verb = ctx.createConvolver();
  const len = ctx.sampleRate * 1.6;
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.4);
  }
  verb.buffer = buf;
  const wet = ctx.createGain();
  wet.gain.value = 0.22;
  verb.connect(wet);
  wet.connect(comp);
};

const tone = (type: OscillatorType, f0: number, f1: number, dur: number, peak: number, when = 0, wet = false) => {
  if (!ctx || !bus || !verb) return;
  const t = ctx.currentTime + when;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.006 + dur);
  o.connect(g);
  g.connect(bus);
  if (wet) g.connect(verb);
  o.start(t);
  o.stop(t + dur + 0.05);
};

const arpeggio = (notes: number[], step: number, dur: number, peak: number) =>
  notes.forEach((f, i) => tone('triangle', f, 0, dur, peak, i * step, true));

const SOUNDS = {
  tap: () => tone('sine', 900, 500, 0.05, 0.14),
  pop: () => tone('sine', 420, 880, 0.08, 0.22, 0, true),
  coin: () => {
    tone('triangle', 1318, 0, 0.09, 0.18);
    tone('triangle', 1975, 0, 0.22, 0.18, 0.07, true);
  },
  coins: () => [0, 0.08, 0.16, 0.24].forEach((w, i) => tone('triangle', 1318 + i * 120, 0, 0.14, 0.14, w, true)),
  buy: () => {
    tone('sine', 300, 700, 0.09, 0.3);
    arpeggio([1318, 1760], 0.05, 0.16, 0.12);
  },
  done: () => arpeggio([659, 784, 1047], 0.06, 0.2, 0.16),
  levelUp: () => arpeggio([523, 659, 784, 1047, 1319, 1568], 0.08, 0.34, 0.18),
  chest: () => {
    tone('sawtooth', 110, 220, 0.4, 0.05);
    arpeggio([784, 988, 1175, 1568, 1976, 2349], 0.07, 0.4, 0.14);
  },
  nope: () => tone('square', 180, 120, 0.14, 0.06),
  whoosh: () => tone('sine', 200, 1200, 0.25, 0.1, 0, true),
};
export type SoundName = keyof typeof SOUNDS;

export const play = (name: SoundName) => {
  if (!prefs.soundOn()) return;
  init();
  SOUNDS[name]();
};

/** Unlock audio on the first user gesture anywhere. */
export const primeAudioOnFirstTap = () => {
  const unlock = () => {
    init();
    window.removeEventListener('pointerdown', unlock);
  };
  window.addEventListener('pointerdown', unlock);
};
