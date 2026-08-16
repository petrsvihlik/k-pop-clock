import { STR, type GameState } from "@game/index.ts";
import type { TimeIslandsGame } from "@game/index.ts";
import { Creature } from "@ui/components/Creature.tsx";

const BTN =
  "border:4px solid #2a1a4a;border-radius:18px;padding:12px 28px;font-size:22px;font-weight:800;" +
  "cursor:pointer;box-shadow:0 5px 0 #120a2e;font-family:inherit";

export function CompleteOverlay({ game, state }: { game: TimeIslandsGame; state: GameState }) {
  const L = STR[state.lang];
  const earned = state.earned;
  const completeSub = earned ? L.earned : L.replayDone;
  const isGuide = !!earned && state.guide === earned.id;
  const hasNext = game.nextIsland() !== null;
  // Everything finished: send them straight to the closing concert instead.
  const showFinale = game.allIslandsDone();

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

        {/* the new member can take over as the guide right away */}
        {earned &&
          (isGuide ? (
            <div style="font-size:18px;font-weight:800;color:#3f8f52;background:#e6f8ea;border:3px solid #7ee081;border-radius:16px;padding:8px 18px">
              ★ {L.guideSet}
            </div>
          ) : (
            <button
              onClick={() => game.setGuide(earned.id)}
              class="press-3"
              style={`background:#a78bfa;color:#241a52;${BTN};font-size:20px;padding:10px 24px`}
            >
              ★ {L.makeGuide}
            </button>
          ))}

        <div style="display:flex;gap:14px;margin-top:8px;flex-wrap:wrap;justify-content:center">
          <button onClick={() => game.goMap()} class="press-3" style={`background:#4fd8e8;color:#123a42;${BTN}`}>
            {L.map}
          </button>
          <button onClick={() => game.replay()} class="press-3" style={`background:#ffcf5c;color:#4a3600;${BTN}`}>
            {L.again}
          </button>
          {hasNext && (
            <button onClick={() => game.goNext()} class="press-3" style={`background:#7ee081;color:#1c4a2a;${BTN}`}>
              {L.next} →
            </button>
          )}
          {showFinale && (
            <button onClick={() => game.goFinale()} class="press-3" style={`background:#ffcf5c;color:#4a3600;${BTN}`}>
              🎤 {L.toFinale}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
