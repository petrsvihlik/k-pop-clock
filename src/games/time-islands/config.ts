/**
 * Gameplay configuration.
 *
 * These mirror the tunable props from the original design prototype. They are
 * plain constants here (no backend / settings service), but are read through a
 * single object so a settings screen or URL override can feed them in later.
 */

export type HandSnap = 5 | 1;

export interface GameplayConfig {
  /** Correct answers needed to finish a level (clamped to 3–12). */
  questionsPerLevel: number;
  /** Minute granularity when dragging hands on the "Set the Hands" island. */
  handSnap: HandSnap;
  /** Read prompts and praise aloud via text-to-speech. */
  voiceOn: boolean;
}

export const DEFAULT_CONFIG: GameplayConfig = {
  questionsPerLevel: 8,
  handSnap: 5,
  voiceOn: true,
};
