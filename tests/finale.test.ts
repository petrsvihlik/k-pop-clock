import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ISLANDS, STICKERS, STR, TimeIslandsGame } from "@game/index.ts";
import { genQ } from "@game/questions.ts";
import { spokenUtterances } from "./setup.ts";

const newGame = () => new TimeIslandsGame();
const allDone = () => Object.fromEntries(ISLANDS.map((i) => [i.id, true]));

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("the closing concert", () => {
  it("stays locked until every island is finished", () => {
    const game = newGame();
    expect(game.allIslandsDone()).toBe(false);
    game.goFinale();
    expect(game.store.get().screen).not.toBe("finale");

    // all but the last
    const done = allDone();
    delete done[ISLANDS.at(-1)!.id];
    game.store.setState({ done });
    expect(game.allIslandsDone()).toBe(false);
    game.goFinale();
    expect(game.store.get().screen).not.toBe("finale");
  });

  it("opens once the last island is finished", () => {
    const game = newGame();
    game.store.setState({ done: allDone() });
    expect(game.allIslandsDone()).toBe(true);
    game.goFinale();
    expect(game.store.get().screen).toBe("finale");
  });

  it("opens for the cheat too", () => {
    const game = newGame();
    game.unlockAll();
    expect(game.allIslandsDone()).toBe(true);
    game.goFinale();
    expect(game.store.get().screen).toBe("finale");
  });

  it("clears the completion overlay on the way in", () => {
    const game = newGame();
    game.store.setState({ done: allDone(), showComplete: true });
    game.goFinale();
    expect(game.store.get().showComplete).toBe(false);
  });

  it("chants in the current language's voice", () => {
    const game = newGame();
    game.store.setState({ done: allDone() });
    for (const [lang, tag] of [["cs", "cs-CZ"], ["en", "en-US"], ["es", "es-ES"]] as const) {
      game.setLang(lang);
      game.goMap();
      spokenUtterances.length = 0;
      game.goFinale();
      expect(spokenUtterances.at(-1)).toMatchObject({ text: STR[lang].finaleChant, lang: tag });
    }
  });

  it("leaves back to the map", () => {
    const game = newGame();
    game.store.setState({ done: allDone() });
    game.goFinale();
    game.goMap();
    expect(game.store.get().screen).toBe("map");
  });

  it("keeps the same chant text in every language", () => {
    const chants = new Set((["cs", "en", "es"] as const).map((l) => STR[l].finaleChant));
    expect(chants.size).toBe(1);
    expect([...chants][0]).toContain("DONE");
  });
});

describe("extensibility: adding an island later", () => {
  it("derives the join order from the roster, with no second list to sync", async () => {
    // A duplicated list would drift the moment a member is added or reordered.
    const src = await import("@game/game.ts");
    expect(src.TimeIslandsGame).toBeDefined();
    const game = newGame();
    // The first member to join is whoever leads the roster.
    game.start(0);
    for (let i = 0; i < game.total(); i++) {
      const q = game.store.get().q!;
      game.pick(q.options!.findIndex((o) => o.correct));
      vi.advanceTimersByTime(1300);
    }
    vi.advanceTimersByTime(1000);
    expect(game.store.get().earned!.id).toBe(STICKERS[0]!.id);
  });

  it("scales the level chain to however many islands exist", () => {
    const game = newGame();
    expect(game.isLocked(ISLANDS.length - 1)).toBe(ISLANDS.length > 1);
    game.store.setState({ done: allDone() });
    for (let i = 0; i < ISLANDS.length; i++) expect(game.isLocked(i)).toBe(false);
    // the last island is the end of the chain, whatever its index
    game.store.setState({ island: ISLANDS.length - 1 });
    expect(game.nextIsland()).toBeNull();
    game.store.setState({ island: 0 });
    expect(game.nextIsland()).toBe(ISLANDS.length > 1 ? 1 : null);
  });

  it("generates a playable question for every island in the list", () => {
    for (let i = 0; i < ISLANDS.length; i++) {
      for (const lang of ["cs", "en", "es"] as const) {
        const { q, cards } = genQ(i, STR[lang], lang, 5);
        expect(q.kind, `island ${i}`).toBe(ISLANDS[i]!.type);
        expect(q.prompt.length).toBeGreaterThan(0);
        // every island must give the player something to act on
        const actionable = (q.options?.length ?? 0) > 0 || cards.length > 0 || q.kind === "set";
        expect(actionable, `island ${i} (${ISLANDS[i]!.type}) has nothing to answer`).toBe(true);
      }
    }
  });

  it("gives every island a hint in every language", () => {
    const game = newGame();
    game.unlockAll();
    for (let i = 0; i < ISLANDS.length; i++) {
      for (const lang of ["cs", "en", "es"] as const) {
        game.setLang(lang);
        game.start(i);
        const q = game.store.get().q!;
        if (q.kind === "set" || q.kind === "match") continue;
        game.pick(q.options!.findIndex((o) => !o.correct));
        const hint = game.store.get().feedbackText;
        expect(hint.length, `island ${i} hint (${lang})`).toBeGreaterThan(0);
      }
    }
  });
});
