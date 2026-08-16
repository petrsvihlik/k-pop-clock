import { STICKERS, STR, type GameState } from "@game/index.ts";
import type { TimeIslandsGame } from "@game/index.ts";
import { Creature } from "@ui/components/Creature.tsx";

export function StickerScreen({ game, state }: { game: TimeIslandsGame; state: GameState }) {
  const L = STR[state.lang];
  const stickerCount = `${game.ownedCount()} / ${STICKERS.length}`;

  return (
    <div style="width:100%;max-width:720px;display:flex;flex-direction:column;gap:20px;padding-top:18px">
      <div style="display:flex;align-items:center;gap:14px">
        <button
          onClick={() => game.goMap()}
          style="background:#2c1b57;border:3px solid #3b2f63;color:#fff7f0;border-radius:14px;width:54px;height:46px;font-size:22px;cursor:pointer;font-weight:800"
        >
          ←
        </button>
        <div style="font-size:30px;font-weight:800">{L.stickers}</div>
        <div style="font-size:22px;font-weight:800;color:#ffcf5c">{stickerCount}</div>
      </div>

      <div style="font-size:17px;font-weight:700;color:#b9a8ea">{L.guideHint}</div>

      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:16px">
        {STICKERS.map((st) => {
          const owned = game.ownsSticker(st.id);
          const isGuide = state.guide === st.id;
          return (
            <button
              key={st.id}
              onClick={() => game.setGuide(st.id)}
              disabled={!owned}
              class={owned ? "press-3" : undefined}
              aria-pressed={isGuide}
              style={`position:relative;background:#2c1b57;border:3px solid ${isGuide ? "#ffcf5c" : "#3b2f63"};border-radius:22px;padding:16px 10px;display:flex;flex-direction:column;align-items:center;gap:8px;color:#fff7f0;font-family:inherit;cursor:${owned ? "pointer" : "default"};box-shadow:${isGuide ? "0 5px 0 #120a2e" : "none"}`}
            >
              <div style={`filter:${owned ? "none" : "grayscale(1)"};opacity:${owned ? 1 : 0.3}`}>
                <Creature sticker={st} />
              </div>
              <div style="font-size:19px;font-weight:800">{owned ? st.name : "?"}</div>
              {isGuide && (
                <div style="position:absolute;top:-11px;left:50%;transform:translateX(-50%);background:#ffcf5c;color:#2a1a4a;border:2.5px solid #2a1a4a;border-radius:999px;padding:2px 12px;font-size:13px;font-weight:800;white-space:nowrap">
                  ★ {L.guide}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
