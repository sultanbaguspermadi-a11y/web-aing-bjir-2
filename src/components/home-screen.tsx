"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useLang } from "./language-provider";
import { useShell, type Screen } from "./shell";
import { useListNav, useTickOnChange } from "@/lib/list-nav";
import { formatIndex } from "@/content/copy";
import { SITE } from "@/content/site";
import { EASE_OUT } from "@/lib/motion";

const ITEMS = ["projects", "about", "contact", "language"] as const satisfies readonly Screen[];

export function HomeScreen({ initialIndex, onIndexChange }: { initialIndex: number; onIndexChange: (i: number) => void }) {
  const { t, lang, sign } = useLang();
  const { go } = useShell();
  const [index, setIndex] = useState(initialIndex);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useListNav(refs, ITEMS.length, index);
  useTickOnChange(index);
  useEffect(() => {
    refs.current[initialIndex]?.focus({ preventScroll: true });
    // Focus the remembered item once, when the screen opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const select = (i: number) => {
    setIndex(i);
    onIndexChange(i);
  };
  const active = ITEMS[index] ?? ITEMS[0];

  return (
    <section
      aria-labelledby="home-title"
      className="screen-in relative overflow-x-clip mx-auto flex min-h-dvh max-w-[1680px] flex-col-reverse justify-center gap-10 px-(--gutter) pb-24 pt-24 lg:flex-row lg:items-center lg:justify-between lg:gap-16"
    >
      {/* Ghost index: rolls when the selection changes. */}
      <div className="ghost start-[-1vw] top-1/2 hidden -translate-y-1/2 text-[clamp(14rem,30vw,28rem)] lg:block" aria-hidden="true">
        <AnimatePresence mode="popLayout" initial={false}>
          <m.span
            key={`${lang}-${index}`}
            className="block"
            initial={{ y: "30%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-30%", opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
          >
            {formatIndex(index + 1, lang)}
          </m.span>
        </AnimatePresence>
      </div>

      <nav aria-label={t.a11y.menu} className="relative z-10 w-full max-w-[30rem] lg:w-[28rem] lg:shrink-0">
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {ITEMS.map((id, i) => (
            <m.li
              key={id}
              initial={{ opacity: 0, x: -60 * sign }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.07, ease: EASE_OUT }}
              style={{ marginInlineStart: `${i * 1.1}rem` }}
            >
              <button
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                data-active={index === i}
                className="p3-item"
                onClick={() => go(id)}
                onFocus={() => select(i)}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") refs.current[i]?.focus({ preventScroll: true });
                }}
              >
                <span className="ff-display block py-[0.5em] ps-[1.1em] pe-[1.8em] text-[clamp(1.7rem,3.2vw,2.7rem)]">{t.menu[id].label}</span>
              </button>
            </m.li>
          ))}
        </ul>

        <div className="mt-6 h-12" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <m.p
              key={`${lang}-${active}`}
              className="para ff-ui inline-block bg-white/10 px-6 py-2 text-[0.95rem] text-ice"
              initial={{ opacity: 0, x: -24 * sign }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
            >
              {t.menu[active].hint}
            </m.p>
          </AnimatePresence>
        </div>
      </nav>

      <div className="relative z-10 lg:max-w-[48rem]">
        <m.p
          className="ff-meta text-cyan"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT }}
        >
          {SITE.name} · {t.home.eyebrow}
        </m.p>
        <h1 id="home-title" className="ff-display mt-4 text-balance text-[clamp(2rem,4.2vw,4.4rem)] text-white [text-shadow:0_2px_24px_rgb(0_10_40/0.8)]">
          {t.home.headline.map((line, i) => (
            <span key={`${lang}-${i}`} className="block overflow-hidden py-[0.06em]">
              <m.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.8, delay: 0.25 + i * 0.12, ease: EASE_OUT }}
              >
                {line.face === "nastaliq" ? <span className="face-nastaliq">{line.text}</span> : line.text}
              </m.span>
            </span>
          ))}
        </h1>
        <m.span
          aria-hidden="true"
          className="mt-6 block h-[6px] w-40 bg-cyan"
          style={{ clipPath: "polygon(0 0,100% 0,94% 100%,0 100%)", originX: sign === 1 ? 0 : 1 }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.55, ease: EASE_OUT }}
        />
        <m.p
          className="ff-ui mt-6 max-w-[34rem] text-pretty text-[1.02rem] text-ice/85"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: EASE_OUT }}
        >
          {t.home.description}
        </m.p>
      </div>
    </section>
  );
}
