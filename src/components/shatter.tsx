"use client";

import { m } from "framer-motion";
import { useLang } from "./language-provider";
import { EASE_IN_OUT } from "@/lib/motion";

export type ShatterPhase = "cover" | "exit" | "idle";

const BARS = [
  { color: "#001233", w: 17 },
  { color: "#0a2a66", w: 16 },
  { color: "#2c7dff", w: 15 },
  { color: "#7de6fd", w: 12 },
  { color: "#001233", w: 17 },
  { color: "#ffffff", w: 10 },
  { color: "#0a2a66", w: 17 },
  { color: "#001233", w: 17 },
] as const;

/**
 * Full-screen slanted bars that sweep across, hiding the screen swap.
 * Bars carry no text, so the slant never touches Arabic glyphs.
 * Not rendered at all for reduced-motion users (screens simply fade).
 */
export function Shatter({ phase, children }: { phase: ShatterPhase; children?: React.ReactNode }) {
  const { sign } = useLang();
  let left = -6;
  return (
    <div
      className="fixed inset-0 z-[90] overflow-hidden"
      style={{ pointerEvents: phase === "idle" ? "none" : "all" }}
      aria-hidden={phase === "idle" ? true : undefined}
    >
      <div className="absolute inset-y-0" style={{ insetInline: "-14vw" }}>
        {BARS.map((bar, i) => {
          const pos = left;
          left += bar.w - 3;
          return (
            <m.div
              key={i}
              className="absolute inset-y-0"
              style={{ insetInlineStart: `${pos}%`, width: `${bar.w + 4}%`, backgroundColor: bar.color, skewX: -14 }}
              initial={false}
              animate={
                phase === "cover"
                  ? { x: "0vw", transition: { duration: 0.34, delay: i * 0.026, ease: EASE_IN_OUT } }
                  : phase === "exit"
                    ? { x: `${130 * sign}vw`, transition: { duration: 0.34, delay: i * 0.026, ease: EASE_IN_OUT } }
                    : { x: `${-130 * sign}vw`, transition: { duration: 0 } }
              }
            />
          );
        })}
      </div>
      {children}
    </div>
  );
}
