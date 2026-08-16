import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ISLANDS, STICKERS, STR, TimeIslandsGame } from "@game/index.ts";
import { spokenUtterances } from "./setup.ts";

const SAVE_KEY = "timeislands_v1";
/** Members join in this order, one per finished level. */
const JOIN_ORDER = ["rumi", "mira", "zoey", "derpy", "sussie", "jinu", "saja"];

const newGame = () => new TimeIslandsGame();

/** Answer the current question correctly and let the 1.2s advance timer run. */
function answerCorrectly(game: TimeIslandsGame): void {
  const q = game.store.get().q!;
  if (q.kind === "set") {
    game.store.setState({ setH: q.h!, setM: q.m! });
    game.checkSet();
  } else {
    game.pick(q.options!.findIndex((o) => o.correct));
  }
  vi.advanceTimersByTime(1300);
}

/** Play an island through to its completion overlay. */
function completeIsland(game: TimeIslandsGame, index: number): void {
  game.start(index);
  for (let i = 0; i < game.total(); i++) answerCorrectly(game);
  vi.advanceTimersByTime(1000);
}

/** Clear all four pairs on the matching board, which counts as 4 correct answers. */
function clearBoard(game: TimeIslandsGame): void {
  const cards = game.store.get().cards;
  for (let pair = 0; pair < 4; pair++) {
    const a = cards.findIndex((c) => c.pair === pair && c.kind === "analog");
    const b = cards.findIndex((c) => c.pair === pair && c.kind === "digital");
    game.tapCard(a);
    game.tapCard(b);
    vi.advanceTimersByTime(800);
  }
}

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

describe("fresh game", () => {
  it("starts in the tutorial with nothing unlocked", () => {
    const game = newGame();
    const s = game.store.get();
    expect(s.screen).toBe("intro");
    expect(s.stickers).toEqual([]);
    expect(game.ownedCount()).toBe(0);
    expect(s.lang).toBe("cs");
    expect(game.guideSticker().id).toBe("derpy");
  });

  it("locks every island except the first", () => {
    const game = newGame();
    expect(game.isLocked(0)).toBe(false);
    for (let i = 1; i < ISLANDS.length; i++) expect(game.isLocked(i)).toBe(true);
  });

  it("skips the tutorial on later visits", () => {
    newGame().exitIntro();
    expect(newGame().store.get().screen).toBe("map");
  });
});

describe("playing a level", () => {
  it("refuses to open a locked island", () => {
    const game = newGame();
    game.start(3);
    expect(game.store.get().screen).not.toBe("play");
  });

  it("counts correct answers and finishes at the target", () => {
    const game = newGame();
    game.start(0);
    expect(game.store.get().screen).toBe("play");
    for (let i = 0; i < game.total() - 1; i++) {
      answerCorrectly(game);
      expect(game.store.get().showComplete).toBe(false);
    }
    answerCorrectly(game);
    vi.advanceTimersByTime(1000);
    expect(game.store.get().showComplete).toBe(true);
    expect(game.store.get().correct).toBe(game.total());
  });

  it("does not advance on a wrong answer, and shows a hint", () => {
    const game = newGame();
    game.start(0);
    const wrong = game.store.get().q!.options!.findIndex((o) => !o.correct);
    game.pick(wrong);
    const s = game.store.get();
    expect(s.correct).toBe(0);
    expect(s.feedback).toBe("wrong");
    expect(s.feedbackText).toBe(STR.cs.hintRead);
  });

  it("ignores extra taps while the correct answer is celebrating", () => {
    const game = newGame();
    game.start(0);
    const q = game.store.get().q!;
    game.pick(q.options!.findIndex((o) => o.correct));
    game.pick(q.options!.findIndex((o) => !o.correct));
    expect(game.store.get().correct).toBe(1);
  });

  it("checks the set-the-hands island against the asked time", () => {
    const game = newGame();
    game.store.setState({ done: Object.fromEntries(ISLANDS.map((i) => [i.id, true])) });
    const setIndex = ISLANDS.findIndex((i) => i.type === "set");
    game.start(setIndex);
    const q = game.store.get().q!;
    game.store.setState({ setH: (q.h! % 12) + 1, setM: q.m! });
    game.checkSet();
    expect(game.store.get().feedback).toBe("wrong");
    game.store.setState({ setH: q.h!, setM: q.m! });
    game.checkSet();
    expect(game.store.get().feedback).toBe("correct");
  });

  it("treats 12 and 0 as the same hour when checking the hands", () => {
    const game = newGame();
    game.store.setState({ done: Object.fromEntries(ISLANDS.map((i) => [i.id, true])) });
    const setIndex = ISLANDS.findIndex((i) => i.type === "set");
    game.start(setIndex);
    game.store.setState({ q: { ...game.store.get().q!, h: 12, m: 0 }, setH: 12, setM: 0 });
    game.checkSet();
    expect(game.store.get().feedback).toBe("correct");
  });

  it("matches pairs and refills the board when it is cleared", () => {
    const game = newGame();
    game.store.setState({ done: Object.fromEntries(ISLANDS.map((i) => [i.id, true])) });
    const matchIndex = ISLANDS.findIndex((i) => i.type === "match");
    game.start(matchIndex);
    clearBoard(game);
    expect(game.store.get().correct).toBe(4);
    expect(game.store.get().cards.every((c) => !c.matched)).toBe(true);
  });

  it("penalises a mismatched pair", () => {
    const game = newGame();
    game.store.setState({ done: Object.fromEntries(ISLANDS.map((i) => [i.id, true])) });
    const matchIndex = ISLANDS.findIndex((i) => i.type === "match");
    game.start(matchIndex);
    const cards = game.store.get().cards;
    const a = cards.findIndex((c) => c.pair === 0 && c.kind === "analog");
    const b = cards.findIndex((c) => c.pair === 1 && c.kind === "digital");
    game.tapCard(a);
    game.tapCard(b);
    const s = game.store.get();
    expect(s.correct).toBe(0);
    expect(s.feedback).toBe("wrong");
    expect(s.sel).toBe(-1);
  });
});

