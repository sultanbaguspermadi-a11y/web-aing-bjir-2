"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { m, useMotionValue, useSpring } from "framer-motion";
import { Arrow } from "./icons";

interface CursorApi {
  show: (x: number, y: number, label: string) => void;
  hide: () => void;
}

const CursorContext = createContext<CursorApi | null>(null);
const LabelContext = createContext<string | null>(null);

export function useCursorLabel(): CursorApi {
  const ctx = useContext(CursorContext);
  if (!ctx) throw new Error("useCursorLabel must be used inside <CursorProvider>");
  return ctx;
}

/**
 * Desktop-only "VIEW ↗" tag that trails the pointer over project images.
 * The native cursor is never hidden or replaced. The window listener exists
 * only while a label is visible.
 */
export function CursorProvider({ children }: { children: ReactNode }) {
  const [label, setLabel] = useState<string | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 420, damping: 38, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 420, damping: 38, mass: 0.5 });

  const show = useCallback(
    (px: number, py: number, text: string) => {
      x.set(px);
      y.set(py);
      sx.jump(px);
      sy.jump(py);
      setLabel(text);
    },
    [x, y, sx, sy],
  );
  const hide = useCallback(() => setLabel(null), []);

  useEffect(() => {
    if (!label) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [label, x, y]);

  const api = useMemo<CursorApi>(() => ({ show, hide }), [show, hide]);

  return (
    <CursorContext.Provider value={api}>
      <LabelContext.Provider value={label}>
        {children}
        <CursorTag x={sx} y={sy} />
      </LabelContext.Provider>
    </CursorContext.Provider>
  );
}

function CursorTag({
  x,
  y,
}: {
  x: ReturnType<typeof useSpring>;
  y: ReturnType<typeof useSpring>;
}) {
  const label = useContext(LabelContext);
  const [last, setLast] = useState("");
  useEffect(() => {
    if (label) setLast(label);
  }, [label]);

  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[70]"
      style={{ x, y }}
    >
      <m.div
        className="ff-meta flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-paper"
        style={{ translateX: 16, translateY: 16, originX: 0, originY: 0 }}
        initial={false}
        animate={{ opacity: label ? 1 : 0, scale: label ? 1 : 0.6 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <span>{label ?? last}</span>
        <Arrow kind="ne" />
      </m.div>
    </m.div>
  );
}
