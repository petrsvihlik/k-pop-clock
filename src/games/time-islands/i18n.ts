/**
 * Localised strings for Czech, English and Spanish.
 * `islands` is keyed by island id; everything else is a flat label or template.
 */

export type Lang = "cs" | "en" | "es";

export const LANGS: readonly Lang[] = ["cs", "en", "es"];

/** BCP-47 tags for text-to-speech. */
export const SPEECH_LANG: Record<Lang, string> = {
  cs: "cs-CZ",
  en: "en-US",
  es: "es-ES",
};

export interface Strings {
  title: string;
  subtitle: string;
  stickers: string;
  check: string;
  map: string;
  again: string;
  done: string;
  earned: string;
  replayDone: string;
  whatTime: string;
  findClock: string;
  matchPrompt: string;
  setPrompt: string;
  hintRead: string;
  hint24: string;
  hintMatch: string;
  cheer: string;
  tryAgain: string;
  bonusNote: string;
  friendNote: string;
  praise: string[];
  islands: Record<string, string>;
}

export const STR: Record<Lang, Strings> = {
  cs: {
    title: "Ostrovy času",
    subtitle: "Nauč se hodiny a slož svou kapelu!",
    stickers: "Moje kapela",
    check: "Zkontrolovat",
    map: "Mapa",
    again: "Ještě jednou",
    done: "Hotovo!",
    earned: "Nový člen kapely!",
    replayDone: "Skvělý trénink!",
    whatTime: "Kolik je hodin?",
    findClock: "Které hodiny ukazují stejný čas?",
    matchPrompt: "Spoj stejné časy!",
    setPrompt: "Nastav ručičky na",
    hintRead: "Krátká růžová ručička = hodiny. Dlouhá modrá = minuty. Zkus to znovu!",
    hint24: "Když je číslo větší než 12, odečti 12. Třeba 14 = 2 odpoledne!",
    hintMatch: "Podívej se pozorně na obě ručičky a zkus to znovu!",
    cheer: "Ty to zvládneš!",
    tryAgain: "Zkus to znovu!",
    bonusNote: "A bonusová samolepka za všechny ostrovy!",
    friendNote: "A přidal se i {name}! Mrkni do kapely.",
    praise: ["Výborně!", "Paráda!", "Super!", "Skvěle ti to jde!"],
    islands: {
      whole: "Celé hodiny",
      half: "Půl a čtvrt",
      five: "Po pěti minutách",
      dig24: "Digitální 24h",
      any: "Každá minuta",
      match: "Spojovačka",
      set: "Nastav ručičky",
    },
  },
  en: {
    title: "Time Islands",
    subtitle: "Learn the clock, build your band!",
    stickers: "My Band",
    check: "Check",
    map: "Map",
    again: "Play again",
    done: "You did it!",
    earned: "New band member!",
    replayDone: "Great practice!",
    whatTime: "What time is it?",
    findClock: "Which clock shows the same time?",
    matchPrompt: "Match the same times!",
    setPrompt: "Set the hands to",
    hintRead: "The short pink hand shows hours. The long blue hand shows minutes. Try again!",
    hint24: "When the number is bigger than 12, take away 12. So 14 = 2 in the afternoon!",
    hintMatch: "Look closely at both hands and try again!",
    cheer: "You can do it!",
    tryAgain: "Try again!",
    bonusNote: "And a bonus sticker for finishing every island!",
    friendNote: "And {name} joined too! Check your band.",
    praise: ["Great job!", "Awesome!", "Super!", "You got it!"],
    islands: {
      whole: "Whole Hours",
      half: "Halves & Quarters",
      five: "Five Minutes",
      dig24: "Digital 24h",
      any: "Any Minute",
      match: "Matching",
      set: "Set the Hands",
    },
  },
  es: {
    title: "Islas del Tiempo",
    subtitle: "¡Aprende el reloj y forma tu banda!",
    stickers: "Mi banda",
    check: "Comprobar",
    map: "Mapa",
    again: "Otra vez",
    done: "¡Lo lograste!",
    earned: "¡Nuevo miembro de la banda!",
    replayDone: "¡Buen entrenamiento!",
    whatTime: "¿Qué hora es?",
    findClock: "¿Qué reloj marca la misma hora?",
    matchPrompt: "¡Une las horas iguales!",
    setPrompt: "Pon las agujas a las",
    hintRead: "La aguja corta rosa marca las horas. La larga azul, los minutos. ¡Inténtalo otra vez!",
    hint24: "Si el número es mayor que 12, quita 12. ¡14 = 2 de la tarde!",
    hintMatch: "¡Mira bien las dos agujas e inténtalo otra vez!",
    cheer: "¡Tú puedes!",
    tryAgain: "¡Inténtalo otra vez!",
    bonusNote: "¡Y una pegatina extra por terminar todas las islas!",
    friendNote: "¡{name} también se ha unido! Mira tu banda.",
    praise: ["¡Muy bien!", "¡Genial!", "¡Súper!", "¡Lo lograste!"],
    islands: {
      whole: "Horas en punto",
      half: "Medias y cuartos",
      five: "De cinco en cinco",
      dig24: "Digital 24h",
      any: "Cada minuto",
      match: "Parejas",
      set: "Pon las agujas",
    },
  },
};
