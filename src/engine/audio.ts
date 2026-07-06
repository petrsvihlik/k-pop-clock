/**
 * AudioEngine — lightweight WebAudio synth for UI feedback.
 *
 * No audio files: every sound is a synthesised oscillator tone, so there are no
 * assets to load and nothing to host. The AudioContext is created lazily and
 * resumed on first use, satisfying browser autoplay policies (the first tone
 * always follows a user gesture). All calls are wrapped so a missing/blocked
 * Web Audio API never breaks gameplay.
 */

export type OscType = OscillatorType;

export interface Note {
  /** Frequency in Hz. */
  freq: number;
  /** Start offset from "now" in seconds. */
  at: number;
  /** Duration in seconds. */
  dur: number;
  type?: OscType;
  gain?: number;
}

export class AudioEngine {
  private ac?: AudioContext;

  private context(): AudioContext | null {
    try {
      if (!this.ac) {
        const Ctor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return null;
        this.ac = new Ctor();
      }
      if (this.ac.state === "suspended") void this.ac.resume();
      return this.ac;
    } catch {
      return null;
    }
  }

  /** Play a single tone with a short attack and exponential release. */
  tone(freq: number, at: number, dur: number, type: OscType = "sine", gain = 0.12): void {
    const ac = this.context();
    if (!ac) return;
    try {
      const osc = ac.createOscillator();
      const gainNode = ac.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      const t0 = ac.currentTime + at;
      gainNode.gain.setValueAtTime(0.0001, t0);
      gainNode.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(gainNode);
      gainNode.connect(ac.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.05);
    } catch {
      /* ignore */
    }
  }

  /** Play a sequence of notes (a little jingle). */
  play(notes: Note[]): void {
    for (const n of notes) this.tone(n.freq, n.at, n.dur, n.type, n.gain);
  }
}
