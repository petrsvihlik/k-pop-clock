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
export type Hair = "braid" | "bob" | "buns" | "crop" | "curtain" | "fluffy";

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
  /** Belly color override (spirits' furry belly / creatures' badge). */
  accent?: string;

  // Human idols: setting `skin` swaps fur for a face + hair.
  skin?: string;
  hair?: Hair;
  hairColor?: string;
  /** Outfit (body) fill override; also the sleeve color for humans. */
  outfit?: string;
  /** Wide-brim Joseon gat hat + jeonbok collar. */
  gat?: boolean;
  /** Glowing demon-pattern diamonds on the cheek. */
  marks?: boolean;
  /** Gold textile sash across the outfit. */
  sash?: string;
  /** Leather jacket: lapels, zipper, utility strap. */
  jacket?: boolean;
  /** Hoodie drawstrings + big chest star. */
  hoodie?: boolean;
  /** Small heart on the chest. */
  heart?: boolean;
  /** Twin shinkal knives held at the sides. */
  knives?: boolean;
  /** Open silky collar + gold necklace. */
  jewelry?: boolean;
  /** Sleeveless top: bare, beefier arms. */
  muscle?: boolean;
  /** Flirty wink (right eye closed). */
  wink?: boolean;
  /** Stoic half-lidded eyes. */
  lids?: boolean;

  // Animal spirits.
  /** Korean tiger spirit: stripes, muzzle, goofy grin, striped tail. */
  tiger?: boolean;
  /** Magpie spirit: dark wings, tail feathers, bird feet, sharp brows. */
  magpie?: boolean;
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

  // The extended band — human idols and animal spirits, earned by replaying islands.
  {
    id: "nari",
    name: "Nari",
    color: "#8b5cf6",
    ears: "none",
    acc: "none",
    skin: "#ffe3d0",
    hair: "braid",
    hairColor: "#7c4dff",
    outfit: "#241a52",
    marks: true,
    sash: "#ffcf5c",
  },
  {
    id: "dara",
    name: "Dara",
    color: "#8b93a7",
    ears: "none",
    acc: "none",
    skin: "#ffe3d0",
    hair: "bob",
    hairColor: "#352454",
    outfit: "#221c33",
    jacket: true,
    lids: true,
  },
  {
    id: "juju",
    name: "Juju",
    color: "#4ade80",
    ears: "none",
    acc: "none",
    skin: "#ffe3d0",
    hair: "buns",
    hairColor: "#2f2440",
    outfit: "#3ecf6f",
    hoodie: true,
    knives: true,
  },
  {
    id: "han",
    name: "Han",
    color: "#38bdf8",
    ears: "none",
    acc: "none",
    skin: "#fff0e6",
    hair: "crop",
    hairColor: "#17102b",
    outfit: "#1d2440",
    gat: true,
  },
  {
    id: "kwon",
    name: "Kwon",
    color: "#f97316",
    ears: "none",
    acc: "none",
    skin: "#f2c9a0",
    hair: "crop",
    hairColor: "#2f2440",
    outfit: "#e11d48",
    muscle: true,
  },
  {
    id: "romeo",
    name: "Romeo",
    color: "#e879f9",
    ears: "none",
    acc: "none",
    skin: "#ffe3d0",
    hair: "curtain",
    hairColor: "#3b2314",
    outfit: "#7a2b5e",
    jewelry: true,
    wink: true,
  },
  {
    id: "mini",
    name: "Mini",
    color: "#f9a8d4",
    ears: "none",
    acc: "none",
    skin: "#ffe9d6",
    hair: "fluffy",
    hairColor: "#c4b5fd",
    outfit: "#fbcfe8",
    heart: true,
  },
  { id: "tiger", name: "Tygřík", color: "#ff8a2a", ears: "round", acc: "none", tiger: true, accent: "#fff2d9" },
  { id: "magpie", name: "Straka", color: "#2e3a6e", ears: "none", acc: "none", bird: true, magpie: true, accent: "#fff7f0" },
];

/** Ids of stickers that correspond to a playable island (the "band members"). */
export const ISLAND_STICKER_IDS: readonly string[] = ISLANDS.map((i) => i.id);
