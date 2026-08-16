/**
 * Speech — a thin wrapper over the Web Speech API (text-to-speech).
 *
 * Used to read prompts and praise aloud for early readers. Purely client-side,
 * no network. Fails silently where SpeechSynthesis is unavailable or disabled.
 *
 * Characters are given distinct voices mostly through pitch and rate, which every
 * engine honours. Picking a *different* voice per character is only possible when
 * the platform ships more than one for the language — common for English, rare for
 * Czech — so `prefer` is a best-effort hint that degrades to the default voice.
 */

export type VoiceGender = "male" | "female";

export interface VoiceProfile {
  /** 0–2, where 1 is the engine default. */
  pitch?: number;
  /** Speaking rate; 1 is the engine default. */
  rate?: number;
  /** Preferred voice gender when the language offers a choice. */
  prefer?: VoiceGender;
}

/**
 * Name fragments that reliably indicate a gendered voice across the common
 * platforms. Matching is a hint only — an unknown voice never disqualifies a
 * language, it simply falls through to the platform default.
 */
const VOICE_NAMES: Record<VoiceGender, readonly string[]> = {
  male: [
    "male", "muž", "hombre", "daniel", "thomas", "diego", "jorge", "carlos", "fred",
    "alex", "aaron", "arthur", "gordon", "rishi", "reed", "eddy", "grandpa", "ralph",
    "juan", "pablo", "george", "james", "guy", "davis", "tony", "jacob", "matej",
  ],
  female: [
    "female", "žena", "mujer", "zuzana", "iveta", "samantha", "victoria", "karen",
    "moira", "tessa", "fiona", "monica", "mónica", "paulina", "marisol", "allison",
    "ava", "susan", "zoe", "nicky", "joana", "sara", "jenny", "aria", "michelle",
  ],
};

export class Speech {
  private enabled: boolean;

  constructor(enabled = true) {
    this.enabled = enabled;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /** Voices the platform offers for a language tag ("cs-CZ" also matches "cs"). */
  voicesFor(lang: string): SpeechSynthesisVoice[] {
    try {
      const base = lang.split("-")[0]!.toLowerCase();
      return speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().replace("_", "-").startsWith(base));
    } catch {
      return [];
    }
  }

  /**
   * Best available voice for a language, honouring a gender preference when the
   * platform offers a recognisable match. Returns null to use the default voice.
   */
  pickVoice(lang: string, prefer?: VoiceGender): SpeechSynthesisVoice | null {
    const voices = this.voicesFor(lang);
    if (voices.length === 0) return null;
    if (prefer) {
      const wanted = VOICE_NAMES[prefer];
      const avoid = VOICE_NAMES[prefer === "male" ? "female" : "male"];
      const named = (v: SpeechSynthesisVoice) => v.name.toLowerCase();
      const match = voices.find((v) => wanted.some((n) => named(v).includes(n)));
      if (match) return match;
      // otherwise anything that is not clearly the other gender
      const neutral = voices.find((v) => !avoid.some((n) => named(v).includes(n)));
      if (neutral) return neutral;
    }
    return voices[0]!;
  }

  /** Speak `text` in the given BCP-47 language tag, cancelling any prior speech. */
  speak(text: string, lang: string, profile: VoiceProfile = {}): void {
    if (!this.enabled || !text) return;
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = profile.rate ?? 0.95;
      utterance.pitch = profile.pitch ?? 1;
      const voice = this.pickVoice(lang, profile.prefer);
      if (voice) utterance.voice = voice;
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
