import { describe, expect, it } from "vitest";
import { celestial, fmt, fmt24, from24, hourAngle, minuteAngle, phaseFor, routineAt, starsVisible, timeWords, to24 } from "@game/index.ts";

describe("time formatting", () => {
  it("pads minutes but not hours in 12-hour form", () => {
    expect(fmt(3, 5)).toBe("3:05");
    expect(fmt(12, 0)).toBe("12:00");
    expect(fmt(1, 30)).toBe("1:30");
  });

  it("pads both fields in 24-hour form", () => {
    expect(fmt24(9, 0)).toBe("09:00");
    expect(fmt24(14, 5)).toBe("14:05");
    expect(fmt24(0, 0)).toBe("00:00");
  });
});

describe("hand geometry", () => {
  it("puts the hour hand on the numeral at o'clock", () => {
    expect(hourAngle(12, 0)).toBe(0);
    expect(hourAngle(3, 0)).toBe(90);
    expect(hourAngle(6, 0)).toBe(180);
    expect(hourAngle(9, 0)).toBe(270);
  });

  it("drifts the hour hand as minutes pass", () => {
    expect(hourAngle(3, 30)).toBe(105); // halfway between 3 and 4
    expect(hourAngle(12, 59)).toBeCloseTo(29.5);
  });

  it("moves the minute hand 6° per minute", () => {
    expect(minuteAngle(0)).toBe(0);
    expect(minuteAngle(15)).toBe(90);
    expect(minuteAngle(59)).toBe(354);
  });
});

describe("12/24-hour conversion", () => {
  it("round-trips every hour of the day", () => {
    for (let h24 = 0; h24 < 24; h24++) {
      const { h12, period } = from24(h24);
      expect(h12).toBeGreaterThanOrEqual(1);
      expect(h12).toBeLessThanOrEqual(12);
      expect(to24(h12, period)).toBe(h24);
    }
  });

  it("handles the midnight/noon edges", () => {
    expect(from24(0)).toEqual({ h12: 12, period: "am" });
    expect(from24(12)).toEqual({ h12: 12, period: "pm" });
    expect(to24(12, "am")).toBe(0);
    expect(to24(12, "pm")).toBe(12);
  });
});

describe("timeWords", () => {
  it("uses Czech hour/minute grammar by count", () => {
    expect(timeWords(1, 0, "cs")).toBe("1 hodina");
    expect(timeWords(3, 0, "cs")).toBe("3 hodiny");
    expect(timeWords(5, 0, "cs")).toBe("5 hodin");
    expect(timeWords(2, 1, "cs")).toBe("2 hodiny a 1 minuta");
    expect(timeWords(2, 3, "cs")).toBe("2 hodiny a 3 minuty");
    expect(timeWords(2, 20, "cs")).toBe("2 hodiny a 20 minut");
  });

  it("uses o'clock and the 'oh' filler in English", () => {
    expect(timeWords(3, 0, "en")).toBe("3 o'clock");
    expect(timeWords(3, 5, "en")).toBe("3 oh 5");
    expect(timeWords(3, 20, "en")).toBe("3 20");
  });

  it("uses la una / las N in Spanish", () => {
    expect(timeWords(1, 0, "es")).toBe("la una");
    expect(timeWords(4, 0, "es")).toBe("las 4");
    expect(timeWords(1, 20, "es")).toBe("la una y 20");
    expect(timeWords(4, 20, "es")).toBe("las 4 y 20");
  });

  it("never leaves a placeholder or empty string", () => {
    for (const lang of ["cs", "en", "es"] as const) {
      for (let h = 1; h <= 12; h++) {
        for (const m of [0, 1, 5, 30, 59]) {
          const words = timeWords(h, m, lang);
          expect(words.length).toBeGreaterThan(0);
          expect(words).not.toMatch(/undefined|NaN|\{/);
        }
      }
    }
  });
});

describe("daytime", () => {
  it("maps hours to phases across the whole day", () => {
    expect(phaseFor(3)).toBe("night");
    expect(phaseFor(6)).toBe("dawn");
    expect(phaseFor(9)).toBe("morning");
    expect(phaseFor(12)).toBe("noon");
    expect(phaseFor(15)).toBe("afternoon");
    expect(phaseFor(18)).toBe("dusk");
    expect(phaseFor(21)).toBe("evening");
    expect(phaseFor(23)).toBe("night");
  });

  it("covers every hour with a phase", () => {
    for (let h = 0; h < 24; h++) expect(phaseFor(h)).toBeTruthy();
  });

  it("shows the sun by day and the moon at night", () => {
    expect(celestial(12, 0).isSun).toBe(true);
    expect(celestial(23, 0).isSun).toBe(false);
    expect(celestial(3, 0).isSun).toBe(false);
  });

  it("keeps the sun/moon inside the viewport and arcing overhead", () => {
    for (let h = 0; h < 24; h++) {
      const { x, y } = celestial(h, 30);
      expect(x).toBeGreaterThanOrEqual(12);
      expect(x).toBeLessThanOrEqual(88);
      expect(y).toBeGreaterThanOrEqual(22);
      expect(y).toBeLessThanOrEqual(82);
    }
    // highest at midday, low at the edges of daylight
    expect(celestial(12, 30).y).toBeLessThan(celestial(7, 0).y);
  });

  it("shows stars only in the dark phases", () => {
    expect(starsVisible(23)).toBe(true);
    expect(starsVisible(21)).toBe(true);
    expect(starsVisible(12)).toBe(false);
  });
});

describe("routines", () => {
  it("matches an anchor only at its exact time", () => {
    expect(routineAt(7, 0)?.key).toBe("breakfast");
    expect(routineAt(19, 30)?.key).toBe("bath");
    expect(routineAt(7, 5)).toBeNull();
    expect(routineAt(2, 0)).toBeNull();
  });
});
