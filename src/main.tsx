import { render } from "preact";
import "@ui/styles.css";
import { DEFAULT_CONFIG, TimeIslandsGame } from "@game/index.ts";
import { App } from "@ui/App.tsx";
import { GalleryScreen } from "@ui/screens/GalleryScreen.tsx";

// One game instance owns all state; the UI is a projection of it.
const game = new TimeIslandsGame(DEFAULT_CONFIG);
// Console handle for manual testing (pairs with the iddqd cheat).
(window as unknown as { game: TimeIslandsGame }).game = game;

// Doom-style test cheat: typing "iddqd" anywhere unlocks every island and band member.
let typed = "";
window.addEventListener("keydown", (e) => {
  typed = (typed + e.key.toLowerCase()).slice(-5);
  if (typed === "iddqd") game.unlockAll();
});

// ?gallery renders the character design gallery instead of the game.
const gallery = new URLSearchParams(location.search).has("gallery");
const root = document.getElementById("app");
if (root) render(gallery ? <GalleryScreen /> : <App game={game} />, root);
