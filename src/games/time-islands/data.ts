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

/** cat = pointed, round = discs, soft = rounded triangles with soft edges. */
import type { VoiceProfile } from "@engine/index.ts";

export type Ears = "cat" | "round" | "soft" | "none";
export type Accessory = "mic" | "bolt" | "band" | "star" | "none";
export type Hair = "braid" | "bob" | "buns" | "braidBuns" | "crop" | "curtain" | "fluffy" | "mop" | "pigtails";

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
  /** How this member sounds when guiding the game. */
  voice?: VoiceProfile;

  // Human idols: setting `skin` swaps fur for a face + hair.
  skin?: string;
  hair?: Hair;
  hairColor?: string;
  /** Outfit (body) fill override; also the sleeve color for humans. */
  outfit?: string;
  /** Wide-brim Joseon gat hat: tall semi-transparent crown, flat brim, chin straps. */
  gat?: boolean;
  /** Glowing arcane diamonds on the left cheek, in this color. */
  marks?: string;
  /** Halo color for the marks; when set they also appear on the right cheek and brow. */
  marksGlow?: string;
  /**
   * Tattered traditional overcoat in this color, worn open over a charcoal
   * jeogori with chest chains, a pendant, and crossed straps; the trousers get
   * a thigh chain. Arcane trim on cuffs and hem uses the marks colors.
   */
  robe?: string;
  /** Vertical slit pupils (pair with `sclera` for glowing demon eyes). */
  slitPupils?: boolean;
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
  /** Flared pleated skirt from the waist down. */
  skirt?: string;
  /** High-heeled boots in place of the bare feet. */
  boots?: string;
  /** Gok-do — a curved-blade polearm held at the right side. */
  gokdo?: boolean;
  /** Argyle diamonds + crossing lines on the outfit, in this accent color. */
  argyle?: string;
  /** Collared dress shirt showing at the neckline, in this color. */
  collar?: string;
  /** Tilted newsboy/beret cap in this color. */
  cap?: string;
  /** Neon nail polish dots on the fingertips. */
  neonNails?: boolean;
  /** Stage makeup: eyeshadow in this color + a glitter star on the cheek. */
  makeup?: string;
  /** Chunky silver chain with an open diamond pendant; the crystal inside takes this color. */
  necklace?: string;
  /** Leather jacket: lapels, zipper, utility strap. */
  jacket?: boolean;
  /** Hoodie drawstrings + big chest star. */
  hoodie?: boolean;
  /** Small heart on the chest. */
  heart?: boolean;
  /** Twin shinkal knives held at the sides. */
  knives?: boolean;
  /**
   * Six ritual shin-kal throwing daggers fanned three per hand: silver blades,
   * yellow handles, teal tassels and turtle charms, in a pink spirit aura.
   */
  shinkal?: boolean;
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
  /** Magpie spirit: drawn in side view with its own bird silhouette. */
  magpie?: boolean;

  /** Iris color around the pupils (default: solid dark eyes). */
  eyeColor?: string;
  /** Eye-white color; when set the iris shrinks to a ring inside it and the eye glows softly. */
  sclera?: string;
  /** Hypnotized: a spiral in the iris color coils out from the pupil (needs `sclera`). */
  hypnoEyes?: boolean;
  /** Extra-big round eyes. */
  wideEyes?: boolean;
  /** Inner-ear color for round ears (default: soft cream). */
  earInner?: string;
  /** Rosette spots on the chest, in this color. */
  rosettes?: string;
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
    id: "rumi",
    name: "Rumi",
    color: "#8b5cf6",
    ears: "none",
    acc: "none",
    skin: "#ffe3d0",
    hair: "braid",
    hairColor: "#7c4dff",
    shirt: "#ffffff",
    openJacket: "#ffcf5c",
    shorts: "#4a7fd4",
    necklace: "#8b6fc9",
    marks: "#6ee7ff",
    voice: { pitch: 1.15, rate: 0.95, prefer: "female" },
  },
  {
    id: "mira",
    name: "Mira",
    color: "#8b93a7",
    ears: "none",
    acc: "none",
    skin: "#ffe3d0",
    hair: "pigtails",
    hairColor: "#ff5fa2",
    cropTop: "#17102b",
    skirt: "#ffcf5c",
    boots: "#17102b",
    gokdo: true,
    lids: true,
    voice: { pitch: 0.95, rate: 0.88, prefer: "female" },
  },
  {
    id: "zoey",
    name: "Zoey",
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
    shinkal: true,
    voice: { pitch: 1.4, rate: 1.05, prefer: "female" },
  },
  {
    id: "derpy",
    name: "Derpy",
    color: "#2a85ff",
    ears: "soft",
    acc: "none",
    tiger: true,
    outfit: "#2a85ff",
    accent: "#ffffff",
    rosettes: "#4da6ff",
    earInner: "#ffb6c1",
    sclera: "#ffeb3b",
    eyeColor: "#f44336",
    wideEyes: true,
    hypnoEyes: true,
    voice: { pitch: 0.75, rate: 0.85, prefer: "male" },
  },
  {
    id: "sussie",
    name: "Sussie",
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
    voice: { pitch: 1.7, rate: 1.12 },
  },
  {
    id: "jinu",
    name: "Jinu",
    color: "#9a84b3",
    ears: "none",
    acc: "none",
    skin: "#9a84b3",
    hair: "crop",
    hairColor: "#111113",
    outfit: "#111113",
    gat: true,
    robe: "#111113",
    marks: "#d62868",
    marksGlow: "#4b2e83",
    sclera: "#f3c63f",
    slitPupils: true,
    voice: { pitch: 0.6, rate: 0.85, prefer: "male" },
  },
  {
    id: "saja",
    name: "Baby Saja",
    color: "#40e0d0",
    ears: "none",
    acc: "none",
    skin: "#ffe9d6",
    hair: "mop",
    hairColor: "#40e0d0",
    outfit: "#ff69b4",
    argyle: "#ffb6c1",
    collar: "#000080",
    cap: "#ffdb58",
    neonNails: true,
    makeup: "#ff69b4",
    voice: { pitch: 1.55, rate: 1.0, prefer: "male" },
  },
];
