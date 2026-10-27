import { describe, expect, it } from "vitest";
import { litPath, moonPhase } from "./moon";

describe("moonPhase", () => {
  it("is ~0 at the reference new moon", () => {
    const p = moonPhase(new Date(Date.UTC(2000, 0, 6, 18, 14)));
    expect(Math.min(p, 1 - p)).toBeLessThan(0.01);
  });

  it("is ~0.5 at the full moon of 2000-01-21", () => {
    expect(moonPhase(new Date(Date.UTC(2000, 0, 21, 4, 40)))).toBeCloseTo(0.5, 1);
  });

  it("stays in [0, 1) for dates before the reference", () => {
    const p = moonPhase(new Date(Date.UTC(1990, 5, 1)));
    expect(p).toBeGreaterThanOrEqual(0);
    expect(p).toBeLessThan(1);
  });
});

describe("litPath", () => {
  it("draws a flat terminator at first quarter", () => {
    expect(litPath(0.25, 50, 50, 46)).toContain("A 0 46");
  });

  it("is a closed path", () => {
    expect(litPath(0.1, 50, 50, 46).trim().endsWith("Z")).toBe(true);
  });
});
