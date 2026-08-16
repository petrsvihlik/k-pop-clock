import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ISLANDS, TimeIslandsGame } from "@game/index.ts";

const newGame = () => new TimeIslandsGame();

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

/** A fake clock SVG whose geometry maps pointer coords onto hand angles. */
const fakeSvg = () =>
  ({
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 200, height: 200 }),
    setPointerCapture: () => {},
  }) as unknown as SVGSVGElement;

/** Pointer event at a viewBox coordinate. */
const at = (x: number, y: number) => ({ clientX: x, clientY: y, pointerId: 1 }) as PointerEvent;

describe("probe: beginner mode in the sandbox", () => {
  it("keeps minutes at zero while the minute hand is hidden", () => {
    const game = newGame();
    game.goSandbox();
    game.store.setState({ sbM: 25 });
    game.toggleSbHideMin();
    expect(game.store.get().sbM).toBe(0);
    // "now" must not smuggle real minutes back in while minutes are hidden
    game.setSandboxNow();
    expect(game.store.get().sbM).toBe(0);
  });

  it("keeps minutes at zero while live mode is ticking", () => {
    const game = newGame();
    game.goSandbox();
    game.toggleSbHideMin();
    game.toggleSbLive(); // live mode re-reads the wall clock
    expect(game.store.get().sbM).toBe(0);
  });
});

describe("probe: dragging across screens", () => {
  it("does not let a drag started in the sandbox move the level's hands", () => {
    const game = newGame();
    game.goSandbox();
    const svg = fakeSvg();
    // press on the minute hand and hold — no pointerup
    game.sbHandDown(at(100, 10), svg);
    game.goMap();
    game.start(0);
    const before = game.store.get();
    // hovering over the level clock must not drag anything
    game.handMove(at(190, 100), svg);
    const after = game.store.get();
    expect(after.sbH).toBe(before.sbH);
    expect(after.sbM).toBe(before.sbM);
    expect(after.setH).toBe(before.setH);
    expect(after.setM).toBe(before.setM);
  });

  it("does not let a drag started in a level move the sandbox hands", () => {
    const game = newGame();
    game.store.setState({ done: Object.fromEntries(ISLANDS.map((i) => [i.id, true])) });
    game.start(ISLANDS.findIndex((i) => i.type === "set"));
    const svg = fakeSvg();
    game.handDown(at(100, 10), svg);
    game.goSandbox();
    const before = game.store.get();
    game.handMove(at(190, 100), svg);
    const after = game.store.get();
    expect(after.sbH).toBe(before.sbH);
    expect(after.sbM).toBe(before.sbM);
  });
});

describe("probe: defensive behaviour", () => {
  it("ignores hand-dragging outside a set-the-hands level", () => {
    const game = newGame();
    game.start(0); // a "read" island
    const svg = fakeSvg();
    const before = game.store.get().setH;
    game.handDown(at(100, 10), svg);
    game.handMove(at(190, 100), svg);
    expect(game.store.get().setH).toBe(before);
  });

  it("ignores an out-of-range answer index", () => {
    const game = newGame();
    game.start(0);
    expect(() => game.pick(99)).not.toThrow();
    expect(() => game.pick(-1)).not.toThrow();
    expect(game.store.get().correct).toBe(0);
  });

  it("ignores checkSet when no question is loaded", () => {
    const game = newGame();
    expect(() => game.checkSet()).not.toThrow();
  });

  it("ignores an out-of-range card tap", () => {
    const game = newGame();
    game.store.setState({ done: Object.fromEntries(ISLANDS.map((i) => [i.id, true])) });
    game.start(ISLANDS.findIndex((i) => i.type === "match"));
    expect(() => game.tapCard(99)).not.toThrow();
  });

  it("deselects a card when it is tapped twice", () => {
    const game = newGame();
    game.store.setState({ done: Object.fromEntries(ISLANDS.map((i) => [i.id, true])) });
    game.start(ISLANDS.findIndex((i) => i.type === "match"));
    game.tapCard(0);
    expect(game.store.get().sel).toBe(0);
    game.tapCard(0);
    expect(game.store.get().sel).toBe(-1);
  });

  it("stays put when there is no next island", () => {
    const game = newGame();
    game.store.setState({ done: Object.fromEntries(ISLANDS.map((i) => [i.id, true])), island: ISLANDS.length - 1 });
    expect(game.nextIsland()).toBeNull();
    game.goNext();
    expect(game.store.get().island).toBe(ISLANDS.length - 1);
  });

  it("treats a repeated guide pick as a no-op", () => {
    const game = newGame();
    game.unlockAll();
    game.setGuide("rumi");
    const first = game.store.get();
    game.setGuide("rumi");
    expect(game.store.get().guide).toBe("rumi");
    expect(game.store.get()).toBe(first);
  });

  it("applies the cheat only once", () => {
    const game = newGame();
    game.unlockAll();
    const after = game.store.get();
    game.unlockAll();
    expect(game.store.get()).toBe(after);
  });
});
