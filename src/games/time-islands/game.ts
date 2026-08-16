/**
 * TimeIslandsGame — the game controller.
 *
 * A faithful port of the design prototype's `DCLogic` component onto the engine
 * primitives (Store, LocalSave, AudioEngine, Speech). It owns all game state and
 * behaviour; the Preact UI is a pure projection of `store.get()` plus calls to
 * these methods. No rendering concerns leak in here.
 */
import { AudioEngine, LocalSave, MusicPlayer, Speech, Store, pick } from "@engine/index.ts";
import { THEME } from "./music.ts";
import { DEFAULT_CONFIG, type GameplayConfig } from "./config.ts";
import { ISLANDS, STICKERS, type Sticker } from "./data.ts";
import { SPEECH_LANG, STR, type Lang, type Strings } from "./i18n.ts";
import { board, genQ, type Card, type Question } from "./questions.ts";
import { from24, timeWords, type Period } from "./time.ts";
import { Sounds } from "./sounds.ts";

export type Screen = "map" | "play" | "stickers" | "sandbox" | "intro" | "finale";
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
  /** Sticker id of the band member guiding the levels and the tutorial. */
  guide: string;
  /** Background music on/off (persisted). */
  musicOn: boolean;
  /** Test cheat: every island playable and every band member shown this session (not saved). */
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
  guide: string;
  musicOn: boolean;
  seenIntro: boolean;
}

/** The guide before any band member has joined (and the fallback if one retires). */
const DEFAULT_GUIDE = "derpy";

const SAVE_KEY = "timeislands_v1";
const CONFETTI_COLORS = ["#ff5fa2", "#4fd8e8", "#ffcf5c", "#7ee081", "#a78bfa", "#ff9d5c"];

/**
 * Order in which band members join, one per finished level with more to give.
 * Derived from the roster so adding a member to `STICKERS` is all it takes —
 * there is no second list to keep in sync.
 */
const JOIN_ORDER: readonly string[] = STICKERS.map((s) => s.id);

/**
 * Reconcile a loaded save: renamed ids are mapped, ids from retired character
 * sets are dropped, and — since every finished level recruits one member — the
 * band is topped up to at least one member per finished island. Without the
 * top-up, saves written before a roster change keep their level stars but lose
 * the members that were earned alongside them. Extra members from replays are
 * kept as they are.
 */
function reconcileStickers(stickers: string[], done: Record<string, boolean>): string[] {
  const kept = stickers
    .map((id) => RENAMED_IDS[id] ?? id)
    .filter((id, i, all) => all.indexOf(id) === i && STICKERS.some((st) => st.id === id));
  const earnedLevels = ISLANDS.filter((isl) => done[isl.id]).length;
  for (const id of JOIN_ORDER) {
    if (kept.length >= earnedLevels) break;
    if (!kept.includes(id)) kept.push(id);
  }
  return kept;
}

/** Sticker ids that were renamed; saves made under the old id are migrated on load. */
const RENAMED_IDS: Record<string, string> = {
  nari: "rumi",
  dara: "mira",
  kwon: "zoey",
  tiger: "derpy",
  magpie: "sussie",
  mini: "saja",
  han: "jinu",
};

export class TimeIslandsGame {
  readonly store: Store<GameState>;
  readonly config: GameplayConfig;

  private readonly save_: LocalSave<SaveData>;
  private readonly audio = new AudioEngine();
  private readonly sounds = new Sounds(this.audio);
  private readonly music = new MusicPlayer(THEME);
  private readonly speech: Speech;
  private drag: "hour" | "minute" | null = null;
  private dragTarget: "set" | "sandbox" = "set";
  /**
   * Bumped whenever a level is left or restarted. Delayed callbacks (the pause
   * after a correct answer, the matching board's refill) capture the value and
   * bail if it changed, so a timer from an abandoned level can never hand out a
   * question or raise the completion overlay on another screen.
   */
  private session = 0;

