/**
 * TimeIslandsGame — the game controller.
 *
 * A faithful port of the design prototype's `DCLogic` component onto the engine
 * primitives (Store, LocalSave, AudioEngine, Speech). It owns all game state and
 * behaviour; the Preact UI is a pure projection of `store.get()` plus calls to
 * these methods. No rendering concerns leak in here.
 */
import { AudioEngine, LocalSave, Speech, Store, pick } from "@engine/index.ts";
import { DEFAULT_CONFIG, type GameplayConfig } from "./config.ts";
import { ISLANDS, ISLAND_STICKER_IDS, STICKERS, type Sticker } from "./data.ts";
import { SPEECH_LANG, STR, type Lang, type Strings } from "./i18n.ts";
import { board, genQ, type Card, type Question } from "./questions.ts";
import { Sounds } from "./sounds.ts";

export type Screen = "map" | "play" | "stickers";
export type Feedback = null | "correct" | "wrong";

export interface ConfettiBit {
  left: number;
  size: number;
  color: string;
  radius: string;
  dur: string;
  delay: string;
}

export interface GameState {
  lang: Lang;
  done: Record<string, boolean>;
  stickers: string[];
  screen: Screen;
  island: number | null;
  q: Question | null;
  correct: number;
  feedback: Feedback;
  feedbackText: string;
  wiggle: boolean;
  cards: Card[];
  sel: number;
  setH: number;
  setM: number;
  showComplete: boolean;
  earned: Sticker | null;
  bonus: boolean;
  extraName: string;
  confetti: ConfettiBit[];
}

interface SaveData {
  lang: Lang;
  done: Record<string, boolean>;
  stickers: string[];
}

const SAVE_KEY = "timeislands_v1";
const CONFETTI_COLORS = ["#ff5fa2", "#4fd8e8", "#ffcf5c", "#7ee081", "#a78bfa", "#ff9d5c"];

export class TimeIslandsGame {
  readonly store: Store<GameState>;
  readonly config: GameplayConfig;

  private readonly save_: LocalSave<SaveData>;
  private readonly audio = new AudioEngine();
  private readonly sounds = new Sounds(this.audio);
  private readonly speech: Speech;
  private drag: "hour" | "minute" | null = null;

  constructor(config: GameplayConfig = DEFAULT_CONFIG) {
    this.config = config;
    this.speech = new Speech(config.voiceOn);
    this.save_ = new LocalSave<SaveData>({
      key: SAVE_KEY,
      defaults: { lang: "cs", done: {}, stickers: [] },
    });
    const saved = this.save_.load();

    this.store = new Store<GameState>({
      lang: saved.lang,
      done: saved.done,
      stickers: saved.stickers,
      screen: "map",
      island: null,
      q: null,
      correct: 0,
      feedback: null,
      feedbackText: "",
      wiggle: false,
      cards: [],
      sel: -1,
      setH: 3,
      setM: 0,
      showComplete: false,
      earned: null,
      bonus: false,
      extraName: "",
      confetti: [],
    });
  }

  // ---------- convenience ----------
  private get s(): Readonly<GameState> {
    return this.store.get();
  }

  T(): Strings {
    return STR[this.s.lang];
  }

  total(): number {
    const n = this.config.questionsPerLevel;
    return Number.isFinite(n) && n >= 3 ? Math.floor(n) : 8;
  }

  private save(): void {
    this.save_.save({ lang: this.s.lang, done: this.s.done, stickers: this.s.stickers });
  }

  speak(text: string): void {
    this.speech.speak(text, SPEECH_LANG[this.s.lang]);
  }

  // ---------- navigation ----------
  setLang(lang: Lang): void {
    this.store.setState({ lang }, () => this.save());
  }

  goStickers(): void {
    this.sounds.tap();
    this.store.setState({ screen: "stickers" });
  }

  goMap(): void {
    this.store.setState({ screen: "map", showComplete: false });
  }

  replay(): void {
    if (this.s.island !== null) this.start(this.s.island);
  }

  // ---------- flow ----------
  start(i: number): void {
    const locked = i > 0 && !this.s.done[ISLANDS[i - 1].id];
    if (locked) {
      this.sounds.wrong();
      return;
    }
    this.sounds.tap();
    const g = genQ(i, this.T(), this.s.lang, this.config.handSnap);
    this.store.setState(
      {
        screen: "play",
        island: i,
        correct: 0,
        feedback: null,
        feedbackText: "",
        showComplete: false,
        earned: null,
        bonus: false,
        extraName: "",
        q: g.q,
        cards: g.cards,
        sel: g.sel,
        setH: g.setH,
        setM: g.setM,
      },
      () => this.speak(this.s.q?.spoken ?? ""),
    );
  }

  private hintFor(): string {
    const L = this.T();
    const isl = ISLANDS[this.s.island ?? 0];
    if (isl.type === "dig24") return L.hint24;
    if (isl.type === "match") return L.hintMatch;
    return L.hintRead;
  }

  private onCorrect(): void {
    const L = this.T();
    const praise = pick(L.praise);
    const c = this.s.correct + 1;
    this.sounds.correct();
    this.speak(praise);
    this.store.setState({ correct: c, feedback: "correct", feedbackText: praise });
    setTimeout(() => {
      if (c >= this.total()) {
        this.finish();
      } else {
        const g = genQ(this.s.island ?? 0, this.T(), this.s.lang, this.config.handSnap);
        this.store.setState({
          feedback: null,
          feedbackText: "",
          q: g.q,
          cards: g.cards,
          sel: g.sel,
          setH: g.setH,
          setM: g.setM,
        });
      }
    }, 1200);
  }

