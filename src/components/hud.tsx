"use client";

import { useEffect, useState } from "react";
import { useLang } from "./language-provider";
import { useShell, type Screen } from "./shell";
import { MoonDisc } from "./background";
import { Arrow, SoundIcon } from "./icons";
import { moonPhase } from "@/lib/moon";
import { readStoredSound, setSoundEnabled, sfx } from "@/lib/sfx";
import { SITE } from "@/content/site";
import type { Lang } from "@/content/copy";

function dateLabel(lang: Lang, now: Date): string {
  // Arabic shows the Hijri date (a lunar calendar, which suits the moon motif).
  const locale = lang === "ar" ? "ar-SA-u-ca-islamic-umalqura-nu-arab" : lang === "id" ? "id-ID" : "en-US";
  try {
    return new Intl.DateTimeFormat(locale, {
      weekday: "short",
      day: "numeric",
      month: lang === "ar" ? "long" : "short",
    }).format(now);
  } catch {
    return now.toDateString();
  }
}

/** Real date + real moon phase, ala the P3R calendar. Client only (no SSR mismatch). */
function DarkHourClock() {
  const { lang } = useLang();
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);
  if (!now) return <div className="h-9" />;
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <MoonDisc className="size-9" phase={moonPhase(now)} />
      <p className="ff-meta text-ice">{dateLabel(lang, now)}</p>
    </div>
  );
}

function SoundToggle() {
  const { t } = useLang();
  const [on, setOn] = useState(false);
  useEffect(() => {
    const stored = readStoredSound();
    setSoundEnabled(stored);
    setOn(stored);
  }, []);
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => {
        const next = !on;
        setSoundEnabled(next);
        setOn(next);
        if (next) sfx.confirm();
      }}
      className="ff-meta pointer-events-auto flex items-center gap-2 px-2 py-1.5 text-ice hover:text-cyan"
    >
      <SoundIcon on={on} className="text-base" />
      <span className="hidden sm:inline">{on ? t.hud.soundOn : t.hud.soundOff}</span>
      <span className="sr-only sm:hidden">{on ? t.hud.soundOn : t.hud.soundOff}</span>
    </button>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <span className="ff-meta grid h-7 min-w-7 place-items-center border border-white/70 bg-n1/60 px-1.5 not-italic text-white" style={{ fontStyle: "normal" }}>
      {children}
    </span>
  );
}

export function Hud({ screen }: { screen: Screen }) {
  const { t } = useLang();
  const { back } = useShell();
  const hasList = screen !== "about";
  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-start justify-between gap-4 px-(--gutter) pt-4">
        <DarkHourClock />
        <div className="flex items-start gap-4">
          <div className="hidden text-end sm:block" aria-hidden="true">
            <p className="ff-display text-[0.95rem] text-white">{SITE.name}</p>
            <span className="mt-1 block h-[3px] w-full bg-cyan" style={{ clipPath: "polygon(0 0,100% 0,96% 100%,0 100%)" }} />
          </div>
          <SoundToggle />
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex items-end justify-between gap-4 px-(--gutter) pb-4">
        <div>
          {screen !== "home" ? (
            <button type="button" onClick={back} className="p3-btn pointer-events-auto">
              <Arrow kind="right" className="rotate-180 rtl:rotate-0" />
              {t.hud.back}
            </button>
          ) : null}
        </div>
        <div className="keycaps flex items-center gap-5" aria-hidden="true">
          {hasList ? (
            <span className="flex items-center gap-2">
              <Key>↑↓</Key>
              <span className="ff-meta text-white">{t.hud.select}</span>
            </span>
          ) : null}
          {screen !== "about" ? (
            <span className="flex items-center gap-2">
              <Key>ENTER</Key>
              <span className="ff-meta text-white">{t.hud.confirm}</span>
            </span>
          ) : null}
          {screen !== "home" ? (
            <span className="flex items-center gap-2">
              <Key>ESC</Key>
              <span className="ff-meta text-white">{t.hud.back}</span>
            </span>
          ) : null}
        </div>
      </div>
    </>
  );
}