describe("leaving a level mid-answer", () => {
  it("does not pop the completion overlay onto the map", () => {
    const game = newGame();
    game.start(0);
    for (let i = 0; i < game.total() - 1; i++) answerCorrectly(game);
    // answer the last question, then leave before the celebration finishes
    const q = game.store.get().q!;
    game.pick(q.options!.findIndex((o) => o.correct));
    game.goMap();
    vi.advanceTimersByTime(3000);
    const s = game.store.get();
    expect(s.screen).toBe("map");
    expect(s.showComplete).toBe(false);
  });

  it("does not hand out a new question after leaving", () => {
    const game = newGame();
    game.start(0);
    const q = game.store.get().q!;
    game.pick(q.options!.findIndex((o) => o.correct));
    game.goSandbox();
    vi.advanceTimersByTime(3000);
    expect(game.store.get().screen).toBe("sandbox");
    expect(game.store.get().q).toBe(q);
  });

  it("does not let a stale timer disturb a freshly started level", () => {
    const game = newGame();
    game.start(0);
    const first = game.store.get().q!;
    game.pick(first.options!.findIndex((o) => o.correct));
    game.start(0); // restart before the timer fires
    const fresh = game.store.get().q!;
    expect(game.store.get().correct).toBe(0);
    vi.advanceTimersByTime(3000);
    expect(game.store.get().q).toBe(fresh);
    expect(game.store.get().correct).toBe(0);
  });

  it("does not finish a matching board after leaving", () => {
    const game = newGame();
    game.store.setState({ done: Object.fromEntries(ISLANDS.map((i) => [i.id, true])) });
    const matchIndex = ISLANDS.findIndex((i) => i.type === "match");
    game.start(matchIndex);
    game.store.setState({ correct: game.total() - 1 });
    const cards = game.store.get().cards;
    game.tapCard(cards.findIndex((c) => c.pair === 0 && c.kind === "analog"));
    game.tapCard(cards.findIndex((c) => c.pair === 0 && c.kind === "digital"));
    game.goMap();
    vi.advanceTimersByTime(3000);
    expect(game.store.get().showComplete).toBe(false);
  });
});

