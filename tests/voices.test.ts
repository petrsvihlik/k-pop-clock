/**
 * Every band member must sound like who they are: the girls read with a female
 * voice, the boys with a male one. The whole chain is checked here — the roster
 * declares a preference, the controller passes the guide's profile through, and
 * `Speech` resolves it against the platform's voice list.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LANGS, SPEECH_LANG, STICKERS, TimeIslandsGame } from "@game/index.ts";
import { availableVoices, spokenUtterances } from "./setup.ts";

/** Who each member is, independent of how they happen to be drawn. */
const GENDER: Record<string, "female" | "male"> = {
  rumi: "female",
  mira: "female",
  zoey: "female",
  derpy: "male",
  sussie: "female",
  jinu: "male",
  saja: "male",
};

/** A platform that offers both a male and a female voice per language. */
const BOTH_GENDERS = [
  { name: "Zuzana", lang: "cs-CZ" },
  { name: "Matej", lang: "cs-CZ" },
  { name: "Samantha", lang: "en-US" },
  { name: "Daniel", lang: "en-US" },
  { name: "Monica", lang: "es-ES" },
  { name: "Jorge", lang: "es-ES" },
];
const FEMALE_NAMES = ["Zuzana", "Samantha", "Monica"];
const MALE_NAMES = ["Matej", "Daniel", "Jorge"];

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("voice casting", () => {
  it("covers every member of the roster", () => {
    expect(Object.keys(GENDER).sort()).toEqual(STICKERS.map((s) => s.id).sort());
  });

  it("declares a gender preference for every member", () => {
    for (const st of STICKERS) {
      expect(st.voice?.prefer, `${st.id} has no voice gender`).toBeDefined();
      expect(st.voice!.prefer, `${st.id}`).toBe(GENDER[st.id]);
    }
  });

  it("speaks each member in a voice of their own gender, in every language", () => {
    availableVoices.list = BOTH_GENDERS;
    const game = new TimeIslandsGame();
    game.unlockAll();

    for (const st of STICKERS) {
      game.setGuide(st.id);
      for (const lang of LANGS) {
        game.setLang(lang);
        spokenUtterances.length = 0;
        game.speak("test");
        const spoken = spokenUtterances.at(-1)!;
        const wanted = GENDER[st.id] === "female" ? FEMALE_NAMES : MALE_NAMES;
        expect(spoken.lang, `${st.id} in ${lang}`).toBe(SPEECH_LANG[lang]);
        expect(wanted, `${st.id} in ${lang} used ${spoken.voiceName}`).toContain(spoken.voiceName);
        expect(spoken.pitch, `${st.id} pitch`).toBe(st.voice!.pitch);
      }
    }
  });

  it("still speaks when the language offers only one voice", () => {
    // Czech typically ships a single female voice: the boys must still be heard.
    availableVoices.list = [{ name: "Zuzana", lang: "cs-CZ" }];
    const game = new TimeIslandsGame();
    game.unlockAll();
    game.setLang("cs");
    for (const st of STICKERS) {
      game.setGuide(st.id);
      spokenUtterances.length = 0;
      game.speak("test");
      const spoken = spokenUtterances.at(-1)!;
      expect(spoken.voiceName, st.id).toBe("Zuzana");
      // pitch still separates them when the voice cannot
      expect(spoken.pitch, st.id).toBe(st.voice!.pitch);
    }
  });

  it("separates the boys from the girls by pitch as a fallback", () => {
    // With one shared voice, pitch is the only cue — the boys must read lower
    // than the girls they stand next to, ignoring the deliberately childlike one.
    const pitchOf = (id: string) => STICKERS.find((s) => s.id === id)!.voice!.pitch!;
    const grown = { men: ["jinu", "derpy"], women: ["rumi", "mira", "zoey", "sussie"] };
    const highestMan = Math.max(...grown.men.map(pitchOf));
    const lowestWoman = Math.min(...grown.women.map(pitchOf));
    expect(highestMan).toBeLessThan(lowestWoman);
  });

  it("gives every member a distinct voice signature", () => {
    const sig = STICKERS.map((s) => `${s.voice!.prefer}/${s.voice!.pitch}/${s.voice!.rate}`);
    expect(new Set(sig).size).toBe(STICKERS.length);
  });
});
