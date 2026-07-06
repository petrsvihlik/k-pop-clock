/**
 * Question generation for each island type.
 *
 * Pure functions: given the island and language they return a fresh question
 * plus any board/hand state. Keeping generation separate from the controller
 * makes the difficulty rules easy to read, test, and extend with new islands.
 */
import { pick, randInt, shuffle } from "@engine/index.ts";
import { ISLANDS } from "./data.ts";
import type { IslandType } from "./data.ts";
import type { Lang, Strings } from "./i18n.ts";
import { fmt, fmt24, hourAngle, minuteAngle, timeWords } from "./time.ts";
import type { HandSnap } from "./config.ts";

/** A single answer choice. Which fields are used depends on the question kind. */
export interface Option {
  /** Text choice ("read" islands). */
  label?: string;
  /** Clock-face choice ("dig24" island): hour/minute hand angles. */
  hA?: number;
  mA?: number;
  correct: boolean;
}

export interface Question {
  kind: IslandType;
  h?: number;
  m?: number;
  prompt: string;
  spoken: string;
  digital?: string;
  options?: Option[];
}

export interface Card {
  kind: "analog" | "digital";
  pair: number;
  label?: string;
  hA?: number;
  mA?: number;
  matched: boolean;
}

export interface GeneratedQuestion {
  q: Question;
  cards: Card[];
  sel: number;
  setH: number;
  setM: number;
}

/** Four unique times shown as analog+digital pairs, shuffled, for the match game. */
export function board(): Card[] {
  const times: Array<{ h: number; m: number }> = [];
  const used = new Set<number>();
  while (times.length < 4) {
    const h = 1 + randInt(12);
    const m = randInt(12) * 5;
    const key = h * 60 + m;
    if (!used.has(key)) {
      used.add(key);
      times.push({ h, m });
    }
  }
  const cards: Card[] = [];
  times.forEach((t, i) => {
    cards.push({ kind: "analog", pair: i, hA: hourAngle(t.h, t.m), mA: minuteAngle(t.m), matched: false });
    cards.push({ kind: "digital", pair: i, label: fmt(t.h, t.m), matched: false });
  });
  return shuffle(cards);
}

export function genQ(index: number, L: Strings, lang: Lang, handSnap: HandSnap): GeneratedQuestion {
  const isl = ISLANDS[index];
  const R = randInt;
  const grain = (): number => {
    if (isl.minutes === "quarter") return pick([0, 15, 30, 45]);
    if (isl.minutes === "five") return R(12) * 5;
    if (isl.minutes === "any") return R(60);
    return 0;
  };

  let q: Question;
  let cards: Card[] = [];
  let setH = 3;
  const setM = 0;

  if (isl.type === "read") {
    const h = 1 + R(12);
    const m = grain();
    const used = new Set<number>([h * 60 + m]);
    const opts: Array<{ h: number; m: number; correct: boolean }> = [{ h, m, correct: true }];
    let guard = 0;
    while (opts.length < 3 && guard++ < 60) {
      let ch: number;
      let cm: number;
      if (Math.random() < 0.5 || isl.minutes === "whole") {
        ch = 1 + R(12);
        cm = m;
      } else {
        ch = h;
        cm = grain();
      }
      const key = ch * 60 + cm;
      if (!used.has(key)) {
        used.add(key);
        opts.push({ h: ch, m: cm, correct: false });
      }
    }
    q = {
      kind: "read",
      h,
      m,
      prompt: L.whatTime,
      spoken: L.whatTime,
      options: shuffle(opts).map((o) => ({ label: fmt(o.h, o.m), correct: o.correct })),
    };
  } else if (isl.type === "dig24") {
    const h24 = Math.random() < 0.75 ? 13 + R(11) : 7 + R(6);
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    const used = new Set<number>([h12]);
    const opts: Array<{ h: number; correct: boolean }> = [{ h: h12, correct: true }];
    while (opts.length < 3) {
      const c = 1 + R(12);
      if (!used.has(c)) {
        used.add(c);
        opts.push({ h: c, correct: false });
      }
    }
    q = {
      kind: "dig24",
      h: h24,
      m: 0,
      prompt: L.findClock,
      spoken: L.findClock,
      digital: fmt24(h24, 0),
      options: shuffle(opts).map((o) => ({ hA: (o.h % 12) * 30, mA: 0, correct: o.correct })),
    };
  } else if (isl.type === "match") {
    q = { kind: "match", prompt: L.matchPrompt, spoken: L.matchPrompt };
    cards = board();
  } else {
    const h = 1 + R(12);
    const snap = handSnap === 1 ? 1 : 5;
    const m = snap === 1 ? R(60) : R(12) * 5;
    setH = 1 + R(12);
    if (setH === h) setH = (setH % 12) + 1;
    q = {
      kind: "set",
      h,
      m,
      prompt: `${L.setPrompt} ${fmt(h, m)}`,
      spoken: `${L.setPrompt} ${timeWords(h, m, lang)}`,
      digital: fmt(h, m),
    };
  }

  return { q, cards, sel: -1, setH, setM };
}
