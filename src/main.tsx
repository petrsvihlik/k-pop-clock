import { render } from "preact";
import "@ui/styles.css";
import { DEFAULT_CONFIG, TimeIslandsGame } from "@game/index.ts";
import { App } from "@ui/App.tsx";

// One game instance owns all state; the UI is a projection of it.
const game = new TimeIslandsGame(DEFAULT_CONFIG);

// Doom-style test cheat: typing "iddqd" anywhere unlocks every island and band member.
let typed = "";
window.addEventListener("keydown", (e) => {
  typed = (typed + e.key.toLowerCase()).slice(-5);
  if (typed === "iddqd") game.unlockAll();
});

const root = document.getElementById("app");
if (root) render(<App game={game} />, root);
