import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ISLANDS, STICKERS, STR, TimeIslandsGame, fmt, from24, to24 } from "@game/index.ts";
import { genQ } from "@game/questions.ts";
import { spokenUtterances } from "./setup.ts";

const newGame = () => new TimeIslandsGame();

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const fakeSvg = () =>
  ({
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 200, height: 200 }),
    setPointerCapture: () => {},
  }) as unknown as SVGSVGElement;
const at = (x: number, y: number) => ({ clientX: x, clientY: y, pointerId: 1 }) as PointerEvent;

describe("probe: dragging the hands", () => {
  const setGame = () => {
    const game = newGame();
    game.store.setState({ done: Object.fromEntries(ISLANDS.map((i) => [i.id, true])) });
    game.start(ISLANDS.findIndex((i) => i.type === "set"));
    return game;
  };

  it("maps the twelve o'clock direction to hour 12, not 0", () => {
    const game = setGame();
    const svg = fakeSvg();
    game.handDown(at(100, 60), svg); // straight up, inside the hour zone
    expect(game.store.get().setH).toBe(12);
  });

  it("sets the hour by direction around the dial", () => {
    const cases: Array<[number, number, number]> = [
      [100, 60, 12],
      [140, 100, 3],
      [100, 140, 6],
      [60, 100, 9],
    ];
    for (const [x, y, hour] of cases) {
      const game = setGame();
      game.handDown(at(x, y), fakeSvg());
      expect(game.store.get().setH, `(${x},${y})`).toBe(hour);
    }
  });

  it("snaps minutes to the configured granularity", () => {
    const game = setGame();
    const svg = fakeSvg();
    for (const [x, y] of [[100, 5], [195, 100], [100, 195], [5, 100], [160, 30]] as const) {
      game.handDown(at(x, y), svg);
      const m = game.store.get().setM;
      expect(m % 5, `minute ${m}`).toBe(0);
      expect(m).toBeGreaterThanOrEqual(0);
      expect(m).toBeLessThan(60);
    }
  });

  it("ignores a press outside the dial", () => {
    const game = setGame();
    const svg = fakeSvg();
    const before = { h: game.store.get().setH, m: game.store.get().setM };
    game.handDown(at(199, 199), svg); // far corner, outside the face
    expect(game.store.get().setH).toBe(before.h);
    expect(game.store.get().setM).toBe(before.m);
  });

  it("moves only the hour hand in beginner mode", () => {
    const game = newGame();
    game.goSandbox();
    game.toggleSbHideMin();
    const svg = fakeSvg();
    const before = game.store.get().sbM;
    game.sbHandDown(at(100, 8), svg); // out at the rim, where the minute hand lives
    expect(game.store.get().sbM).toBe(before);
    expect(game.store.get().sbH).toBe(12);
  });

  it("turns live mode off as soon as the child grabs a hand", () => {
    const game = newGame();
    game.goSandbox();
    game.toggleSbLive();
    expect(game.store.get().sbLive).toBe(true);
    game.sbHandDown(at(140, 100), fakeSvg());
    expect(game.store.get().sbLive).toBe(false);
  });
});

describe("probe: question invariants", () => {
  it("never offers a distractor that is also correct", () => {
    for (let i = 0; i < ISLANDS.length; i++) {
      for (let n = 0; n < 40; n++) {
        const { q } = genQ(i, STR.cs, "cs", 5);
        if (!q.options) continue;
        const correct = q.options.filter((o) => o.correct);
        expect(correct).toHaveLength(1);
        const others = q.options.filter((o) => !o.correct);
        for (const o of others) {
          if (o.label !== undefined) expect(o.label).not.toBe(correct[0]!.label);
          else expect(`${o.hA}/${o.mA}`).not.toBe(`${correct[0]!.hA}/${correct[0]!.mA}`);
        }
      }
    }
  });

  it("keeps the digital-24 label and the correct clock in agreement", () => {
    const idx = ISLANDS.findIndex((i) => i.type === "dig24");
    for (let n = 0; n < 60; n++) {
      const { q } = genQ(idx, STR.cs, "cs", 5);
      const [hh] = q.digital!.split(":").map(Number);
      expect(hh).toBe(q.h);
      const { h12 } = from24(hh!);
      expect(q.options!.find((o) => o.correct)!.hA).toBe((h12 % 12) * 30);
      expect(to24(h12, hh! < 12 ? "am" : "pm")).toBe(hh);
    }
  });

  it("never asks for a time the hands cannot express", () => {
    const idx = ISLANDS.findIndex((i) => i.type === "set");
    for (let n = 0; n < 60; n++) {
      const { q } = genQ(idx, STR.cs, "cs", 5);
      expect(q.h).toBeGreaterThanOrEqual(1);
      expect(q.h).toBeLessThanOrEqual(12);
      expect(q.m).toBeGreaterThanOrEqual(0);
      expect(q.m).toBeLessThan(60);
      expect(q.digital).toBe(fmt(q.h!, q.m!));
    }
  });
});

describe("probe: the guide and the band", () => {
  it("keeps the band in join order, never duplicating a member", () => {
    const game = newGame();
    for (let round = 0; round < STICKERS.length + 2; round++) {
      game.start(0);
      for (let i = 0; i < game.total(); i++) {
        const q = game.store.get().q!;
        game.pick(q.options!.findIndex((o) => o.correct));
        vi.advanceTimersByTime(1300);
      }
      vi.advanceTimersByTime(1000);
      const ids = game.store.get().stickers;
      expect(new Set(ids).size, "duplicate member").toBe(ids.length);
      for (const id of ids) expect(STICKERS.some((s) => s.id === id)).toBe(true);
    }
    expect(game.store.get().stickers).toHaveLength(STICKERS.length);
  });

  it("always has a guide that exists, even mid-progress", () => {
    const game = newGame();
    expect(STICKERS.some((s) => s.id === game.guideSticker().id)).toBe(true);
    game.unlockAll();
    for (const st of STICKERS) {
      game.setGuide(st.id);
      expect(game.guideSticker().id).toBe(st.id);
      expect(game.guideSticker().voice).toBeDefined();
    }
  });

  it("speaks with the guide's voice on every screen that talks", () => {
    const game = newGame();
    game.unlockAll();
    game.setGuide("jinu");
    const pitch = STICKERS.find((s) => s.id === "jinu")!.voice!.pitch;

    for (const act of [
      () => game.start(0),
      () => game.goIntro(),
      () => {
        game.goSandbox();
        game.speakSandbox();
      },
    ]) {
      spokenUtterances.length = 0;
      act();
      expect(spokenUtterances.at(-1)?.pitch).toBe(pitch);
    }
  });
});

describe("probe: replaying a finished island", () => {
  it("does not re-award a member already in the band", () => {
    const game = newGame();
    game.start(0);
    for (let i = 0; i < game.total(); i++) {
      const q = game.store.get().q!;
      game.pick(q.options!.findIndex((o) => o.correct));
      vi.advanceTimersByTime(1300);
    }
    vi.advanceTimersByTime(1000);
    const first = game.store.get().earned!.id;

    game.replay();
    for (let i = 0; i < game.total(); i++) {
      const q = game.store.get().q!;
      game.pick(q.options!.findIndex((o) => o.correct));
      vi.advanceTimersByTime(1300);
    }
    vi.advanceTimersByTime(1000);
    expect(game.store.get().earned!.id).not.toBe(first);
    expect(game.store.get().stickers.filter((id) => id === first)).toHaveLength(1);
  });
});
