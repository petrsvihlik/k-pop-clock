/**
 * Daily-routine anchors: familiar events pinned to clock times. When the child
 * lands the sandbox clock on one of these times, an icon + label pops up, tying
 * an abstract time to something concrete in her day.
 */

export interface Routine {
  key: string;
  emoji: string;
  /** 24-hour time of the event. */
  h24: number;
  m: number;
}

export const ROUTINES: readonly Routine[] = [
  { key: "breakfast", emoji: "🥞", h24: 7, m: 0 },
  { key: "school", emoji: "🎒", h24: 8, m: 0 },
  { key: "lunch", emoji: "🍽️", h24: 12, m: 0 },
  { key: "play", emoji: "🧸", h24: 15, m: 0 },
  { key: "dinner", emoji: "🍝", h24: 18, m: 0 },
  { key: "bath", emoji: "🛁", h24: 19, m: 30 },
  { key: "bed", emoji: "🛏️", h24: 20, m: 0 },
];

/** The routine exactly at this 24-hour time, if any. */
export function routineAt(h24: number, m: number): Routine | null {
  return ROUTINES.find((r) => r.h24 === h24 && r.m === m) ?? null;
}