describe("unlocking and the band", () => {
  it("recruits one member per finished level, in order", () => {
    const game = newGame();
    completeIsland(game, 0);
    expect(game.store.get().earned?.id).toBe(JOIN_ORDER[0]);
    expect(game.store.get().stickers).toEqual([JOIN_ORDER[0]]);

    completeIsland(game, 1);
    expect(game.store.get().earned?.id).toBe(JOIN_ORDER[1]);
    expect(game.ownedCount()).toBe(2);
  });

  it("unlocks the next island when one is finished", () => {
    const game = newGame();
    expect(game.isLocked(1)).toBe(true);
    completeIsland(game, 0);
    expect(game.isLocked(1)).toBe(false);
    expect(game.isLocked(2)).toBe(true);
  });

  it("recruits from replays too, and stops when the band is full", () => {
    const game = newGame();
    for (let i = 0; i < JOIN_ORDER.length; i++) completeIsland(game, 0);
    expect(game.store.get().stickers).toEqual(JOIN_ORDER);
    completeIsland(game, 0);
    expect(game.store.get().earned).toBeNull();
    expect(game.store.get().stickers).toHaveLength(JOIN_ORDER.length);
  });

  it("offers the next island until the last one", () => {
    const game = newGame();
    completeIsland(game, 0);
    expect(game.nextIsland()).toBe(1);
    game.store.setState({ island: ISLANDS.length - 1 });
    expect(game.nextIsland()).toBeNull();
  });

  it("goes straight into the next island", () => {
    const game = newGame();
    completeIsland(game, 0);
    game.goNext();
    const s = game.store.get();
    expect(s.island).toBe(1);
    expect(s.screen).toBe("play");
    expect(s.showComplete).toBe(false);
    expect(s.correct).toBe(0);
  });
});

describe("the guide", () => {
  it("defaults to Derpy and can be switched to any joined member", () => {
    const game = newGame();
    expect(game.guideSticker().id).toBe("derpy");
    completeIsland(game, 0);
    game.setGuide("rumi");
    expect(game.store.get().guide).toBe("rumi");
    expect(game.guideSticker().name).toBe("Rumi");
  });

  it("ignores members that have not joined yet", () => {
    const game = newGame();
    game.setGuide("saja");
    expect(game.store.get().guide).toBe("derpy");
  });

  it("lets the cheat pick anyone", () => {
    const game = newGame();
    game.unlockAll();
    game.setGuide("saja");
    expect(game.store.get().guide).toBe("saja");
  });

  it("survives a reload", () => {
    const game = newGame();
    completeIsland(game, 0);
    game.setGuide("rumi");
    expect(newGame().store.get().guide).toBe("rumi");
  });
});

describe("the iddqd cheat", () => {
  it("opens every island and reveals the whole band without saving it", () => {
    const game = newGame();
    game.unlockAll();
    for (let i = 0; i < ISLANDS.length; i++) expect(game.isLocked(i)).toBe(false);
    expect(game.ownedCount()).toBe(STICKERS.length);
    for (const st of STICKERS) expect(game.ownsSticker(st.id)).toBe(true);
    // nothing earned was written to the save
    expect(JSON.parse(localStorage.getItem(SAVE_KEY)!).stickers).toEqual([]);
    expect(newGame().ownedCount()).toBe(0);
  });
});

describe("saving and restoring", () => {
  const write = (data: Record<string, unknown>) => localStorage.setItem(SAVE_KEY, JSON.stringify(data));

  it("restores progress, band and language", () => {
    write({ lang: "en", done: { whole: true }, stickers: ["rumi"], guide: "rumi", seenIntro: true });
    const game = newGame();
    const s = game.store.get();
    expect(s.lang).toBe("en");
    expect(s.done.whole).toBe(true);
    expect(s.stickers).toEqual(["rumi"]);
    expect(s.guide).toBe("rumi");
    expect(game.isLocked(1)).toBe(false);
  });

  it("rebuilds the band from level progress when member ids were retired", () => {
    // A save from before the roster change: stickers were named after islands.
    write({ lang: "cs", done: { whole: true, half: true }, stickers: ["whole", "half", "cat"], seenIntro: true });
    const game = newGame();
    expect(game.store.get().stickers).toEqual(["rumi", "mira"]);
    expect(game.ownedCount()).toBe(2);
    // and the repair is written back to storage
    expect(JSON.parse(localStorage.getItem(SAVE_KEY)!).stickers).toEqual(["rumi", "mira"]);
  });

  it("migrates renamed member ids", () => {
    write({ lang: "cs", done: { whole: true, half: true, five: true }, stickers: ["nari", "dara", "tiger"], guide: "dara", seenIntro: true });
    const game = newGame();
    expect(game.store.get().stickers).toEqual(["rumi", "mira", "derpy"]);
    expect(game.store.get().guide).toBe("mira");
  });

  it("keeps extra members earned by replaying", () => {
    write({ lang: "cs", done: { whole: true }, stickers: ["rumi", "mira", "zoey"], guide: "zoey", seenIntro: true });
    expect(newGame().store.get().stickers).toEqual(["rumi", "mira", "zoey"]);
  });

  it("falls back to Derpy when the saved guide no longer exists", () => {
    write({ lang: "cs", done: { whole: true }, stickers: ["rumi"], guide: "juju", seenIntro: true });
    expect(newGame().store.get().guide).toBe("derpy");
  });

  it("survives a malformed save", () => {
    write({ lang: "cs", done: "nope", stickers: "nope", seenIntro: true });
    const game = newGame();
    expect(game.store.get().stickers).toEqual([]);
    expect(game.store.get().done).toEqual({});
    expect(game.ownedCount()).toBe(0);
  });

  it("never leaves duplicates in the band", () => {
    write({ lang: "cs", done: { whole: true, half: true }, stickers: ["rumi", "rumi", "nari"], seenIntro: true });
    const stickers = newGame().store.get().stickers;
    expect(new Set(stickers).size).toBe(stickers.length);
  });

  it("persists progress across reloads", () => {
    const game = newGame();
    completeIsland(game, 0);
    const restored = newGame();
    expect(restored.store.get().done.whole).toBe(true);
    expect(restored.store.get().stickers).toEqual(["rumi"]);
    expect(restored.isLocked(1)).toBe(false);
  });
});

