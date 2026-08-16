import { describe, expect, it, vi } from "vitest";
import { LocalSave, Speech, Store, pick, randInt, shuffle } from "@engine/index.ts";
import { availableVoices, resetSpeechSpy, spokenUtterances, speechCancels } from "./setup.ts";

describe("Store", () => {
  it("merges patches instead of replacing state", () => {
    const store = new Store({ a: 1, b: "x" });
    store.setState({ a: 2 });
    expect(store.get()).toEqual({ a: 2, b: "x" });
  });

  it("accepts an updater function that sees the previous state", () => {
    const store = new Store({ n: 1 });
    store.setState((prev) => ({ n: prev.n + 5 }));
    expect(store.get().n).toBe(6);
  });

  it("notifies subscribers, and stops after unsubscribe", () => {
    const store = new Store({ n: 0 });
    const seen: number[] = [];
    const off = store.subscribe(() => seen.push(store.get().n));
    store.setState({ n: 1 });
    store.setState({ n: 2 });
    off();
    store.setState({ n: 3 });
    expect(seen).toEqual([1, 2]);
    expect(store.get().n).toBe(3);
  });

  it("runs the callback after listeners see the new state", () => {
    const store = new Store({ n: 0 });
    const order: string[] = [];
    store.subscribe(() => order.push(`listener:${store.get().n}`));
    store.setState({ n: 7 }, () => order.push(`callback:${store.get().n}`));
    expect(order).toEqual(["listener:7", "callback:7"]);
  });

  it("replaces state objects rather than mutating them", () => {
    const store = new Store({ n: 1 });
    const before = store.get();
    store.setState({ n: 2 });
    expect(before.n).toBe(1);
    expect(store.get()).not.toBe(before);
  });
});

describe("LocalSave", () => {
  const key = "test_save";

  it("returns defaults when nothing is stored", () => {
    expect(new LocalSave({ key, defaults: { a: 1 } }).load()).toEqual({ a: 1 });
  });

  it("round-trips saved data", () => {
    const save = new LocalSave({ key, defaults: { a: 1, b: 2 } });
    save.save({ a: 9, b: 8 });
    expect(new LocalSave({ key, defaults: { a: 1, b: 2 } }).load()).toEqual({ a: 9, b: 8 });
  });

  it("overlays stored fields on defaults so new fields appear", () => {
    localStorage.setItem(key, JSON.stringify({ a: 9 }));
    expect(new LocalSave({ key, defaults: { a: 1, b: "new" } }).load()).toEqual({ a: 9, b: "new" });
  });

  it("falls back to defaults on unparseable data instead of throwing", () => {
    localStorage.setItem(key, "{not json");
    expect(new LocalSave({ key, defaults: { a: 1 } }).load()).toEqual({ a: 1 });
  });

  it("applies a migration before overlaying", () => {
    localStorage.setItem(key, JSON.stringify({ old: 5 }));
    const save = new LocalSave<{ n: number }>({
      key,
      defaults: { n: 0 },
      migrate: (raw) => ({ n: (raw as { old: number }).old }),
    });
    expect(save.load()).toEqual({ n: 5 });
  });

  it("clears stored data", () => {
    const save = new LocalSave({ key, defaults: { a: 1 } });
    save.save({ a: 2 });
    save.clear();
    expect(save.load()).toEqual({ a: 1 });
  });

  it("degrades to defaults when storage throws (private mode)", () => {
    const spy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("denied");
    });
    expect(new LocalSave({ key, defaults: { a: 1 } }).load()).toEqual({ a: 1 });
    spy.mockRestore();
  });

  it("does not throw when saving is denied", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("full");
    });
    expect(() => new LocalSave({ key, defaults: { a: 1 } }).save({ a: 2 })).not.toThrow();
    spy.mockRestore();
  });
});

describe("rng", () => {
  it("randInt stays in [0, n)", () => {
    for (let i = 0; i < 200; i++) {
      const v = randInt(12);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(12);
      expect(Number.isInteger(v)).toBe(true);
    }
  });

  it("pick returns a member of the array", () => {
    const arr = ["a", "b", "c"] as const;
    for (let i = 0; i < 50; i++) expect(arr).toContain(pick(arr));
  });

  it("shuffle keeps every element and leaves the input untouched", () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffle(input);
    expect(out).not.toBe(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
    expect([...out].sort()).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("Speech", () => {
  it("speaks with the given language tag and cancels prior speech", () => {
    resetSpeechSpy();
    new Speech(true).speak("ahoj", "cs-CZ");
    expect(spokenUtterances).toMatchObject([{ text: "ahoj", lang: "cs-CZ", rate: 0.95, pitch: 1 }]);
    expect(speechCancels.count).toBe(1);
  });

  it("applies a character's pitch and rate", () => {
    resetSpeechSpy();
    new Speech(true).speak("hi", "cs-CZ", { pitch: 1.6, rate: 1.1 });
    expect(spokenUtterances.at(-1)).toMatchObject({ pitch: 1.6, rate: 1.1 });
  });

  it("matches voices by language, ignoring region and case", () => {
    resetSpeechSpy();
    availableVoices.list = [
      { name: "Zuzana", lang: "cs-CZ" },
      { name: "Samantha", lang: "en-US" },
      { name: "Daniel", lang: "en_GB" },
    ];
    const speech = new Speech(true);
    expect(speech.voicesFor("cs-CZ").map((v) => v.name)).toEqual(["Zuzana"]);
    expect(speech.voicesFor("en-US").map((v) => v.name)).toEqual(["Samantha", "Daniel"]);
  });

  it("prefers a male or female voice when the language offers both", () => {
    resetSpeechSpy();
    availableVoices.list = [
      { name: "Samantha", lang: "en-US" },
      { name: "Daniel", lang: "en-US" },
    ];
    const speech = new Speech(true);
    expect(speech.pickVoice("en-US", "male")?.name).toBe("Daniel");
    expect(speech.pickVoice("en-US", "female")?.name).toBe("Samantha");
  });

  it("still speaks when the language has only one voice", () => {
    resetSpeechSpy();
    availableVoices.list = [{ name: "Zuzana", lang: "cs-CZ" }];
    const speech = new Speech(true);
    // Czech typically ships a single (female) voice — a male preference must not
    // silence the character, it just keeps the only voice available.
    expect(speech.pickVoice("cs-CZ", "male")?.name).toBe("Zuzana");
    speech.speak("ahoj", "cs-CZ", { prefer: "male", pitch: 0.6 });
    expect(spokenUtterances.at(-1)).toMatchObject({ voiceName: "Zuzana", pitch: 0.6 });
  });

  it("falls back to the default voice when the platform lists none", () => {
    resetSpeechSpy();
    availableVoices.list = [];
    const speech = new Speech(true);
    expect(speech.pickVoice("cs-CZ", "female")).toBeNull();
    speech.speak("ahoj", "cs-CZ", { prefer: "female" });
    expect(spokenUtterances.at(-1)).toMatchObject({ lang: "cs-CZ", voiceName: undefined });
  });

  it("stays silent when disabled or given empty text", () => {
    resetSpeechSpy();
    new Speech(false).speak("nope", "en-US");
    new Speech(true).speak("", "en-US");
    expect(spokenUtterances).toHaveLength(0);
  });

  it("can be toggled at runtime", () => {
    resetSpeechSpy();
    const speech = new Speech(false);
    speech.setEnabled(true);
    speech.speak("now audible", "es-ES");
    expect(spokenUtterances).toHaveLength(1);
  });
});
