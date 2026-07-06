import { useRef } from "preact/hooks";
import { hourAngle, minuteAngle, STR, type GameState } from "@game/index.ts";
import type { TimeIslandsGame } from "@game/index.ts";
import {
  ClockFace,
  FULL_NUMERALS,
  QUARTER_NUMERALS_DIG24,
  QUARTER_NUMERALS_MATCH,
} from "@ui/components/ClockFace.tsx";
import { Mascot } from "@ui/components/Mascot.tsx";

export function LevelScreen({ game, state }: { game: TimeIslandsGame; state: GameState }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const q = state.q;
  if (!q) return null;

  const L = STR[state.lang];
  const total = game.total();
  const progressPct = Math.min(100, Math.round((state.correct / total) * 100));
  const optAnim = state.wiggle ? "ti-wiggle .4s" : "none";
  const mascotAnim = state.feedback === "correct" ? "ti-bounce .6s" : "ti-float 3s ease-in-out infinite";
  const bubbleText = state.feedbackText || L.cheer;
  const bubbleBg = state.feedback === "wrong" ? "#ffe9f2" : "#fff7f0";

  return (
    <div style="width:100%;max-width:720px;display:flex;flex-direction:column;align-items:center;gap:18px;padding-top:18px">
      {/* back + progress */}
      <div style="display:flex;align-items:center;gap:14px;width:100%">
        <button
          onClick={() => game.goMap()}
          style="background:#2c1b57;border:3px solid #3b2f63;color:#fff7f0;border-radius:14px;width:54px;height:46px;font-size:22px;cursor:pointer;font-weight:800;flex:none"
        >
          ←
        </button>
        <div style="flex:1;height:22px;background:#2c1b57;border-radius:999px;border:3px solid #3b2f63;overflow:hidden">
          <div style={`height:100%;width:${progressPct}%;background:#7ee081;border-radius:999px;transition:width .4s`} />
        </div>
      </div>

      {/* prompt */}
      <div style="display:flex;align-items:center;gap:14px;background:#fff7f0;color:#2a1a4a;border-radius:20px;padding:14px 20px;border:3px solid #2a1a4a;box-shadow:0 5px 0 #120a2e;max-width:100%">
        <button
          onClick={() => game.speak(q.spoken)}
          class="press-scale"
          aria-label="listen"
          style="width:48px;height:48px;border-radius:50%;background:#4fd8e8;border:3px solid #2a1a4a;cursor:pointer;display:flex;align-items:center;justify-content:center;flex:none;padding:0"
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <polygon points="3,9 8,9 14,4 14,20 8,15 3,15" fill="#2a1a4a" />
            <path d="M17 8 a5 5 0 0 1 0 8" stroke="#2a1a4a" stroke-width="2.5" fill="none" />
          </svg>
        </button>
        <div style="font-size:24px;font-weight:800;line-height:1.2">{q.prompt}</div>
      </div>

      {/* ---- READ ---- */}
      {q.kind === "read" && (
        <>
          <ClockFace
            size={280}
            hourAngle={hourAngle(q.h ?? 0, q.m ?? 0)}
            minAngle={minuteAngle(q.m ?? 0)}
            numerals={FULL_NUMERALS}
            numeralSize={18}
            showTicks
          />
          <div style={`display:flex;gap:16px;flex-wrap:wrap;justify-content:center;animation:${optAnim}`}>
            {(q.options ?? []).map((opt, i) => (
              <button
                key={i}
                onClick={() => game.pick(i)}
                class="press-4"
                style="min-width:140px;padding:16px 22px;font-size:36px;font-weight:800;background:#fff7f0;color:#2a1a4a;border:4px solid #2a1a4a;border-radius:22px;box-shadow:0 6px 0 #120a2e;cursor:pointer"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* ---- DIGITAL 24h ---- */}
      {q.kind === "dig24" && (
        <>
          <div style="background:#120a2e;border:4px solid #2a1a4a;border-radius:22px;padding:16px 42px;font-size:70px;font-weight:800;color:#7ee081;letter-spacing:5px;box-shadow:0 6px 0 #0a0620">
            {q.digital}
          </div>
          <div style={`display:flex;gap:16px;flex-wrap:wrap;justify-content:center;animation:${optAnim}`}>
            {(q.options ?? []).map((opt, i) => (
              <button
                key={i}
                onClick={() => game.pick(i)}
                class="press-4"
                style="background:#fff7f0;border:4px solid #2a1a4a;border-radius:22px;padding:12px;cursor:pointer;box-shadow:0 6px 0 #120a2e"
              >
                <ClockFace
                  size={130}
                  hourAngle={opt.hA ?? 0}
                  minAngle={opt.mA ?? 0}
                  numerals={QUARTER_NUMERALS_DIG24}
                  numeralSize={26}
                  hourWidth={13}
                  minWidth={8}
                  centerR={9}
                />
              </button>
            ))}
          </div>
        </>
      )}

      {/* ---- MATCH ---- */}
      {q.kind === "match" && (
        <div style={`display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;width:100%;animation:${optAnim}`}>
          {state.cards.map((card, i) => {
            const border = card.matched ? "#7ee081" : state.sel === i ? "#ffcf5c" : "#2a1a4a";
            return (
              <button
                key={i}
                onClick={() => game.tapCard(i)}
                class="press-3"
                style={`background:#fff7f0;border:4px solid ${border};border-radius:20px;padding:10px;cursor:pointer;opacity:${card.matched ? 0.35 : 1};box-shadow:0 5px 0 #120a2e;display:flex;align-items:center;justify-content:center;min-height:118px`}
              >
                {card.kind === "digital" ? (
                  <div style="font-size:27px;font-weight:800;color:#2a1a4a">{card.label}</div>
                ) : (
                  <ClockFace
                    size={92}
                    hourAngle={card.hA ?? 0}
                    minAngle={card.mA ?? 0}
                    numerals={QUARTER_NUMERALS_MATCH}
                    numeralSize={30}
                    faceStroke={7}
                    hourWidth={14}
                    minWidth={9}
                    centerR={10}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ---- SET THE HANDS ---- */}
      {q.kind === "set" && (
        <>
          <div style="background:#120a2e;border:4px solid #2a1a4a;border-radius:22px;padding:12px 38px;font-size:58px;font-weight:800;color:#7ee081;letter-spacing:4px;box-shadow:0 6px 0 #0a0620">
            {q.digital}
          </div>
          <ClockFace
            size={300}
            hourAngle={(state.setH % 12) * 30 + state.setM * 0.5}
            minAngle={minuteAngle(state.setM)}
            numerals={FULL_NUMERALS}
            numeralSize={18}
            showTicks
            knobs
            interactive={{
              svgRef,
              onPointerDown: (e) => svgRef.current && game.handDown(e, svgRef.current),
              onPointerMove: (e) => svgRef.current && game.handMove(e, svgRef.current),
              onPointerUp: () => game.handUp(),
            }}
          />
          <button
            onClick={() => game.checkSet()}
            class="press-4"
            style={`background:#7ee081;color:#1c4a2a;border:4px solid #2a1a4a;border-radius:22px;padding:14px 46px;font-size:28px;font-weight:800;cursor:pointer;box-shadow:0 6px 0 #120a2e;animation:${optAnim}`}
          >
            {L.check}
          </button>
        </>
      )}

      {/* mascot + speech bubble */}
      <div style="display:flex;align-items:flex-end;gap:12px;width:100%;margin-top:4px">
        <div style={`flex:none;animation:${mascotAnim}`}>
          <Mascot />
        </div>
        <div style={`background:${bubbleBg};color:#2a1a4a;border:3px solid #2a1a4a;border-radius:18px;border-bottom-left-radius:4px;padding:12px 18px;font-size:19px;font-weight:700;flex:1;line-height:1.35`}>
          {bubbleText}
        </div>
      </div>
    </div>
  );
}
