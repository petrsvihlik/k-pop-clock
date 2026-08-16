/**
 * Content integrity for the three languages. TypeScript enforces the flat
 * `Strings` fields, but the keyed records (`islands`, `phaseNames`,
 * `routineNames`) are open maps — a missing island name would only show up as a
 * blank label at runtime, so it is checked here.
 */
import { describe, expect, it } from "vitest";
import { ISLANDS, LANGS, ROUTINES, SPEECH_LANG, STICKERS, STR, phaseFor } from "@game/index.ts";

const PHASES = Array.from({ length: 24 }, (_, h) => phaseFor(h)).filter(
  (p, i, all) => all.indexOf(p) === i,
);

describe("languages", () => {
  it("ships exactly the languages the UI offers", () => {
    expect([...LANGS].sort()).toEqual(["cs", "en", "es"]);
    for (const lang of LANGS) expect(STR[lang]).toBeDefined();
  });

  it("gives every language a distinct BCP-47 voice tag", () => {
    const tags = LANGS.map((l) => SPEECH_LANG[l]);
    expect(tags).toEqual(["cs-CZ", "en-US", "es-ES"]);
    expect(new Set(tags).size).toBe(LANGS.length);
    for (const tag of tags) expect(tag).toMatch(/^[a-z]{2}-[A-Z]{2}$/);
  });

  it("has the same set of keys in every language", () => {
    const reference = Object.keys(STR.cs).sort();
    for (const lang of LANGS) {
      expect(Object.keys(STR[lang]).sort(), `keys for ${lang}`).toEqual(reference);
    }
  });

  it("has no empty or placeholder strings", () => {
    for (const lang of LANGS) {
      for (const [key, value] of Object.entries(STR[lang])) {
        if (typeof value !== "string") continue;
        expect(value.trim().length, `${lang}.${key}`).toBeGreaterThan(0);
        expect(value, `${lang}.${key}`).not.toMatch(/^TODO|undefined/);
      }
    }
  });

  it("names every island in every language", () => {
    for (const lang of LANGS) {
      for (const isl of ISLANDS) {
        expect(STR[lang].islands[isl.id]?.trim(), `${lang}.islands.${isl.id}`).toBeTruthy();
      }
    }
  });

  it("names every day phase and routine in every language", () => {
    for (const lang of LANGS) {
      for (const phase of PHASES) {
        expect(STR[lang].phaseNames[phase]?.trim(), `${lang}.phaseNames.${phase}`).toBeTruthy();
      }
      for (const routine of ROUTINES) {
        expect(STR[lang].routineNames[routine.key]?.trim(), `${lang}.routineNames.${routine.key}`).toBeTruthy();
      }
    }
  });

  it("keeps the tutorial the same length everywhere, with filled-in steps", () => {
    const steps = STR.cs.introSteps.length;
    expect(steps).toBeGreaterThan(0);
    for (const lang of LANGS) {
      expect(STR[lang].introSteps, `introSteps for ${lang}`).toHaveLength(steps);
      for (const step of STR[lang].introSteps) {
        expect(step.title.trim().length).toBeGreaterThan(0);
        expect(step.body.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("offers praise lines in every language", () => {
    for (const lang of LANGS) {
      expect(STR[lang].praise.length).toBeGreaterThan(0);
      for (const line of STR[lang].praise) expect(line.trim().length).toBeGreaterThan(0);
    }
  });

  it("translates the routine template with its placeholder intact", () => {
    for (const lang of LANGS) expect(STR[lang].routineNow).toContain("{name}");
  });
});

describe("game content", () => {
  it("has unique island ids", () => {
    const ids = ISLANDS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has unique band-member ids and names", () => {
    const ids = STICKERS.map((s) => s.id);
    const names = STICKERS.map((s) => s.name);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(names).size).toBe(names.length);
  });

  it("gives every band member a colour and a name", () => {
    for (const st of STICKERS) {
      expect(st.name.trim().length, st.id).toBeGreaterThan(0);
      expect(st.color, st.id).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it("keeps every colour a valid hex value", () => {
    for (const st of STICKERS) {
      for (const [key, value] of Object.entries(st)) {
        if (typeof value !== "string" || !value.startsWith("#")) continue;
        expect(value, `${st.id}.${key}`).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    }
    for (const isl of ISLANDS) expect(isl.color, isl.id).toMatch(/^#[0-9a-fA-F]{6}$/);
  });
});
