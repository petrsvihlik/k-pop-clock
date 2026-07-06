/** Public surface of the Time Islands game. */
export { TimeIslandsGame } from "./game.ts";
export type { GameState, Screen, Feedback, ConfettiBit } from "./game.ts";
export { ISLANDS, STICKERS, ISLAND_STICKER_IDS } from "./data.ts";
export type { Island, Sticker, IslandType, MinuteGrain, Ears, Accessory } from "./data.ts";
export { STR, LANGS, SPEECH_LANG } from "./i18n.ts";
export type { Lang, Strings } from "./i18n.ts";
export { hourAngle, minuteAngle, fmt, fmt24, to24, from24, timeWords } from "./time.ts";
export type { Period } from "./time.ts";
export { phaseFor, PHASE_GRADIENT, celestial, starsVisible } from "./daytime.ts";
export type { PhaseKey, Celestial } from "./daytime.ts";
export { ROUTINES, routineAt } from "./routine.ts";
export type { Routine } from "./routine.ts";
export type { Question, Option, Card } from "./questions.ts";
export { DEFAULT_CONFIG } from "./config.ts";
export type { GameplayConfig, HandSnap } from "./config.ts";
