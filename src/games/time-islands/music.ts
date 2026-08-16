/**
 * The background track. Vite hashes the file into the build, so replacing it
 * automatically busts any cached copy — drop in another mp3 here and nothing
 * else changes. It is only downloaded once the music is switched on.
 */
import type { MusicTrack } from "@engine/index.ts";
import themeUrl from "./theme.mp3";

export const THEME: MusicTrack = {
  url: themeUrl,
  volume: 0.45,
};
