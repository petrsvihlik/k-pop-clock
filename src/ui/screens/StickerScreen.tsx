import { STICKERS, STR, type GameState } from "@game/index.ts";
import type { TimeIslandsGame } from "@game/index.ts";
import { Creature } from "@ui/components/Creature.tsx";

export function StickerScreen({ game, state }: { game: TimeIslandsGame; state: GameState }) {
  const L = STR[state.lang];
  const stickerCount = `${state.stickers.length} / ${STICKERS.length}`;

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

      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:16px">
        {STICKERS.map((st) => {
          const owned = state.stickers.includes(st.id);
          return (
            <div
              key={st.id}
              style="background:#2c1b57;border:3px solid #3b2f63;border-radius:22px;padding:16px 10px;display:flex;flex-direction:column;align-items:center;gap:8px"
            >
              <div style={`filter:${owned ? "none" : "grayscale(1)"};opacity:${owned ? 1 : 0.3}`}>
                <Creature sticker={st} />
              </div>
              <div style="font-size:19px;font-weight:800">{owned ? st.name : "?"}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
