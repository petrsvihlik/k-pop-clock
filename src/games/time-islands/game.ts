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
import { from24, timeWords, type Period } from "./time.ts";
import { Sounds } from "./sounds.ts";

export type Screen = "map" | "play" | "stickers" | "sandbox" | "intro";
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
  /** Test cheat: every island playable this session (not saved). */
  cheatUnlocked: boolean;
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

  // sandbox (free-play clock)
  sbH: number;
  sbM: number;
  sbPeriod: Period;
  sbLive: boolean;
  sbHideMin: boolean;

  // intro tutorial
  introStep: number;
  seenIntro: boolean;
}

interface SaveData {
  lang: Lang;
  done: Record<string, boolean>;
  stickers: string[];
  seenIntro: boolean;
}

const SAVE_KEY = "timeislands_v1";
const CONFETTI_COLORS = ["#ff5fa2", "#4fd8e8", "#ffcf5c", "#7ee081", "#a78bfa", "#ff9d5c"];

/** Extended band members, joining in this order when a replay earns nothing else. */
const REPLAY_FRIENDS = ["tiger", "magpie", "nari", "dara", "juju", "han", "kwon", "romeo", "mini"];

export class TimeIslandsGame {
  readonly store: Store<GameState>;
  readonly config: GameplayConfig;

  private readonly save_: LocalSave<SaveData>;
  private readonly audio = new AudioEngine();
  private readonly sounds = new Sounds(this.audio);
  private readonly speech: Speech;
  private drag: "hour" | "minute" | null = null;
  private dragTarget: "set" | "sandbox" = "set";

