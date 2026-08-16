/**
 * The background loop, as note data rather than an audio file — the whole game
 * is synthesised, so the music is too (see `MusicPlayer` in the engine).
 *
 * Transcribed from the project's own "done done done" MIDI: a twelve-second
 * phrase of the chorus (lead line, bass, and a chiptune counter-melody) that
 * repeats. Times and durations are seconds from the start of the loop, `midi`
 * is a MIDI note number, `gain` a per-voice level.
 */
import type { MusicLoop } from "@engine/index.ts";

export const THEME: MusicLoop = {
  seconds: 12,
  tracks: [
    {
      // lead vocal line
      wave: "triangle",
      gain: 0.16,
      notes: [
        [0, 0.125, 67], [0.125, 0.125, 69], [0.25, 0.125, 69], [0.375, 0.125, 67],
        [0.5, 0.125, 69], [0.625, 0.125, 69], [0.75, 0.125, 67], [0.875, 0.125, 69],
        [1, 0.125, 69], [1.125, 0.125, 67], [1.25, 0.125, 69], [1.375, 0.125, 76],
        [1.5, 0.125, 76], [1.625, 0.375, 72], [2, 0.375, 69], [2, 0.375, 65],
        [2, 0.375, 62], [2.75, 0.375, 69], [2.75, 0.375, 65], [2.75, 0.375, 62],
        [3.5, 0.375, 70], [3.5, 0.375, 62], [3.5, 0.375, 67], [4.063, 0.188, 62],
        [4.25, 0.188, 62], [4.438, 0.375, 69],
      ],
    },
    {
      // bass
      wave: "sine",
      gain: 0.22,
      notes: [
        [2, 0.281, 38], [2.281, 0.469, 38], [3.125, 0.281, 39], [3.406, 0.469, 39],
        [4.25, 0.188, 45], [4.438, 0.188, 41], [4.625, 0.375, 39], [5, 0.281, 38],
        [5.281, 0.469, 38], [6.125, 0.281, 39], [6.406, 0.469, 39], [7.25, 0.375, 45],
        [7.625, 0.375, 39], [8, 0.281, 38], [8.281, 0.469, 38], [9.125, 0.281, 39],
        [9.406, 0.469, 39], [10.25, 0.188, 45], [10.438, 0.188, 41], [10.625, 0.375, 39],
        [11, 0.75, 45],
      ],
    },
    {
      // chiptune counter-melody
      wave: "square",
      gain: 0.07,
      notes: [
        [2, 0.75, 50], [3.125, 0.75, 51], [4.25, 0.188, 57], [4.438, 0.188, 53],
        [4.625, 0.375, 51], [5, 0.75, 50], [6.125, 0.75, 51], [7.25, 0.375, 57],
        [7.625, 0.375, 51], [8, 0.75, 50], [9.125, 0.75, 51], [10.25, 0.188, 57],
        [10.438, 0.188, 53], [10.625, 0.375, 51], [11, 0.75, 57],
      ],
    },
  ],
};
