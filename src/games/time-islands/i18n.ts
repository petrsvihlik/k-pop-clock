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
  /** Badge on the band member currently guiding the game. */
  guide: string;
  /** Hint above the band grid explaining that a member can be picked as guide. */
  guideHint: string;
  /** Completion overlay: make the just-earned member the guide. */
  makeGuide: string;
  /** Completion overlay: confirmation once they are the guide. */
  guideSet: string;
  /** Completion overlay: start the next island. */
  next: string;
  /** Music toggle button label. */
  music: string;
  /** Closing concert: the stage node on the map and its screen title. */
  finale: string;
  /** Closing concert: the band's chant, shown in speech bubbles. */
  finaleChant: string;
  /** Completion overlay: go to the closing concert. */
  toFinale: string;
  /** Update banner: a newer version is deployed. */
  updateReady: string;
  /** Update banner / map button: reload onto the newest version. */
  updateNow: string;
  praise: string[];
  islands: Record<string, string>;

  // learning tools
  startHere: string;
  playground: string;
  now: string;
  live: string;
  hideMinute: string;
  dragHint: string;
  form12: string;
  form24: string;
  ampmLabel: string;
  inWords: string;
  routineNow: string;
  introNext: string;
  introBack: string;
  introDone: string;
  phaseNames: Record<string, string>;
  routineNames: Record<string, string>;
  introSteps: { title: string; body: string }[];
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
    guide: "Průvodce",
    guideHint: "Ťukni na člena kapely a bude tě provázet hrou!",
    makeGuide: "Vezmi mě s sebou!",
    guideSet: "Teď tě provázím hrou!",
    next: "Další ostrov",
    music: "Hudba",
    finale: "Velký koncert",
    finaleChant: "This is how it's DONE DONE DONE!",
    toFinale: "Na pódium!",
    updateReady: "Je tu nová verze hry!",
    updateNow: "Načíst",
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
    startHere: "Začni tady",
    playground: "Hřiště",
    now: "Teď",
    live: "Naživo",
    hideMinute: "Skrýt minuty",
    dragHint: "Chytni ručičky a otáčej!",
    form12: "12 hodin",
    form24: "24 hodin",
    ampmLabel: "dop. / odp.",
    inWords: "Slovy",
    routineNow: "Čas na: {name}",
    introNext: "Dál",
    introBack: "Zpět",
    introDone: "Pojďme hrát!",
    phaseNames: {
      night: "Noc",
      dawn: "Svítání",
      morning: "Ráno",
      noon: "Poledne",
      afternoon: "Odpoledne",
      dusk: "Západ slunce",
      evening: "Večer",
    },
    routineNames: {
      breakfast: "Snídaně",
      school: "Škola",
      lunch: "Oběd",
      play: "Hraní",
      dinner: "Večeře",
      bath: "Koupel",
      bed: "Spinkání",
    },
    introSteps: [
      { title: "Tohle jsou hodiny!", body: "Čísla jdou od 1 do 12 pořád dokola v kruhu." },
      { title: "Malá ručička", body: "Krátká a silná RŮŽOVÁ ručička ukazuje hodiny." },
      { title: "Velká ručička", body: "Dlouhá a tenká MODRÁ ručička ukazuje minuty." },
      { title: "Fungují spolu", body: "Koukej! Když modrá ručička oběhne celé kolo, růžová se posune na další číslo. To je celá jedna hodina!" },
      { title: "Celá hodina", body: "Když modrá ručička míří rovnou nahoru na 12, je přesně celá hodina. Třeba 3 hodiny!" },
      { title: "Počítej po pěti", body: "Minuty počítej dokola po pěti: 5, 10, 15, 20… až do 60." },
    ],
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
    guide: "Guide",
    guideHint: "Tap a band member to make them your guide!",
    makeGuide: "Take me with you!",
    guideSet: "I'm your guide now!",
    next: "Next island",
    music: "Music",
    finale: "The big concert",
    finaleChant: "This is how it's DONE DONE DONE!",
    toFinale: "To the stage!",
    updateReady: "A new version is ready!",
    updateNow: "Reload",
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
    startHere: "Start here",
    playground: "Playground",
    now: "Now",
    live: "Live",
    hideMinute: "Hide minutes",
    dragHint: "Grab the hands and spin!",
    form12: "12-hour",
    form24: "24-hour",
    ampmLabel: "AM / PM",
    inWords: "In words",
    routineNow: "Time for: {name}",
    introNext: "Next",
    introBack: "Back",
    introDone: "Let's play!",
    phaseNames: {
      night: "Night",
      dawn: "Dawn",
      morning: "Morning",
      noon: "Midday",
      afternoon: "Afternoon",
      dusk: "Sunset",
      evening: "Evening",
    },
    routineNames: {
      breakfast: "Breakfast",
      school: "School",
      lunch: "Lunch",
      play: "Playtime",
      dinner: "Dinner",
      bath: "Bath time",
      bed: "Bedtime",
    },
    introSteps: [
      { title: "This is a clock!", body: "The numbers go from 1 to 12, all the way around in a circle." },
      { title: "The hour hand", body: "The short, chunky PINK hand tells you the hour." },
      { title: "The minute hand", body: "The long, thin BLUE hand tells you the minutes." },
      { title: "They work together", body: "Watch! When the blue hand goes all the way around once, the pink hand moves to the next number. That's one whole hour!" },
      { title: "O'clock", body: "When the blue hand points straight up to 12, we say 'o'clock'. Like 3 o'clock!" },
      { title: "Count by fives", body: "For minutes, count around by fives: 5, 10, 15, 20… all the way to 60." },
    ],
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
    guide: "Guía",
    guideHint: "¡Toca a un miembro para que sea tu guía!",
    makeGuide: "¡Llévame contigo!",
    guideSet: "¡Ahora soy tu guía!",
    next: "Siguiente isla",
    music: "Música",
    finale: "El gran concierto",
    finaleChant: "This is how it's DONE DONE DONE!",
    toFinale: "¡Al escenario!",
    updateReady: "¡Hay una versión nueva!",
    updateNow: "Recargar",
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
    startHere: "Empieza aquí",
    playground: "Zona de juego",
    now: "Ahora",
    live: "En vivo",
    hideMinute: "Ocultar minutos",
    dragHint: "¡Agarra las agujas y gíralas!",
    form12: "12 horas",
    form24: "24 horas",
    ampmLabel: "AM / PM",
    inWords: "En palabras",
    routineNow: "Hora de: {name}",
    introNext: "Siguiente",
    introBack: "Atrás",
    introDone: "¡A jugar!",
    phaseNames: {
      night: "Noche",
      dawn: "Amanecer",
      morning: "Mañana",
      noon: "Mediodía",
      afternoon: "Tarde",
      dusk: "Atardecer",
      evening: "Anochecer",
    },
    routineNames: {
      breakfast: "Desayuno",
      school: "Escuela",
      lunch: "Almuerzo",
      play: "Juego",
      dinner: "Cena",
      bath: "Baño",
      bed: "A dormir",
    },
    introSteps: [
      { title: "¡Esto es un reloj!", body: "Los números van del 1 al 12, dando toda la vuelta en círculo." },
      { title: "La aguja de la hora", body: "La aguja corta y gordita ROSA marca la hora." },
      { title: "La aguja de los minutos", body: "La aguja larga y fina AZUL marca los minutos." },
      { title: "Trabajan juntas", body: "¡Mira! Cuando la aguja azul da una vuelta entera, la rosa pasa al siguiente número. ¡Es una hora entera!" },
      { title: "En punto", body: "Cuando la aguja azul apunta arriba al 12, decimos 'en punto'. ¡Como las 3 en punto!" },
      { title: "Cuenta de cinco en cinco", body: "Para los minutos, cuenta de cinco en cinco: 5, 10, 15, 20… hasta 60." },
    ],
  },
};
