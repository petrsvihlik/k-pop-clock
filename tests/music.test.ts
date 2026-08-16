import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MusicPlayer, midiToFreq, type MusicLoop } from "@engine/index.ts";
import { THEME, TimeIslandsGame } from "@game/index.ts";

/** Records everything the player asks the audio context to make. */
function spyContext() {
  const started: Array<{ freq: number; type: string; at: number; stop: number }> = [];
  const state = { now: 0, resumed: 0, state: "running" as string };
  class FakeCtx {
    get currentTime() {
      return state.now;
    }
    get state() {
      return state.state;
    }
    destination = {};
    resume() {
      state.resumed += 1;
      state.state = "running";
      return Promise.resolve();
    }
    createGain() {
      return {
        gain: {
          value: 0,
          setValueAtTime() {},
          exponentialRampToValueAtTime() {},
          setTargetAtTime() {},
        },
        connect() {},
      };
    }
    createOscillator() {
      const o = {
        type: "sine",
        frequency: { value: 0 },
        connect() {},
        start(at: number) {
          o._at = at;
        },
        stop(at: number) {
          started.push({ freq: o.frequency.value, type: o.type, at: o._at, stop: at });
        },
        _at: 0,
      };
      return o;
    }
  }
  vi.stubGlobal("AudioContext", FakeCtx);
  return { started, state };
}

const TINY: MusicLoop = {
  seconds: 2,
  tracks: [{ wave: "square", gain: 0.2, notes: [[0, 0.5, 69], [1, 0.5, 72]] }],
};

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("midiToFreq", () => {
  it("anchors A4 at 440 Hz and doubles each octave", () => {
    expect(midiToFreq(69)).toBeCloseTo(440);
    expect(midiToFreq(81)).toBeCloseTo(880);
    expect(midiToFreq(57)).toBeCloseTo(220);
    expect(midiToFreq(60)).toBeCloseTo(261.63, 1);
  });
});

describe("MusicPlayer", () => {
  it("does not sound until it is started", () => {
    const { started } = spyContext();
    const player = new MusicPlayer(TINY);
    vi.advanceTimersByTime(500);
    expect(player.isPlaying()).toBe(false);
    expect(started).toHaveLength(0);
  });

  it("schedules only what is due, then the rest as the clock advances", () => {
    const { started, state } = spyContext();
    const player = new MusicPlayer(TINY);
    player.start();
    expect(player.isPlaying()).toBe(true);
    // the lookahead is a fraction of a second, so the note at t=1 is not due yet
    expect(started.map((n) => Math.round(n.freq))).toEqual([440]);

    for (let i = 0; i < 20; i++) {
      state.now += 0.05;
      vi.advanceTimersByTime(25);
    }
    expect(started.map((n) => Math.round(n.freq)).slice(0, 2)).toEqual([440, 523]);
  });

  it("keeps looping, repeating the phrase", () => {
    const { started, state } = spyContext();
    const player = new MusicPlayer(TINY);
    player.start();
    const first = started.length;
    // walk the audio clock forward through two more loop lengths
    for (let i = 0; i < 200; i++) {
      state.now += 0.05;
      vi.advanceTimersByTime(25);
    }
    expect(started.length).toBeGreaterThan(first * 3);
    // every scheduled note is one of the two in the loop
    for (const n of started) expect([440, 523]).toContain(Math.round(n.freq));
  });

  it("never schedules a note in the past", () => {
    const { started, state } = spyContext();
    const player = new MusicPlayer(TINY);
    player.start();
    for (let i = 0; i < 100; i++) {
      state.now += 0.05;
      vi.advanceTimersByTime(25);
      for (const n of started) expect(n.at).toBeGreaterThanOrEqual(0);
    }
    // and each note stops after it starts
    for (const n of started) expect(n.stop).toBeGreaterThan(n.at);
  });

  it("stops on request and can be restarted", () => {
    const { started, state } = spyContext();
    const player = new MusicPlayer(TINY);
    player.start();
    player.stop();
    expect(player.isPlaying()).toBe(false);
    const afterStop = started.length;
    for (let i = 0; i < 100; i++) {
      state.now += 0.05;
      vi.advanceTimersByTime(25);
    }
    expect(started).toHaveLength(afterStop);
    player.start();
    expect(player.isPlaying()).toBe(true);
  });

  it("ignores a second start", () => {
    spyContext();
    const player = new MusicPlayer(TINY);
    player.start();
    player.start();
    expect(player.isPlaying()).toBe(true);
    player.stop();
    expect(player.isPlaying()).toBe(false);
  });

  it("resumes a suspended context, as browsers require after a gesture", () => {
    const { state } = spyContext();
    state.state = "suspended";
    const player = new MusicPlayer(TINY);
    player.start();
    expect(state.resumed).toBeGreaterThan(0);
  });

  it("starts on the first gesture when autostart is armed", () => {
    spyContext();
    const player = new MusicPlayer(TINY);
    player.armAutostart();
    expect(player.isPlaying()).toBe(false);
    window.dispatchEvent(new Event("pointerdown"));
    expect(player.isPlaying()).toBe(true);
  });

  it("forgets an armed autostart once cancelled", () => {
    spyContext();
    const player = new MusicPlayer(TINY);
    player.armAutostart();
    player.cancelAutostart();
    window.dispatchEvent(new Event("pointerdown"));
    expect(player.isPlaying()).toBe(false);
  });

  it("survives a browser with no audio at all", () => {
    vi.stubGlobal("AudioContext", undefined);
    const player = new MusicPlayer(TINY);
    expect(() => player.start()).not.toThrow();
    expect(player.isPlaying()).toBe(false);
    expect(() => player.stop()).not.toThrow();
  });

  it("clamps the volume to a sane range", () => {
    spyContext();
    const player = new MusicPlayer(TINY);
    expect(() => {
      player.setVolume(5);
      player.setVolume(-2);
    }).not.toThrow();
  });
});

