import type { TimeIslandsGame } from "@game/index.ts";
import { useStore } from "@ui/useStore.ts";
import { LightSweeps } from "@ui/components/LightSweeps.tsx";
import { MapScreen } from "@ui/screens/MapScreen.tsx";
import { LevelScreen } from "@ui/screens/LevelScreen.tsx";
import { StickerScreen } from "@ui/screens/StickerScreen.tsx";
import { CompleteOverlay } from "@ui/screens/CompleteOverlay.tsx";
import { SandboxScreen } from "@ui/screens/SandboxScreen.tsx";
import { IntroScreen } from "@ui/screens/IntroScreen.tsx";
import { UpdateBanner } from "@ui/components/UpdateBanner.tsx";

export function App({ game }: { game: TimeIslandsGame }) {
  const state = useStore(game.store);

  return (
    <div style="min-height:100vh;background:#1c1140;font-family:'Baloo 2',system-ui,sans-serif;color:#fff7f0;display:flex;flex-direction:column;align-items:center;padding:0 16px 48px 16px;box-sizing:border-box;user-select:none;-webkit-user-select:none">
      {state.screen === "map" && <LightSweeps />}
      {state.screen === "map" && <MapScreen game={game} state={state} />}
      {state.screen === "play" && <LevelScreen game={game} state={state} />}
      {state.screen === "stickers" && <StickerScreen game={game} state={state} />}
      {state.screen === "sandbox" && <SandboxScreen game={game} state={state} />}
      {state.screen === "intro" && <IntroScreen game={game} state={state} />}
      {state.showComplete && <CompleteOverlay game={game} state={state} />}
      <UpdateBanner lang={state.lang} />
    </div>
  );
}
