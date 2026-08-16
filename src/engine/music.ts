/**
 * MusicPlayer — loops a short piece of note data through WebAudio.
 *
 * There are no audio files anywhere in this project, so background music is
 * synthesised like every other sound. Notes are scheduled a little ahead of the
 * clock on a timer, which keeps timing sample-accurate without holding
 * thousands of pending timeouts.
 *
 * Browsers refuse to start audio before the user has interacted with the page,
 * so `start()` is meant to be called from a click/keypress. `armAutostart()`
 * covers the case of music that was left switched on in a previous session: it
 * waits for the first gesture and starts then.
 */

/** `[startSeconds, durationSeconds, midiNote]`. */
export type MusicNote = readonly [number, number, number];

export interface MusicTrack {
  wave: OscillatorType;
  /** Peak gain for this voice, 0–1. */
  gain: number;
  notes: readonly MusicNote[];
}

export interface MusicLoop {
  /** Length of the loop; playback wraps here. */
  seconds: number;
  tracks: readonly MusicTrack[];
}

/** Equal temperament, A4 (MIDI 69) = 440 Hz. */
export const midiToFreq = (midi: number): number => 440 * Math.pow(2, (midi - 69) / 12);

const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD = 0.25;

export class MusicPlayer {
  private ac: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private disarm: (() => void) | null = null;
  /** Audio-clock time at which the current loop iteration began. */
  private loopStart = 0;
  /** How far into the loop we have already scheduled. */
  private cursor = 0;
  private playing = false;

  constructor(
    private readonly loop: MusicLoop,
    private volume = 0.5,
  ) {}

  isPlaying(): boolean {
    return this.playing;
  }

  private context(): AudioContext | null {
    try {
      if (!this.ac) {
        const Ctor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return null;
        this.ac = new Ctor();
        this.master = this.ac.createGain();
        this.master.gain.value = this.volume;
        this.master.connect(this.ac.destination);
      }
      if (this.ac.state === "suspended") void this.ac.resume();
      return this.ac;
    } catch {
      return null;
    }
  }

  /** Overall level, 0–1. Takes effect immediately. */
  setVolume(v: number): void {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.master) this.master.gain.value = this.volume;
  }

  /** Begin (or resume) playback. Safe to call when already playing. */
  start(): void {
    if (this.playing) return;
    const ac = this.context();
    if (!ac) return;
    this.playing = true;
    this.cancelAutostart();
    this.loopStart = ac.currentTime + 0.08;
    this.cursor = 0;
    this.tick();
    this.timer = setInterval(() => this.tick(), LOOKAHEAD_MS);
  }

  /** Stop playback and release the scheduler. Notes already sounding fade out. */
  stop(): void {
    this.playing = false;
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    try {
      if (this.ac && this.master) {
        // retune the master down rather than killing nodes, to avoid a click
        this.master.gain.setTargetAtTime(0, this.ac.currentTime, 0.02);
        const master = this.master;
        const ac = this.ac;
        setTimeout(() => {
          if (!this.playing) master.gain.setValueAtTime(this.volume, ac.currentTime);
        }, 200);
      }
    } catch {
      /* ignore */
    }
  }

  /**
   * Start as soon as the user next interacts with the page. Used when music was
   * left enabled in a previous session, since autoplay is blocked until then.
   */
  armAutostart(): void {
    if (this.playing || this.disarm) return;
    const go = (): void => {
      this.cancelAutostart();
      this.start();
    };
    const events: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "touchstart"];
    for (const e of events) window.addEventListener(e, go, { once: true, passive: true });
    this.disarm = () => {
      for (const e of events) window.removeEventListener(e, go);
      this.disarm = null;
    };
  }

  /** Forget a pending autostart. */
  cancelAutostart(): void {
    this.disarm?.();
  }

  /** Schedule every note that falls inside the lookahead window. */
  private tick(): void {
    const ac = this.ac;
    if (!ac || !this.playing) return;
    const horizon = ac.currentTime + SCHEDULE_AHEAD;

    // Advance through loop iterations until the whole window is covered.
    for (let guard = 0; guard < 8; guard++) {
      const until = Math.min(this.loop.seconds, horizon - this.loopStart);
      for (const track of this.loop.tracks) {
        for (const [at, dur, midi] of track.notes) {
          if (at < this.cursor || at >= until) continue;
          this.voice(midi, this.loopStart + at, dur, track);
        }
      }
      this.cursor = Math.max(this.cursor, until);
      if (this.cursor < this.loop.seconds) break;
      // wrap into the next iteration
      this.loopStart += this.loop.seconds;
      this.cursor = 0;
    }
  }

  /** One note: an oscillator with a short attack and a smooth release. */
  private voice(midi: number, at: number, dur: number, track: MusicTrack): void {
    const ac = this.ac;
    if (!ac || !this.master) return;
    try {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = track.wave;
      osc.frequency.value = midiToFreq(midi);
      const peak = Math.max(0.0002, track.gain);
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(peak, at + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + Math.max(0.06, dur));
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(at);
      osc.stop(at + Math.max(0.06, dur) + 0.05);
    } catch {
      /* a blocked or exhausted audio context must never break the game */
    }
  }
}