describe("language and voice", () => {
  it("stores the chosen language and remembers it", () => {
    const game = newGame();
    game.setLang("es");
    expect(game.store.get().lang).toBe("es");
    expect(newGame().store.get().lang).toBe("es");
  });

  it("speaks in the selected language", () => {
    const game = newGame();
    for (const [lang, tag] of [["cs", "cs-CZ"], ["en", "en-US"], ["es", "es-ES"]] as const) {
      game.setLang(lang);
      spokenUtterances.length = 0;
      game.speak("test");
      expect(spokenUtterances.at(-1)?.lang, `voice for ${lang}`).toBe(tag);
    }
  });

  it("reads the prompt in the selected language when a level starts", () => {
    for (const [lang, tag] of [["cs", "cs-CZ"], ["en", "en-US"], ["es", "es-ES"]] as const) {
      localStorage.clear();
      const game = newGame();
      game.exitIntro();
      game.setLang(lang);
      spokenUtterances.length = 0;
      game.start(0);
      const spoken = spokenUtterances.at(-1)!;
      expect(spoken.lang, `prompt voice for ${lang}`).toBe(tag);
      expect(spoken.text, `prompt text for ${lang}`).toBe(STR[lang].whatTime);
    }
  });

  it("praises in the selected language", () => {
    const game = newGame();
    game.setLang("en");
    game.start(0);
    spokenUtterances.length = 0;
    const q = game.store.get().q!;
    game.pick(q.options!.findIndex((o) => o.correct));
    const spoken = spokenUtterances.at(-1)!;
    expect(spoken.lang).toBe("en-US");
    expect(STR.en.praise).toContain(spoken.text);
  });

  it("hints in the selected language when the answer is wrong", () => {
    const game = newGame();
    game.setLang("es");
    game.start(0);
    game.pick(game.store.get().q!.options!.findIndex((o) => !o.correct));
    expect(game.store.get().feedbackText).toBe(STR.es.hintRead);
    expect(spokenUtterances.at(-1)).toMatchObject({ text: STR.es.tryAgain, lang: "es-ES" });
  });

  it("re-reads the question in the new language after switching", () => {
    const game = newGame();
    game.exitIntro();
    game.start(0);
    game.goMap();
    game.setLang("en");
    game.start(0);
    const s = game.store.get();
    expect(s.q!.prompt).toBe(STR.en.whatTime);
    expect(spokenUtterances.at(-1)?.lang).toBe("en-US");
  });

  it("speaks the sandbox clock as words in the selected language", () => {
    const game = newGame();
    game.setLang("es");
    game.goSandbox();
    game.store.setState({ sbH: 1, sbM: 0 });
    spokenUtterances.length = 0;
    game.speakSandbox();
    expect(spokenUtterances.at(-1)).toMatchObject({ text: "la una", lang: "es-ES" });
  });

  it("reads tutorial steps in the selected language", () => {
    const game = newGame();
    game.setLang("en");
    spokenUtterances.length = 0;
    game.goIntro();
    const spoken = spokenUtterances.at(-1)!;
    expect(spoken.lang).toBe("en-US");
    expect(spoken.text).toContain(STR.en.introSteps[0]!.title);
  });

  it("switches the whole UI vocabulary at once", () => {
    const game = newGame();
    game.setLang("en");
    expect(game.T()).toBe(STR.en);
    game.setLang("cs");
    expect(game.T()).toBe(STR.cs);
  });
});

