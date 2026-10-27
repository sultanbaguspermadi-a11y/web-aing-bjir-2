"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { copy, dirOf, isLang, type Copy, type Lang } from "@/content/copy";
import { useIsomorphicLayoutEffect } from "@/lib/use-media";

export interface FontProbe {
  family: string;
  weight: string;
}

interface LanguageContextValue {
  lang: Lang;
  dir: "ltr" | "rtl";
  /** +1 for LTR, -1 for RTL. Multiply horizontal offsets by this. */
  sign: 1 | -1;
  t: Copy;
  /** False until the stored/browser language has been resolved (and Arabic fonts loaded, if needed). */
  ready: boolean;
  /** Resolves once the new language is committed. Waits for Arabic fonts so nothing reflows visibly. */
  setLang: (next: Lang) => Promise<void>;
  /** Start downloading the fonts for a language (hover/focus on a language option). */
  warm: (next: Lang) => void;
}

const STORAGE_KEY = "sbp-lang";
const FONT_TIMEOUT_MS = 700;
const AR_SAMPLE = "مشاريع تعليم اللغة العربية";

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function applyDocument(lang: Lang): void {
  const el = document.documentElement;
  el.lang = lang;
  el.dir = dirOf(lang);
}

function readStored(): Lang | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return isLang(value) ? value : null;
  } catch {
    return null; // storage can be blocked (private mode, strict settings)
  }
}

function persist(lang: Lang): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* non-fatal */
  }
}

function detectInitial(): Lang {
  const fromQuery = new URLSearchParams(window.location.search).get("lang");
  if (isLang(fromQuery)) return fromQuery;
  const stored = readStored();
  if (stored) return stored;
  for (const tag of navigator.languages ?? [navigator.language]) {
    const base = tag.toLowerCase().split("-")[0];
    if (base === "id" || base === "in") return "id";
    if (base === "ar") return "ar";
    if (base === "en") return "en";
  }
  return "en";
}

export function LanguageProvider({ arabicFonts, children }: { arabicFonts: FontProbe[]; children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("id");
  const [ready, setReady] = useState(false);
  const langRef = useRef<Lang>("id");
  const mounted = useRef(true);
  const fontsPromise = useRef<Promise<void> | null>(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  /** Resolves when Arabic faces are loaded, or after a timeout (never blocks the UI for long). */
  const loadArabicFonts = useCallback((): Promise<void> => {
    if (!("fonts" in document)) return Promise.resolve();
    if (!fontsPromise.current) {
      const load = Promise.all(
        arabicFonts.map((f) => document.fonts.load(`${f.weight} 1em ${f.family}`, AR_SAMPLE)),
      ).then(() => undefined);
      fontsPromise.current = load.catch(() => undefined);
    }
    return Promise.race([fontsPromise.current, wait(FONT_TIMEOUT_MS)]);
  }, [arabicFonts]);

  const warm = useCallback(
    (next: Lang) => {
      if (next === "ar") void loadArabicFonts();
    },
    [loadArabicFonts],
  );

  const commit = useCallback((next: Lang) => {
    langRef.current = next;
    applyDocument(next);
    setLangState(next);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const initial = detectInitial();
    const finish = () => {
      if (!mounted.current) return;
      commit(initial);
      setReady(true);
    };
    if (initial === "ar") void loadArabicFonts().then(finish);
    else finish();
  }, [commit, loadArabicFonts]);

  const setLang = useCallback(
    async (next: Lang) => {
      if (next === langRef.current) return;
      persist(next);
      if (next === "ar") await loadArabicFonts();
      if (mounted.current) commit(next);
    },
    [commit, loadArabicFonts],
  );

  const value = useMemo<LanguageContextValue>(() => {
    const dir = dirOf(lang);
    return { lang, dir, sign: dir === "ltr" ? 1 : -1, t: copy[lang], ready, setLang, warm };
  }, [lang, ready, setLang, warm]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
