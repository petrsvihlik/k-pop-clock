import { STR, type GameState } from "@game/index.ts";
import type { TimeIslandsGame } from "@game/index.ts";
import { Creature } from "@ui/components/Creature.tsx";

export function CompleteOverlay({ game, state }: { game: TimeIslandsGame; state: GameState }) {
  const L = STR[state.lang];
  const earned = state.earned;
  const completeSub = earned ? L.earned : L.replayDone;

  return (
    <div style="position:fixed;inset:0;background:rgba(18,10,46,0.82);display:flex;align-items:center;justify-content:center;z-index:50">
      {state.confetti.map((c, i) => (
        <div
          key={i}
          style={`position:fixed;top:-40px;left:${c.left}%;width:${c.size}px;height:${c.size}px;background:${c.color};border-radius:${c.radius};animation:ti-fall ${c.dur}s linear ${c.delay}s forwards;z-index:60`}
        />
      ))}

      <div style="background:#fff7f0;color:#2a1a4a;border:5px solid #2a1a4a;border-radius:28px;padding:34px 46px;display:flex;flex-direction:column;align-items:center;gap:12px;box-shadow:0 10px 0 #120a2e;animation:ti-pop .5s;max-width:88vw;position:relative;z-index:70">
        <div style="font-size:44px;font-weight:800">{L.done}</div>
        <div style="font-size:20px;font-weight:700;color:#6b5aa0">{completeSub}</div>

        {earned && (
          <div style="animation:ti-bounce 1.2s ease-in-out infinite">
            <Creature sticker={earned} width={140} height={185} />
          </div>
        )}
        {earned && <div style="font-size:26px;font-weight:800">{earned.name}</div>}

        <div style="display:flex;gap:14px;margin-top:8px">
          <button
            onClick={() => game.goMap()}
            class="press-3"
            style="background:#4fd8e8;color:#123a42;border:4px solid #2a1a4a;border-radius:18px;padding:12px 28px;font-size:22px;font-weight:800;cursor:pointer;box-shadow:0 5px 0 #120a2e"
          >
            {L.map}
          </button>
          <button
            onClick={() => game.replay()}
            class="press-3"
            style="background:#ffcf5c;color:#4a3600;border:4px solid #2a1a4a;border-radius:18px;padding:12px 28px;font-size:22px;font-weight:800;cursor:pointer;box-shadow:0 5px 0 #120a2e"
          >
            {L.again}
          </button>
        </div>
      </div>
    </div>
  );
}
