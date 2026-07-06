/**
 * Time-of-day → sky logic. Maps a 24-hour time to a phase of day, a background
 * gradient, and the position of the sun or moon in the sky. Used by the sandbox
 * and intro screens so the backdrop teaches "what the clock time *feels* like".
 */

export type PhaseKey = "night" | "dawn" | "morning" | "noon" | "afternoon" | "dusk" | "evening";

/** Phase for a given 24-hour value. */
export function phaseFor(h24: number): PhaseKey {
  if (h24 >= 5 && h24 < 7) return "dawn";
  if (h24 >= 7 && h24 < 11) return "morning";
  if (h24 >= 11 && h24 < 14) return "noon";
  if (h24 >= 14 && h24 < 17) return "afternoon";
  if (h24 >= 17 && h24 < 20) return "dusk";
  if (h24 >= 20 && h24 < 22) return "evening";
  return "night";
}

/** Top→bottom sky gradient per phase. */
export const PHASE_GRADIENT: Record<PhaseKey, string> = {
  night: "linear-gradient(180deg,#070a1f 0%,#0f1436 55%,#1b1a4a 100%)",
  dawn: "linear-gradient(180deg,#2a2058 0%,#8a4a8f 55%,#ff9e6b 100%)",
  morning: "linear-gradient(180deg,#3d97f0 0%,#8ec9ff 60%,#d6ecff 100%)",
  noon: "linear-gradient(180deg,#1f7fe0 0%,#63b0f5 55%,#a9d8ff 100%)",
  afternoon: "linear-gradient(180deg,#3f8fd6 0%,#8fc0e8 45%,#ffd79c 100%)",
  dusk: "linear-gradient(180deg,#241a52 0%,#7a3f7e 40%,#ff7e54 80%,#ffce7a 100%)",
  evening: "linear-gradient(180deg,#10123a 0%,#241f5c 60%,#3a2f77 100%)",
};

export interface Celestial {
  /** True = sun (daytime), false = moon (nighttime). */
  isSun: boolean;
  /** Horizontal position as a viewport percentage. */
  x: number;
  /** Vertical position as a viewport percentage (smaller = higher). */
  y: number;
}

/** Sun/moon position, tracing an arc across the sky as the day progresses. */
export function celestial(h24: number, m: number): Celestial {
  const time = h24 + m / 60;
  const isSun = time >= 6 && time < 19;
  let t: number;
  if (isSun) {
    t = (time - 6) / 13; // sunrise 6:00 → sunset 19:00
  } else {
    t = ((time - 19 + 24) % 24) / 11; // moon across the 19:00→6:00 night
  }
  t = Math.max(0, Math.min(1, t));
  const x = 12 + t * 76;
  const y = 82 - Math.sin(t * Math.PI) * 60;
  return { isSun, x, y };
}

/** Whether the sky is dark enough to show stars. */
export function starsVisible(h24: number): boolean {
  const p = phaseFor(h24);
  return p === "night" || p === "evening";
}
