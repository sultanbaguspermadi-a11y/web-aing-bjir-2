"use client";

import { useEffect, useRef, useState } from "react";
import { litPath, moonPhase } from "@/lib/moon";
import { useFinePointer } from "@/lib/use-media";
import type { DarkHourApi, GlScreen } from "@/lib/dark-hour-gl";

/** Moon drawn from the real phase of today's date (client only, so SSR matches). */
export function MoonDisc({ className, phase }: { className?: string; phase: number }) {
  const waning = phase >= 0.5;
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="#0a2a66" stroke="#7de6fd" strokeOpacity="0.5" strokeWidth="1.2" />
      <g transform={waning ? "translate(100 0) scale(-1 1)" : undefined}>
        <path d={litPath(phase, 50, 50, 46)} fill="#eaf8ff" />
      </g>
    </svg>
  );
}

/**
 * "Dark Hour" atmosphere. The CSS layers (gradient, shards, SVG moon) always
 * render and are the fallback. After the page is idle, a WebGL canvas is
 * loaded lazily and fades in on top; if WebGL is missing or the context is
 * lost, nothing changes for the visitor.
 */
export function Background({ screen, rtl }: { screen: GlScreen; rtl: boolean }) {
  const [phase, setPhase] = useState(0.5);
  const canvas = useRef<HTMLCanvasElement>(null);
  const api = useRef<DarkHourApi | null>(null);
  const [glOn, setGlOn] = useState(false);
  const fine = useFinePointer();
  const latest = useRef({ screen, rtl });
  latest.current = { screen, rtl };

  useEffect(() => setPhase(moonPhase(new Date())), []);

  // Lazy-load the WebGL layer once the browser is idle.
  useEffect(() => {
    let cancelled = false;
    let handle = 0;
    const boot = async () => {
      const el = canvas.current;
      if (!el || cancelled) return;
      try {
        const mod = await import("@/lib/dark-hour-gl");
        if (cancelled) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const created = mod.createDarkHour(el, { phase: moonPhase(new Date()), reduced });
        if (!created) return;
        api.current = created;
        created.setScreen(latest.current.screen, latest.current.rtl);
        setGlOn(true);
      } catch {
        /* keep the CSS background */
      }
    };
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    if (ric) handle = ric(() => void boot(), { timeout: 1500 });
    else handle = window.setTimeout(() => void boot(), 400);
    return () => {
      cancelled = true;
      if (!ric) window.clearTimeout(handle);
      api.current?.destroy();
      api.current = null;
    };
  }, []);

  useEffect(() => {
    api.current?.setScreen(screen, rtl);
  }, [screen, rtl, glOn]);

  useEffect(() => {
    if (!fine || !glOn) return;
    const move = (e: PointerEvent) => api.current?.setPointer((e.clientX / window.innerWidth - 0.5) * 2, -(e.clientY / window.innerHeight - 0.5) * 2);
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [fine, glOn]);

  return (
    <div className="bg-root" data-gl={glOn ? "on" : "off"} aria-hidden="true">
      <div className="bg-lines" />
      <div className="bg-shard" style={{ width: "46vw", height: "120vh", insetInlineStart: "-8vw", top: "-10vh", clipPath: "polygon(30% 0, 100% 0, 62% 100%, 0 100%)" }} />
      <div className="bg-shard" style={{ width: "30vw", height: "100vh", insetInlineStart: "52vw", top: "0", animationDuration: "55s", clipPath: "polygon(40% 0, 100% 0, 60% 100%, 0 100%)" }} />
      <MoonDisc className="bg-moon" phase={phase} />
      <canvas ref={canvas} className="bg-gl" />
      <div className="bg-vignette" />
    </div>
  );
}
