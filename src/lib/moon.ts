const SYNODIC_MS = 29.530588853 * 86_400_000;
/** A known new moon: 2000-01-06 18:14 UTC. */
const REFERENCE_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);

/** 0 = new moon, 0.5 = full moon, back to 1 = new. */
export function moonPhase(date: Date): number {
  const p = ((date.getTime() - REFERENCE_NEW_MOON) / SYNODIC_MS) % 1;
  return p < 0 ? p + 1 : p;
}

/**
 * SVG path of the lit part of the moon (unit circle radius r centred at cx,cy).
 * Waxing (phase < 0.5) is lit on the right; waning is mirrored by the caller.
 */
export function litPath(phase: number, cx: number, cy: number, r: number): string {
  const t = Math.cos(2 * Math.PI * (phase < 0.5 ? phase : 1 - phase)); // 1 new .. -1 full
  const rx = Number((Math.abs(t) * r).toFixed(3)); // also avoids 1e-15 noise at the quarters
  const sweep = t > 0 ? 0 : 1; // crescent bulges right, gibbous bulges left
  return `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${rx} ${r} 0 0 ${sweep} ${cx} ${cy - r} Z`;
}