  constructor(config: GameplayConfig = DEFAULT_CONFIG) {
    this.config = config;
    this.speech = new Speech(config.voiceOn);
    this.save_ = new LocalSave<SaveData>({
      key: SAVE_KEY,
      defaults: { lang: "cs", done: {}, stickers: [], seenIntro: false },
    });
    const saved = this.save_.load();
    const now = this.nowParts();

    this.store = new Store<GameState>({
      lang: saved.lang,
      done: saved.done,
      stickers: saved.stickers,
      cheatUnlocked: false,
      // First-time visitors land in the guided tutorial.
      screen: saved.seenIntro ? "map" : "intro",
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
      sbH: now.h12,
      sbM: now.m,
      sbPeriod: now.period,
      sbLive: false,
      sbHideMin: false,
      introStep: 0,
      seenIntro: saved.seenIntro,
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
    this.save_.save({
      lang: this.s.lang,
      done: this.s.done,
      stickers: this.s.stickers,
      seenIntro: this.s.seenIntro,
    });
  }

  /** Real device time, rounded to the configured minute snap. */
  private nowParts(): { h12: number; m: number; period: Period; h24: number } {
    const dt = new Date();
    const snap = this.config.handSnap === 1 ? 1 : 5;
    let h24 = dt.getHours();
    let m = Math.round(dt.getMinutes() / snap) * snap;
    if (m >= 60) {
      m = 0;
      h24 = (h24 + 1) % 24;
    }
    const { h12, period } = from24(h24);
    return { h12, m, period, h24 };
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

  // ---------- sandbox (free play) ----------
  goSandbox(): void {
    this.sounds.tap();
    const n = this.nowParts();
    this.store.setState({ screen: "sandbox", sbH: n.h12, sbM: n.m, sbPeriod: n.period, sbLive: false });
  }

  /** Snap the sandbox clock to the real device time. */
  setSandboxNow(): void {
    const n = this.nowParts();
    this.store.setState({ sbH: n.h12, sbM: n.m, sbPeriod: n.period });
  }

  toggleSbLive(): void {
    const live = !this.s.sbLive;
    this.sounds.tap();
    this.store.setState({ sbLive: live }, () => {
      if (live) this.setSandboxNow();
    });
  }

  toggleSbPeriod(): void {
    this.sounds.tap();
    this.store.setState({ sbPeriod: this.s.sbPeriod === "am" ? "pm" : "am", sbLive: false });
  }

  toggleSbHideMin(): void {
    this.sounds.tap();
    const hide = !this.s.sbHideMin;
    this.store.setState(hide ? { sbHideMin: true, sbM: 0 } : { sbHideMin: false });
  }

  speakSandbox(): void {
    this.speak(timeWords(this.s.sbH, this.s.sbM, this.s.lang));
  }

  // ---------- intro tutorial ----------
  goIntro(): void {
    this.sounds.tap();
    this.store.setState({ screen: "intro", introStep: 0 }, () => this.speakIntro(0));
  }

  introStepCount(): number {
    return this.T().introSteps.length;
  }

  introNext(): void {
    const n = this.s.introStep + 1;
    if (n >= this.introStepCount()) {
      this.exitIntro();
      return;
    }
    this.sounds.tap();
    this.store.setState({ introStep: n }, () => this.speakIntro(n));
  }

  introPrev(): void {
    if (this.s.introStep === 0) {
      this.exitIntro();
      return;
    }
    const n = this.s.introStep - 1;
    this.sounds.tap();
    this.store.setState({ introStep: n }, () => this.speakIntro(n));
  }

  /** Leave the tutorial for the map, remembering it has been seen. */
  exitIntro(): void {
    this.speech.cancel();
    this.store.setState({ screen: "map", seenIntro: true }, () => this.save());
  }

  private speakIntro(i: number): void {
    const step = this.T().introSteps[i];
    if (step) this.speak(`${step.title}. ${step.body}`);
  }

  // ---------- flow ----------
  /** An island is locked until the previous one is done (unless cheated open). */
  isLocked(i: number): boolean {
    return !this.s.cheatUnlocked && i > 0 && !this.s.done[ISLANDS[i - 1].id];
  }

  /** Test cheat (typed "iddqd"): unlock every island for this session. */
  unlockAll(): void {
    if (this.s.cheatUnlocked) return;
    this.sounds.win();
    this.store.setState({ cheatUnlocked: true });
  }

  start(i: number): void {
    if (this.isLocked(i)) {
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

    // Pure replay with nothing new: the extended band joins one member at a time.
    if (!earned) {
      const next = REPLAY_FRIENDS.find((id) => !stickers.includes(id));
      if (next) {
        stickers.push(next);
        earned = STICKERS.find((x) => x.id === next) ?? null;
      }
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

  private beginDrag(e: PointerEvent, svg: SVGSVGElement, target: "set" | "sandbox"): void {
    const p = this.angleFrom(e, svg);
    if (p.dist > 98) return;
    this.dragTarget = target;
    // In beginner mode the minute hand is hidden, so only the hour moves.
    const hourOnly = target === "sandbox" && this.s.sbHideMin;
    this.drag = hourOnly || p.dist < 62 ? "hour" : "minute";
    try {
      svg.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    this.applyDrag(p.a);
  }

  handDown(e: PointerEvent, svg: SVGSVGElement): void {
    if (!this.s.q || this.s.q.kind !== "set") return;
    this.beginDrag(e, svg, "set");
  }

  /** Sandbox clock drag — turns off live mode so she can explore freely. */
  sbHandDown(e: PointerEvent, svg: SVGSVGElement): void {
    if (this.s.sbLive) this.store.setState({ sbLive: false });
    this.beginDrag(e, svg, "sandbox");
  }

  handMove(e: PointerEvent, svg: SVGSVGElement): void {
    if (!this.drag) return;
    this.applyDrag(this.angleFrom(e, svg).a);
  }

  handUp(): void {
    this.drag = null;
  }

  private applyDrag(a: number): void {
    const toSet = this.dragTarget === "set";
    if (this.drag === "hour") {
      let h = Math.round(a / 30) % 12;
      if (h === 0) h = 12;
      const cur = toSet ? this.s.setH : this.s.sbH;
      if (h !== cur) {
        this.store.setState(toSet ? { setH: h } : { sbH: h });
        this.sounds.tap();
      }
    } else {
      const snap = this.config.handSnap === 1 ? 1 : 5;
      const m = (Math.round(a / 6 / snap) * snap) % 60;
      const cur = toSet ? this.s.setM : this.s.sbM;
      if (m !== cur) this.store.setState(toSet ? { setM: m } : { sbM: m });
    }
  }
}
