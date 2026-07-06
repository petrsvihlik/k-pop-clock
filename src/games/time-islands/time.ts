/**
 * Time formatting and clock-hand geometry.
 * Angles are in degrees, clockwise from 12 o'clock (0° = straight up), which is
 * how the SVG clock faces rotate their hands.
 */
import type { Lang } from "./i18n.ts";

const pad2 = (n: number): string => String(n).padStart(2, "0");

/** 12-hour label, e.g. 3:05. */
export const fmt = (h: number, m: number): string => `${h}:${pad2(m)}`;

/** 24-hour label, e.g. 14:00. */
export const fmt24 = (h: number, m: number): string => `${pad2(h)}:${pad2(m)}`;

/** Hour-hand angle, including the gradual drift as minutes pass. */
export const hourAngle = (h: number, m: number): number => (h % 12) * 30 + m * 0.5;

/** Minute-hand angle. */
export const minuteAngle = (m: number): number => m * 6;

export type Period = "am" | "pm";

/** 12-hour + AM/PM → 24-hour. (12 AM = 0, 12 PM = 12.) */
export const to24 = (h12: number, period: Period): number =>
  period === "pm" ? (h12 % 12) + 12 : h12 % 12;

/** 24-hour → 12-hour + AM/PM. */
export const from24 = (h24: number): { h12: number; period: Period } => ({
  h12: h24 % 12 === 0 ? 12 : h24 % 12,
  period: h24 < 12 ? "am" : "pm",
});

/** Spoken form of a time, with language-specific grammar. */
export function timeWords(h: number, m: number, lang: Lang): string {
  if (lang === "cs") {
    const hw = h === 1 ? "hodina" : h >= 2 && h <= 4 ? "hodiny" : "hodin";
    const mw = m === 1 ? "minuta" : m >= 2 && m <= 4 ? "minuty" : "minut";
    return m === 0 ? `${h} ${hw}` : `${h} ${hw} a ${m} ${mw}`;
  }
  if (lang === "en") {
    return m === 0 ? `${h} o'clock` : `${h} ${m < 10 ? "oh " + m : m}`;
  }
  // es
  if (m === 0) return h === 1 ? "la una" : `las ${h}`;
  return h === 1 ? `la una y ${m}` : `las ${h} y ${m}`;
}
