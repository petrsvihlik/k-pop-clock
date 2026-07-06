/**
 * Speech — a thin wrapper over the Web Speech API (text-to-speech).
 *
 * Used to read prompts and praise aloud for early readers. Purely client-side,
 * no network. Fails silently where SpeechSynthesis is unavailable or disabled.
 */

export class Speech {
  private enabled: boolean;

  constructor(enabled = true) {
    this.enabled = enabled;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /** Speak `text` in the given BCP-47 language tag, cancelling any prior speech. */
  speak(text: string, lang: string, rate = 0.95): void {
    if (!this.enabled || !text) return;
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    } catch {
      /* ignore */
    }
  }

  cancel(): void {
    try {
      speechSynthesis.cancel();
    } catch {
      /* ignore */
    }
  }
}
