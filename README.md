# Time Islands 🕐🎸

A browser-only educational game for learning to read the clock. Play through
seven "islands" — whole hours, halves & quarters, five-minute steps, 24-hour
digital, any minute, a matching game, and a drag-the-hands challenge — and
recruit a band of characters along the way, one per level finished. Finish them
all and the band plays a closing concert. Trilingual (Czech, English, Spanish)
with spoken prompts.

Play it: <https://petrsvihlik.github.io/k-pop-clock/>

## The band

Seven collectible members: **Rumi**, **Mira**, **Zoey**, **Derpy** (a sitting
blue tiger spirit), **Sussie** (a magpie), **Jinu**, and **Baby Saja**. Every
finished level recruits the next one, and any member already recruited can be
made your **guide** — the character standing beside the speech bubble during a
level, who reads the prompts. Each has their own voice (pitch, rate, and a
male/female preference used when the platform offers a choice).

All of them are drawn as SVG from data: a shared chibi base plus per-character
traits (hair, outfits, ears, eyes, weapons, poses). `?gallery` renders the whole
roster on one page for quick design review, live from the same components the
game uses.

## Learning tools

Beyond the seven quiz islands, the app teaches the underlying concepts:

- **📖 Start here** — a short, narrated (text-to-speech) tutorial that introduces
  the clock face, the hour vs minute hand, the key "one full lap of the minute
  hand = one hour" animation, "o'clock", and counting minutes by fives. Shown
  automatically on a first visit.
- **🎡 Playground** — a free-play clock. As the child drags the hands, the same
  time is shown live in every form at once — analog, 12-hour, 24-hour, AM/PM,
  and in words — so the mappings between them wire up naturally. Includes a
  **day/night sky** (sun, moon, stars) that shifts with the time, **daily-routine
  anchors** (breakfast, school, lunch… pop up at their times), a **"Now"/"Live"**
  mode that follows the real device clock, and a **beginner mode** that hides the
  minute hand.
- **🎤 The big concert** — the finale, unlocked when every island is done: the
  whole band on a lit podium with microphones and floating notes.

On the first three islands the answer choices are tinted to match the hands —
the hour in pink, the minutes in blue — so the mapping is visible before it is
memorised.

## Stack

- **Vite + TypeScript + [Preact](https://preactjs.com/)** (~3 KB view layer)
- **100% client-side.** No backend, no network calls. Progress persists to
  `localStorage`; sounds are synthesised with the Web Audio API; prompts are
  read aloud with the Web Speech API. The production build is static files that
  drop onto GitHub Pages (or any static host) unchanged.
- **Installable.** A web manifest plus icons make it a home-screen app. Since an
  installed copy would otherwise sit on a cached shell forever, each build
  stamps a `version.json` that the running app polls (on load, on focus, and
  periodically) to offer a reload; the map also has a manual ⟳ button.

## Run it

```bash
npm install
npm run dev        # dev server with hot reload
npm test           # unit tests (vitest)
npm run build      # typecheck + static production build -> dist/
npm run preview    # serve the built output
```

`?gallery` opens the character gallery; typing `iddqd` anywhere unlocks every
island and reveals the whole band for the session (nothing is written to the
save).

## Architecture

The code is split so the reusable **engine** never depends on this particular
game or on Preact — the idea is a foundation you can build more games on.

```
src/
  engine/               framework-agnostic, reusable core
    store.ts              reactive state container (React-style setState)
    save.ts               versioned, fault-tolerant localStorage persistence
    audio.ts              WebAudio synth (no audio files)
    speech.ts             text-to-speech, with per-character voice profiles
    updates.ts            "a new version is deployed" checker
    rng.ts                random helpers
  games/time-islands/   the game as data + logic (no rendering)
    data.ts               islands + band members (the content)
    i18n.ts               cs / en / es strings
    time.ts               time formatting + clock-hand geometry
    daytime.ts            time-of-day -> sky phase, sun/moon position
    routine.ts            daily-routine anchors (breakfast, school, …)
    questions.ts          per-island question generators (pure functions)
    game.ts               TimeIslandsGame controller (owns all state)
    config.ts             tunable gameplay settings
  ui/                   Preact view layer (a pure projection of game state)
    components/           ClockFace, Creature, Emblem, LightSweeps, SkyBackground,
                          Mascot, UpdateBanner
    screens/              Map, Level, StickerBook, CompleteOverlay, Sandbox,
                          Intro, Finale, Gallery
    App.tsx, useStore.ts
  main.tsx              bootstrap
tests/                  vitest suite (see below)
```

**Data flow:** `TimeIslandsGame` holds one `Store` of plain state. The UI
subscribes via `useStore` and re-renders on change; user actions call methods on
the game. Rendering concerns never leak into game logic, and game logic never
imports Preact.

## Tests

```bash
npm test
```

Covers the engine (store, save, rng, speech), the clock maths, question
generation for every island, content integrity across all three languages, and
the game controller: unlocking, recruiting, the guide, the cheat, save
migration/restore, and language↔voice wiring. CI runs them on every pull
request, so a Dependabot bump cannot land red.

## Extending it

Adding levels is meant to be cheap — nothing is hardcoded to "seven".

- **Another island of an existing type** — add one entry to `ISLANDS` in
  `data.ts` and its name to `islands` in each language block of `i18n.ts`.
  That's it: the map chain, unlock order, question generation, the "next island"
  button, and the finale gate all read the array's length. The i18n test fails
  if a translation is missing.
- **A new *kind* of level** — additionally add a branch in `questions.ts`
  (generation), one in `screens/LevelScreen.tsx` (rendering), and a hint in
  `hintFor()`.
- **A new band member** — add to `STICKERS` in `data.ts`. Recruiting order is
  derived from that array, so there is no second list to keep in sync; give them
  a `voice` profile (the voice test enforces one) and the `Creature` component
  draws them from their traits.
- **A new language** — add a block to `STR` in `i18n.ts` and its BCP-47 tag to
  `SPEECH_LANG`.
- **A different game entirely** — reuse everything under `src/engine/` and write
  a new `games/<name>/` + `ui/`.

## Gameplay config

`src/games/time-islands/config.ts`:

| Setting             | Default | Meaning                                             |
| ------------------- | ------- | --------------------------------------------------- |
| `questionsPerLevel` | `8`     | Correct answers needed to finish a level (3–12).    |
| `handSnap`          | `5`     | Minute granularity when dragging hands (`5` or `1`).|
| `voiceOn`           | `true`  | Read prompts and praise aloud.                      |
