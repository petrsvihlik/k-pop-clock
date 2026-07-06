import { useEffect, useRef } from "preact/hooks";
import {
  fmt,
  fmt24,
  minuteAngle,
  phaseFor,
  routineAt,
  STR,
  timeWords,
  to24,
  type GameState,
  type PhaseKey,
  type TimeIslandsGame,
} from "@game/index.ts";
import { ClockFace, FULL_NUMERALS } from "@ui/components/ClockFace.tsx";
import { SkyBackground } from "@ui/components/SkyBackground.tsx";

const PHASE_EMOJI: Record<PhaseKey, string> = {
  night: "🌙",
  dawn: "🌅",
  morning: "🌤️",
  noon: "☀️",
  afternoon: "🌤️",
  dusk: "🌇",
  evening: "🌆",
};

function DigitalCard({ label, value }: { label: string; value: string }) {
  return (
    <div style="background:#120a2e;border:3px solid #2a1a4a;border-radius:16px;padding:10px 18px;box-shadow:0 4px 0 #0a0620;display:flex;flex-direction:column;align-items:center;gap:3px;min-width:118px">
      <div style="font-size:11px;font-weight:800;color:#8b7fb8;letter-spacing:1px;text-transform:uppercase">{label}</div>
      <div style="font-size:30px;font-weight:800;color:#7ee081;letter-spacing:3px">{value}</div>
    </div>
  );
}

function CreamCard({ label, value }: { label: string; value: string }) {
  return (
    <div style="background:#fff7f0;color:#2a1a4a;border:3px solid #2a1a4a;border-radius:16px;padding:10px 18px;box-shadow:0 4px 0 #120a2e;display:flex;flex-direction:column;align-items:center;gap:3px;min-width:118px">
      <div style="font-size:11px;font-weight:800;color:#6b5aa0;letter-spacing:1px;text-transform:uppercase">{label}</div>
      <div style="font-size:24px;font-weight:800;text-align:center">{value}</div>
    </div>
  );
}

function Toggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      class="press-3"
      style={`border:3px solid #2a1a4a;border-radius:999px;padding:10px 18px;font-weight:800;font-size:15px;cursor:pointer;box-shadow:0 4px 0 #120a2e;background:${active ? "#ffcf5c" : "#2c1b57"};color:${active ? "#2a1a4a" : "#fff7f0"}`}
    >
      {label}
    </button>
  );
}

export function SandboxScreen({ game, state }: { game: TimeIslandsGame; state: GameState }) {
  const L = STR[state.lang];
  const svgRef = useRef<SVGSVGElement>(null);

  const h24 = to24(state.sbH, state.sbPeriod);
  const m = state.sbM;
  const phase = phaseFor(h24);
  const routine = routineAt(h24, m);

  // Live mode: follow the real clock, ticking once a second.
  useEffect(() => {
    if (!state.sbLive) return;
    const id = setInterval(() => game.setSandboxNow(), 1000);
    return () => clearInterval(id);
  }, [state.sbLive, game]);

  return (
    <>
      <SkyBackground h24={h24} m={m} />
      <div style="position:relative;z-index:1;width:100%;max-width:720px;display:flex;flex-direction:column;align-items:center;gap:16px;padding-top:18px">
        {/* header */}
        <div style="display:flex;align-items:center;gap:14px;width:100%">
          <button
            onClick={() => game.goMap()}
            style="background:#2c1b57;border:3px solid #3b2f63;color:#fff7f0;border-radius:14px;width:54px;height:46px;font-size:22px;cursor:pointer;font-weight:800;flex:none"
          >
            ←
          </button>
          <div style="flex:1;font-size:28px;font-weight:800;text-shadow:0 2px 6px rgba(0,0,0,.35)">{L.playground}</div>
          <button
            onClick={() => game.speakSandbox()}
            class="press-scale"
            aria-label="listen"
            style="width:50px;height:50px;border-radius:50%;background:#4fd8e8;border:3px solid #2a1a4a;cursor:pointer;display:flex;align-items:center;justify-content:center;flex:none;padding:0;box-shadow:0 4px 0 #120a2e"
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <polygon points="3,9 8,9 14,4 14,20 8,15 3,15" fill="#2a1a4a" />
              <path d="M17 8 a5 5 0 0 1 0 8" stroke="#2a1a4a" stroke-width="2.5" fill="none" />
            </svg>
          </button>
        </div>

        {/* interactive clock */}
        <ClockFace
          size={280}
          hourAngle={(state.sbH % 12) * 30 + m * 0.5}
          minAngle={minuteAngle(m)}
          numerals={FULL_NUMERALS}
          numeralSize={18}
          showTicks
          knobs
          showMinute={!state.sbHideMin}
          interactive={{
            svgRef,
            onPointerDown: (e) => svgRef.current && game.sbHandDown(e, svgRef.current),
            onPointerMove: (e) => svgRef.current && game.handMove(e, svgRef.current),
            onPointerUp: () => game.handUp(),
          }}
        />
        <div style="font-size:15px;font-weight:700;color:#fff7f0;opacity:.85;text-shadow:0 1px 4px rgba(0,0,0,.4)">
          {L.dragHint}
        </div>

        {/* routine anchor */}
        {routine && (
          <div style="display:flex;align-items:center;gap:12px;background:#fff7f0;color:#2a1a4a;border:3px solid #2a1a4a;border-radius:20px;padding:10px 22px;box-shadow:0 5px 0 #120a2e;animation:ti-pop .4s">
            <span style="font-size:34px">{routine.emoji}</span>
            <span style="font-size:20px;font-weight:800">
              {L.routineNow.split("{name}").join(L.routineNames[routine.key])}
            </span>
          </div>
        )}

        {/* live representations */}
        <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;width:100%">
          <DigitalCard label={L.form12} value={fmt(state.sbH, m)} />
          <DigitalCard label={L.form24} value={fmt24(h24, m)} />
          <CreamCard label={L.ampmLabel} value={`${fmt(state.sbH, m)} ${state.sbPeriod === "am" ? "AM" : "PM"}`} />
          <CreamCard label={L.inWords} value={timeWords(state.sbH, m, state.lang)} />
          <CreamCard label={`${PHASE_EMOJI[phase]}`} value={L.phaseNames[phase]} />
        </div>

        {/* controls */}
        <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;width:100%;margin-top:2px">
          <Toggle label={`AM ${state.sbPeriod === "am" ? "●" : "○"} PM`} active={false} onClick={() => game.toggleSbPeriod()} />
          <Toggle label={`🕐 ${L.now}`} active={false} onClick={() => game.setSandboxNow()} />
          <Toggle label={`▶ ${L.live}`} active={state.sbLive} onClick={() => game.toggleSbLive()} />
          <Toggle label={L.hideMinute} active={state.sbHideMin} onClick={() => game.toggleSbHideMin()} />
        </div>
      </div>
    </>
  );
}
