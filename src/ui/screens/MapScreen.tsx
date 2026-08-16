import { ISLANDS, LANGS, STICKERS, STR, type GameState, type Lang } from "@game/index.ts";
import type { TimeIslandsGame } from "@game/index.ts";
import { Emblem } from "@ui/components/Emblem.tsx";
import { reloadForUpdate } from "@engine/index.ts";

const ISLAND_PATH =
  "M30 0 C30 58, 170 59, 170 117 C170 175, 30 175, 30 233 C30 291, 170 292, 170 350 C170 408, 30 409, 30 467 C30 525, 170 525, 170 583 C170 641, 30 642, 30 700";

export function MapScreen({ game, state }: { game: TimeIslandsGame; state: GameState }) {
  const L = STR[state.lang];
  const stickerCount = `${game.ownedCount()} / ${STICKERS.length}`;

  return (
    <div style="width:100%;max-width:720px;display:flex;flex-direction:column;align-items:center;position:relative;z-index:1">
      {/* header */}
      <div style="display:flex;width:100%;align-items:center;justify-content:space-between;gap:12px;padding:22px 0 6px 0;flex-wrap:wrap">
        <div>
          <div style="font-size:36px;font-weight:800;letter-spacing:.5px;line-height:1.1">{L.title}</div>
          <div style="font-size:16px;font-weight:600;color:#b9a8ea">{L.subtitle}</div>
        </div>
        <div style="display:flex;gap:4px;background:#2c1b57;padding:5px;border-radius:999px;border:2px solid #3b2f63">
          {LANGS.map((code: Lang) => {
            const active = state.lang === code;
            return (
              <button
                key={code}
                onClick={() => game.setLang(code)}
                style={`border:none;border-radius:999px;padding:9px 15px;font-weight:800;font-size:15px;cursor:pointer;background:${active ? "#ffcf5c" : "transparent"};color:${active ? "#2a1a4a" : "#fff7f0"}`}
              >
                {code.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* learning tools + band */}
      <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:10px">
        <button
          onClick={() => game.goIntro()}
          class="press-3"
          style="background:#a78bfa;color:#241a52;border:3px solid #2a1a4a;border-radius:999px;padding:10px 20px;font-weight:800;font-size:17px;cursor:pointer;box-shadow:0 4px 0 #120a2e"
        >
          📖 {L.startHere}
        </button>
        <button
          onClick={() => game.goSandbox()}
          class="press-3"
          style="background:#4fd8e8;color:#123a42;border:3px solid #2a1a4a;border-radius:999px;padding:10px 20px;font-weight:800;font-size:17px;cursor:pointer;box-shadow:0 4px 0 #120a2e"
        >
          🎡 {L.playground}
        </button>
        <button
          onClick={() => game.goStickers()}
          class="press-3"
          style="background:#fff7f0;color:#2a1a4a;border:3px solid #2a1a4a;border-radius:999px;padding:10px 20px;font-weight:800;font-size:17px;cursor:pointer;box-shadow:0 4px 0 #120a2e"
        >
          {L.stickers} · {stickerCount}
        </button>
        {/* on-demand reload, for pulling a fresh release onto an installed copy */}
        <button
          onClick={reloadForUpdate}
          class="press-3"
          aria-label={L.updateNow}
          title={L.updateNow}
          style="background:#2c1b57;color:#fff7f0;border:3px solid #3b2f63;border-radius:999px;padding:10px 16px;font-weight:800;font-size:17px;cursor:pointer;box-shadow:0 4px 0 #120a2e"
        >
          ⟳
        </button>
      </div>

      {/* island chain */}
      <div style="position:relative;display:flex;flex-direction:column;align-items:center;gap:36px;padding:38px 0 10px 0;width:100%">
        {/* emblem watermark behind the chain */}
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);opacity:0.06;pointer-events:none">
          <Emblem size={560} color="#ffffff" glyph="#ffffff" weight={2.6} />
        </div>
        <svg
          style="position:absolute;top:90px;left:50%;transform:translateX(-100px);width:200px;height:calc(100% - 200px)"
          viewBox="0 0 200 700"
          preserveAspectRatio="none"
        >
          <path d={ISLAND_PATH} fill="none" stroke="#4a3a80" stroke-width="5" stroke-dasharray="2 14" stroke-linecap="round" vector-effect="non-scaling-stroke" />
        </svg>

        {ISLANDS.map((isl, i) => {
          const locked = game.isLocked(i);
          const done = !!state.done[isl.id];
          const offset = i % 2 === 0 ? -70 : 70;
          return (
            <div
              key={isl.id}
              style={`position:relative;transform:translateX(${offset}px);display:flex;flex-direction:column;align-items:center;gap:8px`}
            >
              <button
                onClick={() => game.start(i)}
                class="press-3"
                aria-label={L.islands[isl.id]}
                style={`width:124px;height:130px;background:transparent;border:none;cursor:${locked ? "default" : "pointer"};display:flex;align-items:center;justify-content:center;position:relative;padding:0 0 6px 0`}
              >
                {/* the island is the emblem's quatrefoil silhouette */}
                <Emblem
                  size={124}
                  fill={locked ? "#3b2f63" : isl.color}
                  outline={done ? "#ffcf5c" : "#2a1a4a"}
                  shadow="#120a2e"
                  color="#2a1a4a"
                  glyph={null}
                  weight={2.4}
                  latticeOpacity={locked ? 0.1 : 0.16}
                  style="position:absolute;inset:0"
                />
                <span style={`position:relative;font-size:46px;font-weight:800;color:#2a1a4a;opacity:${locked ? 0 : 1}`}>{i + 1}</span>
                <svg width="40" height="40" viewBox="0 0 36 36" style={`position:absolute;opacity:${locked ? 1 : 0}`}>
                  <rect x="8" y="16" width="20" height="15" rx="4" fill="#8b7fb8" />
                  <path d="M12 16 v-4 a6 6 0 0 1 12 0 v4" fill="none" stroke="#8b7fb8" stroke-width="4" />
                </svg>
                <svg width="36" height="36" viewBox="0 0 34 34" style={`position:absolute;top:2px;right:2px;opacity:${done ? 1 : 0}`}>
                  <polygon points="17,2 21,12 32,13 24,20 26,31 17,25 8,31 10,20 2,13 13,12" fill="#ffcf5c" stroke="#2a1a4a" stroke-width="2" />
                </svg>
              </button>
              <div style={`font-size:17px;font-weight:700;color:${locked ? "#8b7fb8" : "#fff7f0"};background:#2c1b57;padding:4px 16px;border-radius:999px;border:2px solid #3b2f63;white-space:nowrap`}>
                {L.islands[isl.id]}
              </div>
            </div>
          );
        })}

        {/* the closing concert, at the end of the chain */}
        {(() => {
          const open = game.allIslandsDone();
          return (
            <div style="position:relative;display:flex;flex-direction:column;align-items:center;gap:8px">
              <button
                onClick={() => game.goFinale()}
                class="press-3"
                aria-label={L.finale}
                style={`width:124px;height:130px;background:transparent;border:none;cursor:${open ? "pointer" : "default"};display:flex;align-items:center;justify-content:center;position:relative;padding:0 0 6px 0`}
              >
                <Emblem
                  size={124}
                  fill={open ? "#ffcf5c" : "#3b2f63"}
                  outline="#2a1a4a"
                  shadow="#120a2e"
                  color="#2a1a4a"
                  glyph={null}
                  weight={2.4}
                  latticeOpacity={open ? 0.16 : 0.1}
                  style="position:absolute;inset:0"
                />
                <span style={`position:relative;font-size:46px;opacity:${open ? 1 : 0}`}>🎤</span>
                <svg width="40" height="40" viewBox="0 0 36 36" style={`position:absolute;opacity:${open ? 0 : 1}`}>
                  <rect x="8" y="16" width="20" height="15" rx="4" fill="#8b7fb8" />
                  <path d="M12 16 v-4 a6 6 0 0 1 12 0 v4" fill="none" stroke="#8b7fb8" stroke-width="4" />
                </svg>
              </button>
              <div style={`font-size:17px;font-weight:700;color:${open ? "#fff7f0" : "#8b7fb8"};background:#2c1b57;padding:4px 16px;border-radius:999px;border:2px solid #3b2f63;white-space:nowrap`}>
                {L.finale}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
