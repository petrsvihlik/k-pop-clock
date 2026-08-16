/**
 * Engine barrel — the framework-agnostic, reusable core.
 *
 * Nothing in here knows about clocks or Preact. It provides the primitives a
 * client-only browser game needs: reactive state, persistence, sound, speech,
 * and randomness. Build a new game by pairing these with fresh game data + UI.
 */
export { Store } from "./store.ts";
export type { Listener, StatePatch } from "./store.ts";

export { LocalSave } from "./save.ts";
export type { LocalSaveOptions } from "./save.ts";

export { AudioEngine } from "./audio.ts";
export type { Note, OscType } from "./audio.ts";

export { Speech } from "./speech.ts";
export type { VoiceGender, VoiceProfile } from "./speech.ts";

export { MusicPlayer } from "./music.ts";
export type { MusicTrack } from "./music.ts";

export { randInt, pick, shuffle } from "./rng.ts";

export { RUNNING_BUILD, fetchDeployedBuild, reloadForUpdate, watchForUpdates } from "./updates.ts";
export type { UpdateWatchOptions } from "./updates.ts";
