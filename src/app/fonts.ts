import localFont from "next/font/local";

/**
 * Fonts are bundled locally (OFL licensed, see src/fonts/LICENSE-*).
 * Only the weights actually used are declared.
 * Latin fonts are preloaded with automatic fallback metrics (no layout shift).
 * Arabic fonts are NOT preloaded: they download only when Arabic is shown,
 * and the language switch waits for them (see language-provider.tsx).
 */

export const plexSans = localFont({
  src: [
    { path: "../fonts/ibm-plex-sans-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/ibm-plex-sans-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-plex-sans",
  display: "swap",
  adjustFontFallback: "Arial",
});

export const kanit = localFont({
  src: [
    { path: "../fonts/kanit-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/kanit-latin-700-italic.woff2", weight: "700", style: "italic" },
    { path: "../fonts/kanit-latin-800-italic.woff2", weight: "800", style: "italic" },
  ],
  variable: "--font-kanit",
  display: "swap",
  adjustFontFallback: "Arial",
});

export const arUi = localFont({
  src: [
    { path: "../fonts/ibm-plex-sans-arabic-arabic-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/ibm-plex-sans-arabic-arabic-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/ibm-plex-sans-arabic-arabic-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-ar-ui",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

export const arKufi = localFont({
  src: [
    { path: "../fonts/noto-kufi-arabic-arabic-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/noto-kufi-arabic-arabic-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-ar-kufi",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

export const arNaskh = localFont({
  src: [{ path: "../fonts/noto-naskh-arabic-arabic-400-normal.woff2", weight: "400", style: "normal" }],
  variable: "--font-ar-naskh",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

export const arNastaliq = localFont({
  src: [{ path: "../fonts/noto-nastaliq-urdu-arabic-400-normal.woff2", weight: "400", style: "normal" }],
  variable: "--font-ar-nastaliq",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

/** Ruq'ah-style: Aref Ruqaa (OFL). Own variable, used for short annotations only. */
export const arRuqah = localFont({
  src: [{ path: "../fonts/aref-ruqaa-arabic-400-normal.woff2", weight: "400", style: "normal" }],
  variable: "--font-ar-ruqah",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

export const fontVariables = [
  plexSans,
  kanit,
  arUi,
  arKufi,
  arNaskh,
  arNastaliq,
  arRuqah,
]
  .map((f) => f.variable)
  .join(" ");

/** Faces the client awaits before switching to Arabic, so no FOUT/layout shift. */
export interface FontProbe {
  family: string;
  weight: string;
}

function primaryFamily(font: { style: { fontFamily: string } }): string {
  // next/font returns "'__name_hash', '__name_Fallback_hash'"; first entry is the real face.
  return font.style.fontFamily.split(",")[0]!.trim();
}

export const arabicFontProbes: FontProbe[] = [
  { family: primaryFamily(arUi), weight: "400" },
  { family: primaryFamily(arUi), weight: "500" },
  { family: primaryFamily(arUi), weight: "600" },
  { family: primaryFamily(arKufi), weight: "500" },
  { family: primaryFamily(arKufi), weight: "700" },
  { family: primaryFamily(arNaskh), weight: "400" },
  { family: primaryFamily(arNastaliq), weight: "400" },
  { family: primaryFamily(arRuqah), weight: "400" },
];
