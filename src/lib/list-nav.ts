"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { sfx } from "./sfx";

/**
 * Arrow-key (and W/S) navigation across a list of focusable items.
 * Items stay real buttons/links, so Enter, Space and Tab keep native behaviour.
 */
export function useListNav(
  refs: MutableRefObject<(HTMLElement | null)[]>,
  count: number,
  index: number,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      let delta = 0;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") delta = 1;
      else if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") delta = -1;
      else return;
      e.preventDefault();
      refs.current[(index + delta + count) % count]?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [refs, count, index, enabled]);
}

/** Plays the selection tick whenever the highlighted index changes (not on mount). */
export function useTickOnChange(index: number): void {
  const prev = useRef(index);
  useEffect(() => {
    if (prev.current !== index) sfx.tick();
    prev.current = index;
  }, [index]);
}
