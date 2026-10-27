"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLang } from "./language-provider";
import { Background } from "./background";
import { Shatter, type ShatterPhase } from "./shatter";
import { Hud } from "./hud";
import { HomeScreen } from "./home-screen";
import { ProjectsScreen } from "./projects-screen";
import { AboutScreen } from "./about-screen";
import { ContactScreen } from "./contact-screen";
import { LanguageScreen } from "./language-screen";
import { sfx } from "@/lib/sfx";
import { useReducedMotionSafe } from "@/lib/use-media";
import { SITE } from "@/content/site";

export type Screen = "home" | "projects" | "about" | "contact" | "language";
const SCREENS: readonly Screen[] = ["home", "projects", "about", "contact", "language"];

const COVER_MS = 520;
const EXIT_MS = 520;
const MIN_LOADING_MS = 1100;

interface ShellApi {
  screen: Screen;
  go: (to: Screen) => void;
  back: () => void;
  /** Run an action (e.g. change language) behind the transition cover. */
  transition: (action: () => void | Promise<void>) => Promise<void>;
}

const ShellContext = createContext<ShellApi | null>(null);

export function useShell(): ShellApi {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error("useShell must be used inside <Shell>");
  return ctx;
}

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function screenFromHash(): Screen {
  const h = window.location.hash.replace(/^#\/?/, "");
  return (SCREENS as readonly string[]).includes(h) ? (h as Screen) : "home";
}

function pushHash(screen: Screen): void {
  const url = screen === "home" ? window.location.pathname + window.location.search : `#${screen}`;
  window.history.pushState({ screen }, "", url);
}

export function Shell() {
  const { t, ready, dir } = useLang();
  const reduced = useReducedMotionSafe();
  const [screen, setScreen] = useState<Screen>("home");
  const [phase, setPhase] = useState<ShatterPhase>("cover"); // starts covered: it IS the loading screen
  const [loaded, setLoaded] = useState(false);
  const [loadingDone, setLoadingDone] = useState(false);
  const [progress, setProgress] = useState(0.15);
  const busy = useRef(true);
  const lastHomeIndex = useRef(0);

  /* ---- Loading: real steps (fonts, language/Arabic fonts, minimum display) ---- */
  useEffect(() => {
    let alive = true;
    const done = { fonts: false, lang: false, min: false };
    const update = () => {
      if (!alive) return;
      const n = Object.values(done).filter(Boolean).length;
      setProgress(0.15 + (n / 3) * 0.85);
    };
    void ("fonts" in document ? document.fonts.ready : Promise.resolve()).then(() => {
      done.fonts = true;
      update();
    });
    void wait(MIN_LOADING_MS).then(() => {
      done.min = true;
      update();
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    setProgress((p) => Math.max(p, 0.6));
    let alive = true;
    const finish = async () => {
      await wait(MIN_LOADING_MS);
      if (!alive) return;
      setProgress(1);
      await wait(260);
      if (!alive) return;
      setScreen(screenFromHash());
      setLoaded(true);
      setPhase(reduced ? "idle" : "exit");
      await wait(reduced ? 0 : EXIT_MS);
      if (!alive) return;
      setPhase("idle");
      setLoadingDone(true);
      busy.current = false;
    };
    void finish();
    return () => {
      alive = false;
    };
    // `reduced` resolves just after mount; the loading screen waits longer than that.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  /* ---- Transitions ---- */
  const transition = useCallback(
    async (action: () => void | Promise<void>) => {
      if (busy.current) return;
      busy.current = true;
      if (reduced) {
        await action();
        busy.current = false;
        return;
      }
      sfx.shatter();
      setPhase("cover");
      await wait(COVER_MS);
      await action();
      setPhase("exit");
      await wait(EXIT_MS);
      setPhase("idle");
      busy.current = false;
    },
    [reduced],
  );

  const go = useCallback(
    (to: Screen) => {
      if (to === screen) return;
      sfx.confirm();
      void transition(() => {
        setScreen(to);
        pushHash(to);
        window.scrollTo(0, 0);
      });
    },
    [screen, transition],
  );

  const back = useCallback(() => {
    if (screen === "home") return;
    sfx.back();
    void transition(() => {
      setScreen("home");
      pushHash("home");
      window.scrollTo(0, 0);
    });
  }, [screen, transition]);

  /* ---- Esc / Backspace go back; browser Back/Forward also work ---- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Backspace") {
        if (screen !== "home" && !busy.current) {
          e.preventDefault();
          back();
        }
      }
    };
    const onPop = () => {
      if (!busy.current) setScreen(screenFromHash());
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onPop);
    };
  }, [screen, back]);

  /* ---- Document title follows the screen ---- */
  useEffect(() => {
    if (!loaded) return;
    const names: Record<Screen, string> = {
      home: t.meta.title,
      projects: `${t.projects.title} — ${SITE.name}`,
      about: `${t.about.title} — ${SITE.name}`,
      contact: `${t.contact.title} — ${SITE.name}`,
      language: `${t.language.title} — ${SITE.name}`,
    };
    document.title = names[screen];
  }, [screen, t, loaded]);

  const api = useMemo<ShellApi>(() => ({ screen, go, back, transition }), [screen, go, back, transition]);

  return (
    <ShellContext.Provider value={api}>
      <div data-screen={screen} className="relative min-h-dvh">
        <a href="#main" className="skip-link">
          {t.a11y.skip}
        </a>
        <Background screen={screen} rtl={dir === "rtl"} />
        <Hud screen={screen} />
        <main id="main" className="relative z-10" aria-hidden={loaded ? undefined : true}>
          {loaded && screen === "home" ? (
            <HomeScreen initialIndex={lastHomeIndex.current} onIndexChange={(i) => (lastHomeIndex.current = i)} />
          ) : null}
          {loaded && screen === "projects" ? <ProjectsScreen /> : null}
          {loaded && screen === "about" ? <AboutScreen /> : null}
          {loaded && screen === "contact" ? <ContactScreen /> : null}
          {loaded && screen === "language" ? <LanguageScreen /> : null}
        </main>

        {/* Crawlers and no-JS readers get the real content. */}
        <div className="sr-only">
          <h1>{t.meta.title}</h1>
          <p>{t.meta.description}</p>
        </div>

        <Shatter phase={phase}>
          {!loadingDone ? <LoadingHud progress={progress} /> : null}
        </Shatter>
      </div>
    </ShellContext.Provider>
  );
}

function LoadingHud({ progress }: { progress: number }) {
  const { t } = useLang();
  return (
    <div className="slant absolute bottom-[8vh] end-[6vw] z-10 w-[min(26rem,78vw)] bg-n1 px-6 pb-5 pt-4" role="progressbar" aria-label={t.a11y.loading} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
      <p className="ff-display text-[clamp(1.6rem,4vw,2.6rem)] text-white">
        NOW LOADING<span aria-hidden="true" className="inline-block w-[1.6em] text-start">{progress < 1 ? "..." : ""}</span>
      </p>
      <div className="mt-3 flex items-center gap-3">
        <div className="h-[6px] flex-1 bg-white/20" style={{ clipPath: "polygon(0 0,100% 0,98% 100%,0 100%)" }}>
          <div className="h-full origin-left bg-cyan transition-transform duration-500 ease-out rtl:origin-right" style={{ transform: `scaleX(${progress})` }} />
        </div>
        <span className="ff-meta w-10 text-end text-white">{Math.round(progress * 100)}%</span>
      </div>
    </div>
  );
}