describe("character voices", () => {
  it("gives every band member a voice profile", () => {
    for (const st of STICKERS) {
      expect(st.voice, `${st.id} has no voice`).toBeDefined();
      expect(st.voice!.pitch!).toBeGreaterThan(0);
      expect(st.voice!.pitch!).toBeLessThanOrEqual(2);
      expect(st.voice!.rate!).toBeGreaterThan(0);
    }
  });

  it("makes the members sound distinct from one another", () => {
    const signatures = STICKERS.map((s) => `${s.voice!.pitch}/${s.voice!.rate}`);
    expect(new Set(signatures).size).toBe(STICKERS.length);
  });

  it("speaks in the current guide's voice", () => {
    const game = newGame();
    game.unlockAll();

    game.setGuide("jinu");
    spokenUtterances.length = 0;
    game.speak("test");
    const jinu = spokenUtterances.at(-1)!;

    game.setGuide("zoey");
    spokenUtterances.length = 0;
    game.speak("test");
    const zoey = spokenUtterances.at(-1)!;

    const jinuVoice = STICKERS.find((s) => s.id === "jinu")!.voice!;
    const zoeyVoice = STICKERS.find((s) => s.id === "zoey")!.voice!;
    expect(jinu.pitch).toBe(jinuVoice.pitch);
    expect(zoey.pitch).toBe(zoeyVoice.pitch);
    expect(jinu.pitch).toBeLessThan(zoey.pitch); // the boy reads lower than the maknae
  });

  it("keeps the voice when the language changes", () => {
    const game = newGame();
    game.unlockAll();
    game.setGuide("jinu");
    const pitch = STICKERS.find((s) => s.id === "jinu")!.voice!.pitch;
    for (const [lang, tag] of [["cs", "cs-CZ"], ["en", "en-US"], ["es", "es-ES"]] as const) {
      game.setLang(lang);
      spokenUtterances.length = 0;
      game.speak("test");
      expect(spokenUtterances.at(-1)).toMatchObject({ lang: tag, pitch });
    }
  });

  it("uses the new guide's voice for the praise that follows", () => {
    const game = newGame();
    game.unlockAll();
    game.setGuide("sussie");
    game.start(0);
    spokenUtterances.length = 0;
    const q = game.store.get().q!;
    game.pick(q.options!.findIndex((o) => o.correct));
    expect(spokenUtterances.at(-1)?.pitch).toBe(STICKERS.find((s) => s.id === "sussie")!.voice!.pitch);
  });
});

describe("sandbox", () => {
  it("opens on the current time and turns live mode off", () => {
    const game = newGame();
    game.goSandbox();
    const s = game.store.get();
    expect(s.screen).toBe("sandbox");
    expect(s.sbLive).toBe(false);
    expect(s.sbH).toBeGreaterThanOrEqual(1);
    expect(s.sbH).toBeLessThanOrEqual(12);
  });

  it("toggles am/pm and beginner mode", () => {
    const game = newGame();
    game.goSandbox();
    const period = game.store.get().sbPeriod;
    game.toggleSbPeriod();
    expect(game.store.get().sbPeriod).not.toBe(period);

    game.store.setState({ sbM: 25 });
    game.toggleSbHideMin();
    expect(game.store.get()).toMatchObject({ sbHideMin: true, sbM: 0 });
    game.toggleSbHideMin();
    expect(game.store.get().sbHideMin).toBe(false);
  });
});

describe("tutorial", () => {
  it("steps forward and back, then leaves for the map", () => {
    const game = newGame();
    game.goIntro();
    expect(game.store.get().introStep).toBe(0);
    game.introNext();
    expect(game.store.get().introStep).toBe(1);
    game.introPrev();
    expect(game.store.get().introStep).toBe(0);
    game.introPrev();
    expect(game.store.get().screen).toBe("map");
  });

  it("ends on the map after the last step and is not shown again", () => {
    const game = newGame();
    game.goIntro();
    for (let i = 0; i < game.introStepCount(); i++) game.introNext();
    expect(game.store.get().screen).toBe("map");
    expect(newGame().store.get().screen).toBe("map");
  });
});
