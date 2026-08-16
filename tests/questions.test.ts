import { describe, expect, it } from "vitest";
import { ISLANDS, LANGS, STR, fmt, hourAngle, minuteAngle } from "@game/index.ts";
import { board, genQ } from "@game/questions.ts";

const islandIndex = (type: string, minutes?: string) =>
  ISLANDS.findIndex((i) => i.type === type && (minutes === undefined || i.minutes === minutes));

/** Generate many questions for an island so random branches all get exercised. */
const many = (index: number, n = 60, lang: "cs" | "en" | "es" = "cs") =>
  Array.from({ length: n }, () => genQ(index, STR[lang], lang, 5));

describe("read islands", () => {
  it("offers three unique options with exactly one correct answer", () => {
    for (const { q } of many(islandIndex("read", "whole"))) {
      expect(q.options).toHaveLength(3);
      expect(q.options!.filter((o) => o.correct)).toHaveLength(1);
      const labels = q.options!.map((o) => o.label);
      expect(new Set(labels).size).toBe(3);
    }
  });

  it("labels the correct option with the clock's own time", () => {
    for (const { q } of many(islandIndex("read", "five"))) {
      const correct = q.options!.find((o) => o.correct)!;
      expect(correct.label).toBe(fmt(q.h!, q.m!));
    }
  });

  it("respects each island's minute granularity", () => {
    const grains: Array<[string, (m: number) => boolean]> = [
      ["whole", (m) => m === 0],
      ["quarter", (m) => [0, 15, 30, 45].includes(m)],
      ["five", (m) => m % 5 === 0],
      ["any", (m) => m >= 0 && m < 60],
    ];
    for (const [minutes, ok] of grains) {
      const idx = islandIndex("read", minutes);
      for (const { q } of many(idx)) {
        expect(ok(q.m!), `island ${minutes} produced minute ${q.m}`).toBe(true);
        for (const opt of q.options!) {
          const optMinute = Number(opt.label!.split(":")[1]);
          expect(ok(optMinute), `island ${minutes} option ${opt.label}`).toBe(true);
        }
      }
    }
  });

  it("keeps hours in 1–12", () => {
    for (const { q } of many(islandIndex("read", "any"))) {
      expect(q.h).toBeGreaterThanOrEqual(1);
      expect(q.h).toBeLessThanOrEqual(12);
    }
  });

  it("tints the digits only on the beginner islands", () => {
    for (const [i, isl] of ISLANDS.entries()) {
      if (isl.type !== "read") continue;
      const { q } = genQ(i, STR.cs, "cs", 5);
      expect(!!q.colorCues).toBe(!!isl.colorCues);
    }
  });
});

describe("digital-24 island", () => {
  const idx = islandIndex("dig24");

  it("shows a 24-hour label with three clock options, one correct", () => {
    for (const { q } of many(idx)) {
      expect(q.digital).toMatch(/^\d{2}:\d{2}$/);
      expect(q.options).toHaveLength(3);
      expect(q.options!.filter((o) => o.correct)).toHaveLength(1);
    }
  });

  it("points the correct clock at the same hour in 12-hour form", () => {
    for (const { q } of many(idx)) {
      const h12 = q.h! % 12 === 0 ? 12 : q.h! % 12;
      const correct = q.options!.find((o) => o.correct)!;
      expect(correct.hA).toBe((h12 % 12) * 30);
      expect(correct.mA).toBe(0);
    }
  });

  it("never repeats an option's hand position", () => {
    for (const { q } of many(idx)) {
      expect(new Set(q.options!.map((o) => o.hA)).size).toBe(3);
    }
  });
});

describe("matching island", () => {
  it("deals four analog/digital pairs that all match up", () => {
    for (let i = 0; i < 40; i++) {
      const cards = board();
      expect(cards).toHaveLength(8);
      expect(cards.every((c) => !c.matched)).toBe(true);
      for (let pair = 0; pair < 4; pair++) {
        const of = cards.filter((c) => c.pair === pair);
        expect(of).toHaveLength(2);
        const analog = of.find((c) => c.kind === "analog")!;
        const digital = of.find((c) => c.kind === "digital")!;
        expect(analog).toBeDefined();
        expect(digital).toBeDefined();
        // the analog hands must show the time printed on its partner
        const [h, m] = digital.label!.split(":").map(Number);
        expect(analog.hA).toBeCloseTo(hourAngle(h!, m!));
        expect(analog.mA).toBeCloseTo(minuteAngle(m!));
      }
    }
  });

  it("never deals the same time twice", () => {
    for (let i = 0; i < 40; i++) {
      const labels = board()
        .filter((c) => c.kind === "digital")
        .map((c) => c.label);
      expect(new Set(labels).size).toBe(4);
    }
  });
});

describe("set-the-hands island", () => {
  const idx = islandIndex("set");

  it("asks for a time and starts the hands somewhere else", () => {
    for (const { q, setH, setM } of many(idx)) {
      expect(q.digital).toBe(fmt(q.h!, q.m!));
      expect(setH).not.toBe(q.h);
      expect(setH).toBeGreaterThanOrEqual(1);
      expect(setH).toBeLessThanOrEqual(12);
      expect(setM).toBe(0);
    }
  });

  it("honours the minute snap setting", () => {
    for (let i = 0; i < 60; i++) {
      expect(genQ(idx, STR.cs, "cs", 5).q.m! % 5).toBe(0);
    }
    const anyMinute = Array.from({ length: 80 }, () => genQ(idx, STR.cs, "cs", 1).q.m!);
    expect(anyMinute.some((m) => m % 5 !== 0)).toBe(true);
  });
});

describe("prompts and spoken text", () => {
  it("are non-empty in every language on every island", () => {
    for (const lang of LANGS) {
      for (let i = 0; i < ISLANDS.length; i++) {
        const { q } = genQ(i, STR[lang], lang, 5);
        expect(q.prompt.trim().length, `island ${i} prompt (${lang})`).toBeGreaterThan(0);
        expect(q.spoken.trim().length, `island ${i} spoken (${lang})`).toBeGreaterThan(0);
        expect(q.prompt).not.toMatch(/undefined|NaN/);
        expect(q.spoken).not.toMatch(/undefined|NaN/);
      }
    }
  });

  it("uses the requested language, not a fallback", () => {
    const idx = islandIndex("read", "whole");
    expect(genQ(idx, STR.cs, "cs", 5).q.prompt).toBe(STR.cs.whatTime);
    expect(genQ(idx, STR.en, "en", 5).q.prompt).toBe(STR.en.whatTime);
    expect(genQ(idx, STR.es, "es", 5).q.prompt).toBe(STR.es.whatTime);
  });

  it("speaks the set-hands target as words in the chosen language", () => {
    const idx = islandIndex("set");
    for (const lang of LANGS) {
      const { q } = genQ(idx, STR[lang], lang, 5);
      expect(q.spoken.startsWith(STR[lang].setPrompt)).toBe(true);
      // spoken form is words, not digits like "3:05"
      expect(q.spoken).not.toMatch(/\d:\d\d/);
    }
  });
});