describe("the theme", () => {
  it("is a well-formed loop", () => {
    expect(THEME.seconds).toBeGreaterThan(0);
    expect(THEME.tracks.length).toBeGreaterThan(0);
    for (const track of THEME.tracks) {
      expect(track.notes.length).toBeGreaterThan(0);
      expect(track.gain).toBeGreaterThan(0);
      expect(track.gain).toBeLessThanOrEqual(1);
      for (const [at, dur, midi] of track.notes) {
        expect(at, "note starts inside the loop").toBeGreaterThanOrEqual(0);
        expect(at).toBeLessThan(THEME.seconds);
        expect(dur).toBeGreaterThan(0);
        expect(midi).toBeGreaterThanOrEqual(0);
        expect(midi).toBeLessThanOrEqual(127);
      }
    }
  });

  it("keeps the combined level from clipping", () => {
    const total = THEME.tracks.reduce((sum, t) => sum + t.gain, 0);
    expect(total).toBeLessThan(1);
  });
});

describe("the music toggle", () => {
  it("starts off, and stays off across reloads until switched on", () => {
    spyContext();
    expect(new TimeIslandsGame().store.get().musicOn).toBe(false);
    expect(new TimeIslandsGame().store.get().musicOn).toBe(false);
  });

  it("switches on and off, and remembers the choice", () => {
    spyContext();
    const game = new TimeIslandsGame();
    game.toggleMusic();
    expect(game.store.get().musicOn).toBe(true);
    expect(game.musicPlaying()).toBe(true);
    expect(new TimeIslandsGame().store.get().musicOn).toBe(true);

    game.toggleMusic();
    expect(game.store.get().musicOn).toBe(false);
    expect(game.musicPlaying()).toBe(false);
    expect(new TimeIslandsGame().store.get().musicOn).toBe(false);
  });

  it("does not autoplay on load, but resumes at the first gesture", () => {
    spyContext();
    const first = new TimeIslandsGame();
    first.toggleMusic();
    expect(first.store.get().musicOn).toBe(true);

    const reloaded = new TimeIslandsGame();
    reloaded.armMusic();
    expect(reloaded.musicPlaying(), "must not autoplay before a gesture").toBe(false);
    window.dispatchEvent(new Event("pointerdown"));
    expect(reloaded.musicPlaying()).toBe(true);
  });

  it("stays silent on a fresh save even after a gesture", () => {
    spyContext();
    const game = new TimeIslandsGame();
    game.armMusic();
    window.dispatchEvent(new Event("pointerdown"));
    expect(game.musicPlaying()).toBe(false);
  });
});
