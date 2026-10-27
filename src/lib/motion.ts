/** Shared easing + timing. Editorial, controlled, never bouncy. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN = [0.5, 0, 0.9, 0.35] as const;
export const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const;

export const DUR = { micro: 0.3, secondary: 0.8, primary: 1.1 } as const;

/** Colour used for the hero "accent trace" and for tints. */
export function originX(sign: 1 | -1): number {
  return sign === 1 ? 0 : 1;
}
