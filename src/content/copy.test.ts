import { describe, expect, it } from "vitest";
import { copy, formatIndex, LANGS, type Copy } from "./copy";
import { PROJECTS, SITE } from "./site";

/** Collect every dotted key path of a nested object. */
function paths(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) return [prefix]; // arrays are compared by length below
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => paths(v, prefix ? `${prefix}.${k}` : k));
  }
  return [prefix];
}

const everyString = (c: Copy): string[] => JSON.stringify(c).match(/"(?:[^"\\]|\\.)*"/g) ?? [];

describe("copy", () => {
  it("has the same keys in every language", () => {
    const base = paths(copy.en).sort();
    for (const lang of LANGS) {
      const keys = paths(copy[lang]);
      // `face` is an optional Arabic-only typographic hint.
      expect(keys.filter((k) => !k.endsWith("face")).sort()).toEqual(base.filter((k) => !k.endsWith("face")));
    }
  });

  it("has a two-line headline in every language", () => {
    for (const lang of LANGS) expect(copy[lang].home.headline).toHaveLength(2);
  });

  it("uses the full creator name, never a shortened one", () => {
    expect(SITE.name).toBe("Sultan Bagus Permadi");
    for (const lang of LANGS) {
      expect(copy[lang].about.credit).toContain("Sultan Bagus Permadi");
    }
  });

  it("never uses the internal EAS name or Coming Soon placeholders", () => {
    for (const lang of LANGS) {
      const text = everyString(copy[lang]).join(" ");
      expect(text).not.toMatch(/\bEAS\b/);
      expect(text).not.toMatch(/coming soon|segera hadir|قريبا|قريباً/i);
    }
  });

  it("only uses Nastaliq on Arabic, as a display accent", () => {
    expect(copy.ar.home.headline.some((l) => l.face === "nastaliq")).toBe(true);
    for (const lang of ["id", "en"] as const) {
      expect(copy[lang].home.headline.every((l) => !l.face)).toBe(true);
    }
  });
});

describe("projects", () => {
  it("are exactly Lughoti Vokasi and Arabic Scrabble", () => {
    expect(PROJECTS.map((p) => p.title)).toEqual(["Lughoti Vokasi", "Arabic Scrabble"]);
  });

  it("keep the Lughoti accent colour from the PRD", () => {
    expect(PROJECTS[0].accent.toLowerCase()).toBe("#8ecdf4");
  });

  it("have distinct accents and a localized description in every language", () => {
    expect(PROJECTS[0].accent).not.toBe(PROJECTS[1].accent);
    for (const lang of LANGS) {
      expect(copy[lang].projects.lughoti.summary.length).toBeGreaterThan(10);
      expect(copy[lang].projects.scrabble.summary.length).toBeGreaterThan(10);
    }
  });
});

describe("formatIndex", () => {
  it("uses Latin digits except in Arabic", () => {
    expect(formatIndex(1, "en")).toBe("01");
    expect(formatIndex(3, "id")).toBe("03");
    expect(formatIndex(2, "ar")).toBe("٠٢");
  });
});

describe("menu", () => {
  it("has the same four entries with a hint in every language", () => {
    for (const lang of LANGS) {
      const entries = Object.values(copy[lang].menu);
      expect(entries).toHaveLength(4);
      for (const e of entries) {
        expect(e.label.length).toBeGreaterThan(1);
        expect(e.hint.length).toBeGreaterThan(5);
      }
    }
  });
});
