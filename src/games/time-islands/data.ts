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
export type Hair = "braid" | "bob" | "buns" | "braidBuns" | "crop" | "curtain" | "fluffy";

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
  /** T-shirt torso color (replaces the stage-outfit body fill). */
  shirt?: string;
  /** Unzipped jacket: side panels + sleeves in this color over the shirt. */
  openJacket?: string;
  /** Shorts/sweatpants covering the lower body. */
  shorts?: string;
  /** Side-stripe color on the shorts. */
  shortsTrim?: string;
  /** Crop top over a bare midriff (body renders in skin tone). */
  cropTop?: string;
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
  /** Narrower torso — a capsule instead of a ball. */
  slim?: boolean;
  /** Flirty wink (right eye closed). */
  wink?: boolean;
  /** Stoic half-lidded eyes. */
  lids?: boolean;

  // Animal spirits.
  /** Korean tiger spirit: stripes, muzzle, goofy grin, striped tail. */
  tiger?: boolean;
  /** Magpie spirit: dark wings, tail feathers, bird feet, sharp brows. */
  magpie?: boolean;

  /** Iris color around the pupils (default: solid dark eyes). */
  eyeColor?: string;
  /** Extra-big round eyes. */
  wideEyes?: boolean;
  /** Black top hat (medium height). */
  topHat?: boolean;
  /** Three small eyes stacked vertically down the face center. */
  tripleEyes?: boolean;
  /** Beak fill for birds (default orange). */
  beakColor?: string;
}

export const STICKERS: readonly Sticker[] = [
  // The band — human idols and animal spirits, joining one by one as levels are finished.
  {
    id: "nari",
    name: "Nari",
    color: "#8b5cf6",
    ears: "none",
    acc: "none",
    skin: "#ffe3d0",
    hair: "braid",
    hairColor: "#7c4dff",
    shirt: "#ffffff",
    openJacket: "#ffcf5c",
    shorts: "#4a7fd4",
    marks: true,
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
    color: "#8b5cf6",
    ears: "none",
    acc: "none",
    skin: "#f2c9a0",
    hair: "braidBuns",
    hairColor: "#1c1230",
    cropTop: "#38bdf8",
    shorts: "#8b5cf6",
    shortsTrim: "#ffcf5c",
    slim: true,
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
  {
    id: "tiger",
    name: "Tygřík",
    color: "#8fd3f8",
    ears: "round",
    acc: "none",
    tiger: true,
    accent: "#fff7f0",
    eyeColor: "#ff9d3d",
    wideEyes: true,
  },
  {
    id: "magpie",
    name: "Straka",
    color: "#2e3a6e",
    ears: "none",
    acc: "none",
    bird: true,
    magpie: true,
    accent: "#fff7f0",
    topHat: true,
    tripleEyes: true,
    eyeColor: "#ffcf5c",
    beakColor: "#17102b",
  },
];
