/**
 * The game's sound palette, built on the engine's synth. Cheerful arpeggios for
 * success, a low buzz for a miss, a soft blip for taps, a fanfare on level win.
 */
import type { AudioEngine } from "@engine/index.ts";

export class Sounds {
  constructor(private readonly audio: AudioEngine) {}

  correct(): void {
    [523, 659, 784].forEach((f, i) => this.audio.tone(f, i * 0.09, 0.22, "triangle", 0.14));
  }

  wrong(): void {
    this.audio.tone(200, 0, 0.25, "sine", 0.07);
  }

  tap(): void {
    this.audio.tone(420, 0, 0.08, "sine", 0.05);
  }

  win(): void {
    [523, 659, 784, 1047, 1319].forEach((f, i) => this.audio.tone(f, i * 0.12, 0.3, "triangle", 0.13));
  }
}
