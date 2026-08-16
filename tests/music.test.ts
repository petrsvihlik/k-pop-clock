import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MusicPlayer } from "@engine/index.ts";
import { THEME, TimeIslandsGame } from "@game/index.ts";

/** Stand-in for HTMLAudioElement that records what the player asks of it. */
function spyAudio({ blocked = false } = {}) {
  const made: FakeAudio[] = [];
  class FakeAudio {
    src = "";
    loop = false;
    preload = "";
    volume = 1;
    currentTime = 0;
    playing = false;
    plays = 0;
    pauses = 0;
    constructor() {
      made.push(this);
    }
    play(): Promise<void> {
      this.plays += 1;
      if (blocked) return Promise.reject(new Error("NotAllowedError"));
      this.playing = true;
      return Promise.resolve();
    }
    pause(): void {
      this.pauses += 1;
      this.playing = false;
    }
  }
  vi.stubGlobal("Audio", FakeAudio);
  return { made, latest: () => made.at(-1)! };
}

const TRACK = { url: "theme.mp3", volume: 0.4 };

beforeEach(() => {
  localStorage.clear();
});
afterEach(() => vi.unstubAllGlobals());

describe("MusicPlayer", () => {
  it("does not touch audio until it is started", () => {
    const { made } = spyAudio();
    const player = new MusicPlayer(TRACK);
    expect(player.isPlaying()).toBe(false);
    expect(made).toHaveLength(0);
  });

  it("plays the track on a loop when started", () => {
    const { latest } = spyAudio();
    const player = new MusicPlayer(TRACK);
    player.start();
    const el = latest();
    expect(player.isPlaying()).toBe(true);
    expect(el.src).toBe("theme.mp3");
    expect(el.loop).toBe(true);
    expect(el.plays).toBe(1);
    expect(el.playing).toBe(true);
  });

  it("defers the download until the music is wanted", () => {
    const { latest } = spyAudio();
    new MusicPlayer(TRACK).start();
    // nothing should be fetched on page load, only when play is requested
    expect(latest().preload).toBe("none");
  });

  it("applies the track's volume, clamped to a sane range", () => {
    const { latest } = spyAudio();
    const player = new MusicPlayer(TRACK);
    player.start();
    expect(latest().volume).toBeCloseTo(0.4);
    player.setVolume(0.8);
    expect(latest().volume).toBeCloseTo(0.8);
    player.setVolume(5);
    expect(latest().volume).toBe(1);
    player.setVolume(-2);
    expect(latest().volume).toBe(0);
  });

  it("reuses one element rather than stacking playbacks", () => {
    const { made } = spyAudio();
    const player = new MusicPlayer(TRACK);
    player.start();
    player.start();
    player.stop();
    player.start();
    expect(made).toHaveLength(1);
    expect(made[0]!.plays).toBe(2);
  });

  it("stops and rewinds, so the next start begins at the top", () => {
    const { latest } = spyAudio();
    const player = new MusicPlayer(TRACK);
    player.start();
    latest().currentTime = 42;
    player.stop();
    expect(player.isPlaying()).toBe(false);
    expect(latest().pauses).toBe(1);
    expect(latest().currentTime).toBe(0);
  });

  it("starts on the first gesture when autostart is armed", () => {
    spyAudio();
    const player = new MusicPlayer(TRACK);
    player.armAutostart();
    expect(player.isPlaying()).toBe(false);
    window.dispatchEvent(new Event("pointerdown"));
    expect(player.isPlaying()).toBe(true);
  });

  it("forgets an armed autostart once cancelled", () => {
    spyAudio();
    const player = new MusicPlayer(TRACK);
    player.armAutostart();
    player.cancelAutostart();
    window.dispatchEvent(new Event("pointerdown"));
    expect(player.isPlaying()).toBe(false);
  });

  it("does not claim to be playing when the browser blocks it", async () => {
    const { latest } = spyAudio({ blocked: true });
    const player = new MusicPlayer(TRACK);
    player.start();
    await vi.waitFor(() => expect(player.isPlaying()).toBe(false));

    // it re-arms, so the next gesture tries again rather than giving up
    window.dispatchEvent(new Event("pointerdown"));
    expect(latest().plays).toBe(2);
    await vi.waitFor(() => expect(player.isPlaying()).toBe(false));
  });

  it("survives a browser with no audio support", () => {
    vi.stubGlobal("Audio", undefined);
    const player = new MusicPlayer(TRACK);
    expect(() => player.start()).not.toThrow();
    expect(player.isPlaying()).toBe(false);
    expect(() => player.stop()).not.toThrow();
    expect(() => player.setVolume(0.5)).not.toThrow();
  });
});

describe("the theme", () => {
  it("points at a bundled audio file at a sensible level", () => {
    expect(THEME.url).toMatch(/\.mp3(\?.*)?$/);
    expect(THEME.volume).toBeGreaterThan(0);
    expect(THEME.volume).toBeLessThanOrEqual(1);
  });
});

describe("the music toggle", () => {
  it("starts off, and stays off across reloads until switched on", () => {
    spyAudio();
    expect(new TimeIslandsGame().store.get().musicOn).toBe(false);
    expect(new TimeIslandsGame().store.get().musicOn).toBe(false);
  });

  it("switches on and off, and remembers the choice", () => {
    spyAudio();
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
    spyAudio();
    const first = new TimeIslandsGame();
    first.toggleMusic();

    const reloaded = new TimeIslandsGame();
    reloaded.armMusic();
    expect(reloaded.musicPlaying(), "must not autoplay before a gesture").toBe(false);
    window.dispatchEvent(new Event("pointerdown"));
    expect(reloaded.musicPlaying()).toBe(true);
  });

  it("stays silent on a fresh save even after a gesture", () => {
    spyAudio();
    const game = new TimeIslandsGame();
    game.armMusic();
    window.dispatchEvent(new Event("pointerdown"));
    expect(game.musicPlaying()).toBe(false);
  });
});
