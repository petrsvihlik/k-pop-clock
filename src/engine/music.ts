/**
 * MusicPlayer — loops a background track.
 *
 * The track is fetched lazily: nothing is downloaded until the music is
 * actually switched on, so the audio never slows the first paint.
 *
 * Browsers refuse to start audio before the user has interacted with the page,
 * so `start()` is meant to be called from a click/keypress. `armAutostart()`
 * covers music that was left switched on in a previous session: it waits for
 * the first gesture and starts then. A `play()` that is rejected anyway (some
 * browsers are stricter still) re-arms rather than leaving the UI lying about
 * what is audible.
 */

export interface MusicTrack {
  /** URL of the audio file. */
  url: string;
  /** Playback level, 0–1. */
  volume?: number;
}

export class MusicPlayer {
  private el: HTMLAudioElement | null = null;
  private disarm: (() => void) | null = null;
  private playing = false;

  constructor(
    private readonly track: MusicTrack,
    private volume = track.volume ?? 0.5,
  ) {}

  isPlaying(): boolean {
    return this.playing;
  }

  private element(): HTMLAudioElement | null {
    try {
      if (!this.el) {
        const el = new Audio();
        el.src = this.track.url;
        el.loop = true;
        // only fetch once the music is actually wanted
        el.preload = "none";
        el.volume = this.volume;
        this.el = el;
      }
      return this.el;
    } catch {
      return null;
    }
  }

  /** Overall level, 0–1. Takes effect immediately. */
  setVolume(v: number): void {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.el) this.el.volume = this.volume;
  }

  /** Begin (or resume) playback. Safe to call when already playing. */
  start(): void {
    if (this.playing) return;
    const el = this.element();
    if (!el) return;
    this.cancelAutostart();
    this.playing = true;
    try {
      const p = el.play() as unknown as Promise<void> | undefined;
      // A blocked play() must not leave the button claiming music is on.
      void p?.catch(() => {
        this.playing = false;
        this.armAutostart();
      });
    } catch {
      this.playing = false;
    }
  }

  /** Stop playback and rewind, so the next start begins at the top. */
  stop(): void {
    this.playing = false;
    this.cancelAutostart();
    try {
      if (this.el) {
        this.el.pause();
        this.el.currentTime = 0;
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
}
