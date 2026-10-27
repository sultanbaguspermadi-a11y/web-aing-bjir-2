"use client";

import { m } from "framer-motion";
import { useLang } from "./language-provider";
import { ShardHeader } from "./shard-header";
import { SITE } from "@/content/site";
import { EASE_OUT } from "@/lib/motion";

export function AboutScreen() {
  const { t, sign } = useLang();
  return (
    <section aria-labelledby="about-title" className="screen-in relative overflow-x-clip mx-auto min-h-dvh max-w-[1680px] px-(--gutter) pb-28 pt-20">
      {/* Decorative ghost word ("Arabic"), always Kufi, always RTL. */}
      <span
        className="ghost end-0 top-[18%] hidden text-[clamp(10rem,24vw,24rem)] lg:block"
        aria-hidden="true"
        lang="ar"
        dir="rtl"
        style={{ fontFamily: "var(--font-ar-kufi), sans-serif", fontStyle: "normal", fontWeight: 700 }}
      >
        عربي
      </span>

      <div className="relative z-10 max-w-[44rem]">
        <ShardHeader title={t.about.title} id="about-title" />

        <m.div
          className="relative"
          initial={{ opacity: 0, x: -60 * sign }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.3, ease: EASE_OUT }}
        >
          <span aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 bg-cyan rtl:-translate-x-3" style={{ clipPath: "polygon(0 0,100% 0,96% 100%,0 100%)" }} />
          <div className="relative bg-n1/95 p-7 sm:p-9" style={{ clipPath: "polygon(0 0,100% 0,96% 100%,0 100%)" }}>
            <div className="flex items-center gap-5">
              <div
                aria-hidden="true"
                className="ff-display grid size-20 shrink-0 place-items-center bg-cyan text-2xl text-n1"
                style={{ clipPath: "polygon(25% 4%,75% 4%,100% 50%,75% 96%,25% 96%,0 50%)", fontFamily: "var(--font-kanit), sans-serif", fontStyle: "italic", fontWeight: 800 }}
              >
                SBP
              </div>
              <div>
                <p className="ff-display text-[clamp(1.5rem,3.2vw,2.3rem)] text-white" lang="en" dir="ltr" style={{ fontFamily: "var(--font-kanit), sans-serif", fontStyle: "italic", fontWeight: 800, textTransform: "uppercase" }}>
                  {SITE.name}
                </p>
                <p className="ff-annot mt-1 text-[0.95rem] text-cyan">{t.home.headline.map((l) => l.text).join(" ")}</p>
              </div>
            </div>

            <p className="ff-ui mt-7 max-w-[36rem] text-pretty text-[1.05rem] text-ice/90">{t.home.description}</p>

            <h2 className="ff-meta mt-8 text-cyan">{t.about.focusTitle}</h2>
            <ul className="m-0 mt-3 flex list-none flex-wrap gap-3 p-0">
              {t.about.focus.map((item) => (
                <li key={item} className="para ff-ui bg-white/10 px-5 py-1.5 text-[0.92rem] text-white" style={{ ["--sl" as string]: "0.6rem" }}>
                  {item}
                </li>
              ))}
            </ul>

            <p className="ff-meta mt-8 text-ice/60" dir="ltr">
              {t.about.credit}
            </p>
          </div>
        </m.div>
      </div>
    </section>
  );
}