  constructor(config: GameplayConfig = DEFAULT_CONFIG) {
    this.config = config;
    this.speech = new Speech(config.voiceOn);
    this.save_ = new LocalSave<SaveData>({
      key: SAVE_KEY,
      defaults: { lang: "cs", done: {}, stickers: [], guide: DEFAULT_GUIDE, musicOn: false, seenIntro: false },
    });
    const saved = this.save_.load();
    // Guard against hand-edited or truncated blobs before reconciling.
    saved.done = saved.done && typeof saved.done === "object" ? saved.done : {};
    saved.stickers = reconcileStickers(Array.isArray(saved.stickers) ? saved.stickers : [], saved.done);
    const savedGuide = RENAMED_IDS[saved.guide] ?? saved.guide;
    const guide = STICKERS.some((st) => st.id === savedGuide) ? savedGuide : DEFAULT_GUIDE;
    const now = this.nowParts();

    this.store = new Store<GameState>({
      lang: saved.lang,
      done: saved.done,
      stickers: saved.stickers,
      guide,
      musicOn: saved.musicOn === true,
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
      confetti: [],
      sbH: now.h12,
      sbM: now.m,
      sbPeriod: now.period,
      sbLive: false,
      sbHideMin: false,
      introStep: 0,
      seenIntro: saved.seenIntro,
    });

    // Write the reconciled shape back so the stored blob is healed in place.
    this.save();
  }

  // ---------- convenience ----------
  private get s(): Readonly<GameState> {
    return this.store.get();
  }

  T(): Strings {
    return STR[this.s.lang];
  }

