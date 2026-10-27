/**
 * Language-independent site data. Everything translatable lives in copy.ts.
 * URLs come from env vars (see .env.example) so nothing is hard-coded.
 */

export const SITE = {
  name: "Sultan Bagus Permadi",
  year: 2026,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  github: process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com",
} as const;

export interface ProjectMeta {
  id: "lughoti" | "scrabble";
  /** Public title. Never translated. */
  title: string;
  accent: string;
  href: string;
  image: { src: string };
  /** CSS aspect-ratio of the screenshot (width / height). */
  aspect: string;
}

/** Exactly two flagship projects. Do not add placeholders. */
export const PROJECTS: readonly [ProjectMeta, ProjectMeta] = [
  {
    id: "lughoti",
    title: "Lughoti Vokasi",
    accent: "#8ECDF4",
    href: process.env.NEXT_PUBLIC_LUGHOTI_URL ?? "https://github.com",
    image: { src: "/projects/lughoti-vokasi.webp" },
    aspect: "1500 / 880",
  },
  {
    id: "scrabble",
    title: "Arabic Scrabble",
    accent: "#D4AF37", // the gold of the game's own Classic theme
    href: process.env.NEXT_PUBLIC_SCRABBLE_URL ?? "https://github.com",
    image: { src: "/projects/arabic-scrabble.webp" },
    aspect: "1150 / 920",
  },
] as const;
