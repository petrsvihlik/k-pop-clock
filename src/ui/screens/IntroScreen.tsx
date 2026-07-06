import { useEffect, useState } from "preact/hooks";
import { STR, type GameState, type TimeIslandsGame } from "@game/index.ts";
import { ClockFace, FULL_NUMERALS } from "@ui/components/ClockFace.tsx";
import { SkyBackground } from "@ui/components/SkyBackground.tsx";
import { Mascot } from "@ui/components/Mascot.tsx";

// The demo clock sits at 3 o'clock (hour hand at 90°).
const HOUR_BASE = 90;
const FIVES = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

export function IntroScreen({ game, state }: { game: TimeIslandsGame; state: GameState }) {
  const L = STR[state.lang];
  const i = state.introStep;
  const step = L.introSteps[i];
  const last = i >= L.introSteps.length - 1;

  // Step 4 (index 3): animate the minute hand sweeping while the hour crawls.
  const [animDeg, setAnimDeg] = useState(0);
  const animating = i === 3;
  useEffect(() => {
    if (!animating) return;
    setAnimDeg(0);
    const id = setInterval(() => setAnimDeg((d) => d + 6), 40);
    return () => clearInterval(id);
  }, [animating]);

  const hourAngle = animating ? HOUR_BASE + animDeg / 12 : HOUR_BASE;
  const minAngle = animating ? animDeg % 360 : 0;
  const pulseHand = i === 1 ? "hour" : i === 2 ? "minute" : undefined;

  return (
    <>
      <SkyBackground h24={10} />
      <div style="position:relative;z-index:1;width:100%;max-width:640px;display:flex;flex-direction:column;align-items:center;gap:18px;padding-top:16px">
        {/* progress dots + close */}
        <div style="display:flex;align-items:center;justify-content:space-between;width:100%">
          <div style="display:flex;gap:7px">
            {L.introSteps.map((_, idx) => (
              <div
                key={idx}
                style={`width:11px;height:11px;border-radius:50%;border:2px solid #2a1a4a;background:${idx === i ? "#ffcf5c" : idx < i ? "#7ee081" : "#2c1b57"}`}
              />
            ))}
          </div>
          <button
            onClick={() => game.exitIntro()}
            aria-label="close"
            style="background:#2c1b57;border:3px solid #3b2f63;color:#fff7f0;border-radius:12px;width:44px;height:40px;font-size:18px;cursor:pointer;font-weight:800"
          >
            ✕
          </button>
        </div>

        {/* demo clock */}
        <ClockFace
          size={260}
          hourAngle={hourAngle}
          minAngle={minAngle}
          numerals={FULL_NUMERALS}
          numeralSize={18}
          showTicks
          pulseHand={pulseHand}
        />

        {/* count-by-fives chips on the last step */}
        {last && (
          <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;max-width:420px">
            {FIVES.map((n, idx) => (
              <div
                key={n}
                style={`background:#fff7f0;color:#2a1a4a;border:2px solid #2a1a4a;border-radius:12px;padding:5px 11px;font-size:17px;font-weight:800;animation:ti-twinkle 1.4s ease-in-out ${idx * 0.12}s infinite`}
              >
                {n}
              </div>
            ))}
          </div>
        )}

        {/* mascot + explanation */}
        <div style="display:flex;align-items:flex-end;gap:12px;width:100%">
          <div style="flex:none;animation:ti-float 3s ease-in-out infinite">
            <Mascot />
          </div>
          <div style="background:#fff7f0;color:#2a1a4a;border:3px solid #2a1a4a;border-radius:18px;border-bottom-left-radius:4px;padding:14px 18px;flex:1;box-shadow:0 5px 0 #120a2e">
            <div style="font-size:22px;font-weight:800;margin-bottom:4px">{step.title}</div>
            <div style="font-size:18px;font-weight:600;line-height:1.35">{step.body}</div>
          </div>
        </div>

        {/* navigation */}
        <div style="display:flex;gap:14px;width:100%;justify-content:space-between">
          <button
            onClick={() => game.introPrev()}
            class="press-3"
            style="background:#2c1b57;color:#fff7f0;border:3px solid #2a1a4a;border-radius:18px;padding:12px 26px;font-size:20px;font-weight:800;cursor:pointer;box-shadow:0 5px 0 #120a2e"
          >
            {i === 0 ? "✕" : L.introBack}
          </button>
          <button
            onClick={() => game.introNext()}
            class="press-3"
            style={`color:#123a42;border:4px solid #2a1a4a;border-radius:18px;padding:12px 30px;font-size:20px;font-weight:800;cursor:pointer;box-shadow:0 5px 0 #120a2e;background:${last ? "#7ee081" : "#4fd8e8"}`}
          >
            {last ? L.introDone : L.introNext}
          </button>
        </div>
      </div>
    </>
  );
}