  /**
   * Invalidate pending level callbacks and return the new session token. Also
   * drops any hand-drag still in progress: a pointer that never reported its
   * release would otherwise keep dragging the clock of the screen it started
   * on while the player merely hovers over the next one.
   */
  private endSession(): number {
    this.drag = null;
    return ++this.session;
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
      guide: this.s.guide,
      musicOn: this.s.musicOn,
      seenIntro: this.s.seenIntro,
    });
  }

  /**
   * Turn the background music on or off. Autoplay is blocked until the page has
   * been interacted with, so this is driven by the button; a session that left
   * the music on picks it up on the first gesture instead (see `main.tsx`).
   */
  toggleMusic(): void {
    const on = !this.s.musicOn;
    this.sounds.tap();
    if (on) this.music.start();
    else this.music.stop();
    this.store.setState({ musicOn: on }, () => this.save());
  }

  /** Resume music left switched on in a previous session, once allowed. */
  armMusic(): void {
    if (this.s.musicOn) this.music.armAutostart();
  }

  /** True while the loop is actually sounding (not merely enabled). */
  musicPlaying(): boolean {
    return this.music.isPlaying();
  }

  /** The band member currently guiding the game (Derpy until one is chosen). */
  guideSticker(): Sticker {
    const st = STICKERS.find((x) => x.id === this.s.guide);
    return st ?? STICKERS.find((x) => x.id === DEFAULT_GUIDE) ?? STICKERS[0]!;
  }

  /** Pick a joined band member as the guide; ignored for members not yet earned. */
  setGuide(id: string): void {
    if (!this.ownsSticker(id) || this.s.guide === id) return;
    this.sounds.correct();
    // set the guide first so the greeting is spoken in the new voice
    this.store.setState({ guide: id }, () => this.save());
    const st = STICKERS.find((x) => x.id === id);
    if (st) this.speak(st.name);
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

  /** Speak in the current language, in the voice of whoever is guiding. */
  speak(text: string): void {
    this.speech.speak(text, SPEECH_LANG[this.s.lang], this.guideSticker().voice);
  }

  // ---------- navigation ----------
  setLang(lang: Lang): void {
    this.store.setState({ lang }, () => this.save());
  }

  goStickers(): void {
    this.endSession();
    this.sounds.tap();
    this.store.setState({ screen: "stickers" });
  }

  /** Every island finished — the closing concert is unlocked. */
  allIslandsDone(): boolean {
    return this.s.cheatUnlocked || ISLANDS.every((isl) => this.s.done[isl.id]);
  }

  /** The closing concert: the whole band on stage. */
  goFinale(): void {
    if (!this.allIslandsDone()) {
      this.sounds.wrong();
      return;
    }
    this.endSession();
    this.sounds.win();
    this.store.setState({ screen: "finale", showComplete: false }, () => this.speak(this.T().finaleChant));
  }

  goMap(): void {
    this.endSession();
    this.store.setState({ screen: "map", showComplete: false });
  }

  replay(): void {
    if (this.s.island !== null) this.start(this.s.island);
  }

  /** Index of the island after the current one, or null if this was the last. */
  nextIsland(): number | null {
    const next = (this.s.island ?? 0) + 1;
    return next < ISLANDS.length ? next : null;
  }

  /** Move on to the next island from the completion overlay. */
  goNext(): void {
    const next = this.nextIsland();
    if (next !== null) this.start(next);
  }

  // ---------- sandbox (free play) ----------
  goSandbox(): void {
    this.endSession();
    this.sounds.tap();
    const n = this.nowParts();
    this.store.setState({ screen: "sandbox", sbH: n.h12, sbM: n.m, sbPeriod: n.period, sbLive: false });
  }

  /**
   * Snap the sandbox clock to the real device time. In beginner mode the minute
   * hand is hidden, so minutes stay at zero — otherwise the hour hand would
   * drift off its numeral with nothing on screen to explain why.
   */
  setSandboxNow(): void {
    const n = this.nowParts();
    this.store.setState({ sbH: n.h12, sbM: this.s.sbHideMin ? 0 : n.m, sbPeriod: n.period });
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
    this.endSession();
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
    this.endSession();
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

  /** Test cheat (typed "iddqd"): unlock every island and band member for this session. */
  unlockAll(): void {
    if (this.s.cheatUnlocked) return;
    this.sounds.win();
    this.store.setState({ cheatUnlocked: true });
  }

  /** Sticker ownership as displayed, honoring the test cheat (the save is untouched). */
  ownsSticker(id: string): boolean {
    return this.s.cheatUnlocked || this.s.stickers.includes(id);
  }

  /** Owned-sticker count as displayed, honoring the test cheat. */
  ownedCount(): number {
    return this.s.cheatUnlocked ? STICKERS.length : this.s.stickers.length;
  }

  start(i: number): void {
    if (this.isLocked(i)) {
      this.sounds.wrong();
      return;
    }
    this.endSession();
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
    const token = this.session;
    setTimeout(() => {
      if (token !== this.session) return; // the level was left or restarted
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
    if (!card || card.matched) return;
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
    if (!a) {
      this.store.setState({ sel: i });
      return;
    }
    if (a.pair === card.pair && a.kind !== card.kind) {
      const cards = s.cards.map((c, idx) => (idx === i || idx === s.sel ? { ...c, matched: true } : c));
      const praise = pick(this.T().praise);
      const c = s.correct + 1;
      this.sounds.correct();
      this.store.setState({ cards, sel: -1, correct: c, feedback: null, feedbackText: praise });
      const token = this.session;
      if (c >= this.total()) {
        setTimeout(() => {
          if (token === this.session) this.finish();
        }, 700);
      } else if (cards.every((cc) => cc.matched)) {
        setTimeout(() => {
          if (token === this.session) this.store.setState({ cards: board(), sel: -1 });
        }, 700);
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

    // Every finished level recruits the next band member until all have joined.
    let earned: Sticker | null = null;
    const next = JOIN_ORDER.find((id) => !stickers.includes(id));
    if (next) {
      stickers.push(next);
      earned = STICKERS.find((x) => x.id === next) ?? null;
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
    this.store.setState({ done, stickers, showComplete: true, earned, confetti }, () => this.save());
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
