"use client";

import { useEffect, useLayoutEffect, useState } from "react";

export const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** True only for mouse-like pointers. Gates cursor label + mouse-follow. */
export function useFinePointer(): boolean {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return fine;
}

/**
 * prefers-reduced-motion, but `false` on the server AND on the first client
 * render, so hydration always matches the server HTML. The real value arrives
 * right after mount. Only use it for things that can change after mount
 * (scroll ranges, durations); initial/animate targets stay identical for
 * everyone and MotionConfig(reducedMotion="user") makes transforms instant.
 */
export function useReducedMotionSafe(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}
