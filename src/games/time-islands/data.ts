/**
 * Static game data: the islands (levels) and the collectible band members.
 *
 * This is the content layer — editing these arrays changes the game without
 * touching engine or UI code. Island order defines the unlock chain; each
 * island grants the sticker that shares its id.
 */

export type IslandType = "read" | "dig24" | "match" | "set";
export type MinuteGrain = "whole" | "quarter" | "five" | "any";

export interface Island {
  id: string;
  color: string;
  type: IslandType;
  /** Minute granularity for "read" islands. */
  minutes?: MinuteGrain;
  /** Tint hour/minute digits of time labels with the hand colors (early levels). */
  colorCues?: boolean;
}

export const ISLANDS: readonly Island[] = [
  { id: "whole", color: "#ff5fa2", type: "read", minutes: "whole", colorCues: true },
  { id: "half", color: "#4fd8e8", type: "read", minutes: "quarter", colorCues: true },
  { id: "five", color: "#ffcf5c", type: "read", minutes: "five", colorCues: true },
  { id: "dig24", color: "#a78bfa", type: "dig24" },
  { id: "any", color: "#7ee081", type: "read", minutes: "any" },
  { id: "match", color: "#ff9d5c", type: "match" },
  { id: "set", color: "#5ca8ff", type: "set" },
];

export type Ears = "cat" | "round" | "none";
export type Accessory = "mic" | "bolt" | "band" | "star" | "none";

export interface Sticker {
  id: string;
  name: string;
  color: string;
  ears: Ears;
  acc: Accessory;
  /** Beak + no mouth smile (a little bird). */
  bird?: boolean;
  /** Third eye + forked tongue (a little snake). */
  snake?: boolean;
  /** Derpy mismatched googly eyes + tongue. */
  derp?: boolean;
}

export const STICKERS: readonly Sticker[] = [
  { id: "whole", name: "Tiki", color: "#4fd8e8", ears: "cat", acc: "mic" },
  { id: "half", name: "Ruby", color: "#ff5fa2", ears: "cat", acc: "bolt" },
  { id: "five", name: "Bubu", color: "#ffcf5c", ears: "round", acc: "band" },
  { id: "dig24", name: "Mimi", color: "#a78bfa", ears: "cat", acc: "band" },
  { id: "any", name: "Zizi", color: "#7ee081", ears: "round", acc: "mic" },
  { id: "match", name: "Fofo", color: "#ff9d5c", ears: "none", acc: "bolt" },
  { id: "set", name: "Pipa", color: "#5ca8ff", ears: "none", acc: "star" },
  { id: "bonus", name: "Nota", color: "#ffe08a", ears: "none", acc: "star", bird: true },
  { id: "cat", name: "Ťulda", color: "#5eead4", ears: "cat", acc: "none", derp: true },
  { id: "snake", name: "Očko", color: "#a3e635", ears: "none", acc: "none", snake: true },
];

/** Ids of stickers that correspond to a playable island (the "band members"). */
export const ISLAND_STICKER_IDS: readonly string[] = ISLANDS.map((i) => i.id);
