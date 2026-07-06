import { render } from "preact";
import "@ui/styles.css";
import { DEFAULT_CONFIG, TimeIslandsGame } from "@game/index.ts";
import { App } from "@ui/App.tsx";

// One game instance owns all state; the UI is a projection of it.
const game = new TimeIslandsGame(DEFAULT_CONFIG);

const root = document.getElementById("app");
if (root) render(<App game={game} />, root);