  private onWrong(): void {
    const L = this.T();
    this.sounds.wrong();
    this.speak(L.tryAgain);
    this.store.setState({ feedback: "wrong", feedbackText: this.hintFor(), wiggle: true });
    setTimeout(() => this.store.setState({ wiggle: false }), 500);
  }

  pick(i: number): void {
    if (this.s.feedback === "correct") return;
    const o = this.s.q?.options?.[i];
    if (!o) return;
    if (o.correct) this.onCorrect();
    else this.onWrong();
  }

  tapCard(i: number): void {
    const s = this.s;
    if (s.feedback === "correct" && s.correct >= this.total()) return;
    const card = s.cards[i];
    if (card.matched) return;
    if (s.sel === i) {
      this.store.setState({ sel: -1 });
      return;
    }
    this.sounds.tap();
    if (s.sel < 0) {
      this.store.setState({ sel: i });
      return;
    }
    const a = s.cards[s.sel];
    if (a.pair === card.pair && a.kind !== card.kind) {
      const cards = s.cards.map((c, idx) => (idx === i || idx === s.sel ? { ...c, matched: true } : c));
      const praise = pick(this.T().praise);
      const c = s.correct + 1;
      this.sounds.correct();
      this.store.setState({ cards, sel: -1, correct: c, feedback: null, feedbackText: praise });
      if (c >= this.total()) {
        setTimeout(() => this.finish(), 700);
      } else if (cards.every((cc) => cc.matched)) {
        setTimeout(() => this.store.setState({ cards: board(), sel: -1 }), 700);
      }
    } else {
      this.store.setState({ sel: -1 });
      this.onWrong();
    }
  }

  checkSet(): void {
    const s = this.s;
    const q = s.q;
    if (!q || s.feedback === "correct") return;
    if (s.setH % 12 === (q.h ?? 0) % 12 && s.setM === q.m) this.onCorrect();
    else this.onWrong();
  }

  private finish(): void {
    const s = this.s;
    const isl = ISLANDS[s.island ?? 0];
    const done = { ...s.done, [isl.id]: true };
    const stickers = s.stickers.slice();
    let earned: Sticker | null = null;
    let bonus = false;

    if (!stickers.includes(isl.id)) {
      stickers.push(isl.id);
      earned = STICKERS.find((st) => st.id === isl.id) ?? null;
    }
    if (ISLANDS.every((it) => done[it.id]) && !stickers.includes("bonus")) {
      stickers.push("bonus");
      if (earned) bonus = true;
      else earned = STICKERS.find((st) => st.id === "bonus") ?? null;
    }

    const memberCount = stickers.filter((id) => ISLAND_STICKER_IDS.includes(id)).length;
    let extraName = "";
    let extra: string | null = null;
    if (memberCount >= 2 && !stickers.includes("cat")) extra = "cat";
    else if (memberCount >= 5 && !stickers.includes("snake")) extra = "snake";
    if (extra) {
      stickers.push(extra);
      const st = STICKERS.find((x) => x.id === extra)!;
      if (earned) extraName = st.name;
      else earned = st;
    }

    const confetti: ConfettiBit[] = Array.from({ length: 36 }, () => ({
      left: Math.round(Math.random() * 100),
      size: 8 + Math.round(Math.random() * 8),
      color: pick(CONFETTI_COLORS),
      radius: Math.random() < 0.5 ? "50%" : "3px",
      dur: (2.2 + Math.random() * 1.8).toFixed(2),
      delay: (Math.random() * 0.8).toFixed(2),
    }));

    this.sounds.win();
    this.speak(this.T().done);
    this.store.setState({ done, stickers, showComplete: true, earned, bonus, extraName, confetti }, () =>
      this.save(),
    );
  }

  // ---------- set-hands dragging ----------
  private angleFrom(e: PointerEvent, svg: SVGSVGElement): { a: number; dist: number } {
    const r = svg.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 200 - 100;
    const y = ((e.clientY - r.top) / r.height) * 200 - 100;
    let a = (Math.atan2(x, -y) * 180) / Math.PI;
    if (a < 0) a += 360;
    return { a, dist: Math.hypot(x, y) };
  }

  handDown(e: PointerEvent, svg: SVGSVGElement): void {
    if (!this.s.q || this.s.q.kind !== "set") return;
    const p = this.angleFrom(e, svg);
    if (p.dist > 98) return;
    this.drag = p.dist < 62 ? "hour" : "minute";
    try {
      svg.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    this.applyDrag(p.a);
  }

  handMove(e: PointerEvent, svg: SVGSVGElement): void {
    if (!this.drag) return;
    this.applyDrag(this.angleFrom(e, svg).a);
  }

  handUp(): void {
    this.drag = null;
  }

  private applyDrag(a: number): void {
    if (this.drag === "hour") {
      let h = Math.round(a / 30) % 12;
      if (h === 0) h = 12;
      if (h !== this.s.setH) {
        this.store.setState({ setH: h });
        this.sounds.tap();
      }
    } else {
      const snap = this.config.handSnap === 1 ? 1 : 5;
      const m = (Math.round(a / 6 / snap) * snap) % 60;
      if (m !== this.s.setM) this.store.setState({ setM: m });
    }
  }
}
