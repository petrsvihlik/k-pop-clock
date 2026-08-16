/**
 * Test environment shims. jsdom has localStorage but no Web Speech or Web Audio,
 * so both are stubbed here. `spokenUtterances` records everything the game says
 * (text + BCP-47 language tag) so tests can assert the voice follows the UI
 * language.
 */
import { beforeEach, vi } from "vitest";

export interface SpokenUtterance {
  text: string;
  lang: string;
  rate: number;
  pitch: number;
  voiceName?: string;
}

/** Voices the fake speechSynthesis reports; tests can swap this out. */
export const availableVoices: { list: Array<{ name: string; lang: string }> } = { list: [] };

/** Everything spoken since the last reset, in order. */
export const spokenUtterances: SpokenUtterance[] = [];
/** How many times speech was cancelled. */
export const speechCancels = { count: 0 };

class FakeUtterance {
  lang = "";
  rate = 1;
  pitch = 1;
  voice: { name: string; lang: string } | null = null;
  constructor(public text: string) {}
}

vi.stubGlobal("SpeechSynthesisUtterance", FakeUtterance);
vi.stubGlobal("speechSynthesis", {
  getVoices: () => availableVoices.list,
  speak: (u: FakeUtterance) => {
    spokenUtterances.push({
      text: u.text,
      lang: u.lang,
      rate: u.rate,
      pitch: u.pitch,
      voiceName: u.voice?.name,
    });
  },
  cancel: () => {
    speechCancels.count += 1;
  },
});

// The game never awaits audio; a no-op AudioContext keeps AudioEngine quiet.
vi.stubGlobal(
  "AudioContext",
  class {
    state = "running";
    currentTime = 0;
    destination = {};
    resume() {
      return Promise.resolve();
    }
    createOscillator() {
      return {
        type: "sine",
        frequency: { value: 0 },
        connect() {},
        start() {},
        stop() {},
      };
    }
    createGain() {
      return {
        gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
        connect() {},
      };
    }
  },
);

/** Forget anything recorded by the speech spy. */
export function resetSpeechSpy(): void {
  spokenUtterances.length = 0;
  speechCancels.count = 0;
  availableVoices.list = [];
}

beforeEach(() => {
  localStorage.clear();
  resetSpeechSpy();
});
