/**
 * Tiny synthesized UI sounds (Web Audio). No audio files, nothing copied.
 * Off by default; the AudioContext is only created after the person turns
 * sound on (a user gesture), so autoplay policies are never an issue.
 */

const KEY = "sbp-sound";
let ctx: AudioContext | null = null;
let enabled = false;

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

export function readStoredSound(): boolean {
  try {
    return window.localStorage.getItem(KEY) === "on";
  } catch {
    return false;
  }
}

export function setSoundEnabled(on: boolean): void {
  enabled = on;
  try {
    window.localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    /* non-fatal */
  }
}

function audio(): AudioContext | null {
  if (!enabled || typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, dur: number, opts: { type?: OscillatorType; vol?: number; at?: number; to?: number } = {}): void {
  const c = audio();
  if (!c) return;
  const { type = "square", vol = 0.05, at = 0, to } = opts;
  const t0 = c.currentTime + at;
  const osc = c.createOscillator();
  const gain = c.createGain();
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 3200;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(filter).connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export const sfx = {
  tick() {
    tone(1180, 0.05, { vol: 0.035 });
  },
  confirm() {
    tone(660, 0.07, { vol: 0.05 });
    tone(990, 0.12, { vol: 0.05, at: 0.06 });
  },
  back() {
    tone(520, 0.12, { vol: 0.045, to: 260 });
  },
  shatter() {
    const c = audio();
    if (!c) return;
    const len = Math.floor(c.sampleRate * 0.28);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource();
    src.buffer = buf;
    const hp = c.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.setValueAtTime(600, c.currentTime);
    hp.frequency.exponentialRampToValueAtTime(5200, c.currentTime + 0.28);
    const gain = c.createGain();
    gain.gain.value = 0.07;
    src.connect(hp).connect(gain).connect(c.destination);
    src.start();
  },
};
