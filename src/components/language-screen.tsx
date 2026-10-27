"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { m } from "framer-motion";
import { useLang } from "./language-provider";
import { useShell } from "./shell";
import { ShardHeader } from "./shard-header";
import { useListNav, useTickOnChange } from "@/lib/list-nav";
import { LANGS, LANG_CODES, LANG_NAMES, dirOf, type Lang } from "@/content/copy";
import { EASE_OUT } from "@/lib/motion";
import { sfx } from "@/lib/sfx";

export function LanguageScreen() {
  const { t, lang, sign, setLang, warm } = useLang();
  const { transition } = useShell();
  const [index, setIndex] = useState(Math.max(0, LANGS.indexOf(lang)));
  const refs = useRef<(HTMLElement | null)[]>([]);
  useListNav(refs, LANGS.length, index);
  useTickOnChange(index);
  useEffect(() => {
    refs.current[index]?.focus({ preventScroll: true });
    // Focus the current item once, when the screen opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const choose = (code: Lang) => {
    if (code === lang) return;
    sfx.confirm();
    void transition(() => setLang(code));
  };

  return (
    <section aria-labelledby="language-title" className="screen-in relative overflow-x-clip mx-auto min-h-dvh max-w-[1680px] px-(--gutter) pb-28 pt-20">
      <ShardHeader title={t.language.title} id="language-title" />
      <ul className="m-0 flex max-w-[34rem] list-none flex-col gap-4 p-0">
        {LANGS.map((code, i) => {
          const active = code === lang;
          return (
            <m.li
              key={code}
              initial={{ opacity: 0, x: -70 * sign }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.09, ease: EASE_OUT }}
              style={{ marginInlineStart: `${i * 1.3}rem` }}
            >
              <button
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                lang={code}
                dir={dirOf(code)}
                data-active={index === i}
                aria-pressed={active}
                className="p3-item"
                style={{ "--accent": "#7de6fd" } as CSSProperties}
                onFocus={() => {
                  setIndex(i);
                  warm(code);
                }}
                onClick={() => choose(code)}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") refs.current[i]?.focus({ preventScroll: true });
                }}
              >
                <span className="flex items-center justify-between gap-6 py-4 ps-6 pe-12">
                  <span
                    className="text-[clamp(1.5rem,3vw,2.2rem)]"
                    style={
                      code === "ar"
                        ? { fontFamily: "var(--font-ar-kufi), sans-serif", fontWeight: 700, lineHeight: 1.4 }
                        : { fontFamily: "var(--font-kanit), sans-serif", fontWeight: 800, fontStyle: "italic", textTransform: "uppercase", lineHeight: 1.1 }
                    }
                  >
                    {LANG_NAMES[code]}
                  </span>
                  <span className="ff-meta flex items-center gap-2" dir="ltr">
                    {active ? (
                      <>
                        <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                          <path d="M2.5 8.5 6 12l7.5-8" strokeLinecap="square" />
                        </svg>
                        <span className="sr-only">{t.language.current}</span>
                      </>
                    ) : null}
                    {LANG_CODES[code]}
                  </span>
                </span>
              </button>
            </m.li>
          );
        })}
      </ul>
    </section>
  );
}
