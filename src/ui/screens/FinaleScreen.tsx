import { STICKERS, STR, type GameState } from "@game/index.ts";
import type { TimeIslandsGame } from "@game/index.ts";
import { Creature } from "@ui/components/Creature.tsx";
import { Emblem } from "@ui/components/Emblem.tsx";
import { LightSweeps } from "@ui/components/LightSweeps.tsx";

/** Musical notes drifting up through the stage lights. */
const NOTES = [
  { glyph: "♪", left: 6, size: 30, dur: 7.5, delay: 0, color: "#ff5fa2" },
  { glyph: "♫", left: 19, size: 24, dur: 9, delay: 1.4, color: "#4fd8e8" },
  { glyph: "♩", left: 31, size: 27, dur: 8.2, delay: 3.1, color: "#ffcf5c" },
  { glyph: "♬", left: 45, size: 33, dur: 10, delay: 0.7, color: "#a78bfa" },
  { glyph: "♪", left: 58, size: 25, dur: 7.8, delay: 2.5, color: "#7ee081" },
  { glyph: "♫", left: 70, size: 31, dur: 9.4, delay: 4.2, color: "#ff9d5c" },
  { glyph: "♩", left: 82, size: 26, dur: 8.6, delay: 1.9, color: "#4fd8e8" },
  { glyph: "♬", left: 93, size: 29, dur: 10.5, delay: 3.6, color: "#ff5fa2" },
];

/** A mic on a stand, planted at the front of the podium. */
function Microphone({ size = 46 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.9} viewBox="0 0 30 57" aria-hidden="true">
      <ellipse cx="15" cy="53" rx="11" ry="3.6" fill="#2a1a4a" />
      <rect x="13" y="20" width="4" height="32" fill="#3b2f63" stroke="#2a1a4a" stroke-width="2" />
      <rect x="9" y="4" width="12" height="19" rx="6" fill="#8b7fb8" stroke="#2a1a4a" stroke-width="2.5" />
      <path d="M11 9 h8 M11 13 h8 M11 17 h8" stroke="#2a1a4a" stroke-width="1.4" />
    </svg>
  );
}

/**
 * The closing concert: the whole band on a lit podium with microphones,
 * floating notes and their chant. Unlocked once every island is finished.
 */
export function FinaleScreen({ game, state }: { game: TimeIslandsGame; state: GameState }) {
  const L = STR[state.lang];
  // Tallest tier in the middle, the rest stepping down to the sides.
  const order = STICKERS.map((st, i) => ({ st, i }));
  const mid = Math.floor(order.length / 2);
  const tierOf = (i: number) => Math.max(0, 3 - Math.abs(i - mid));

  return (
    <>
      <LightSweeps />
      <div style="position:fixed;inset:0;z-index:0;display:flex;align-items:center;justify-content:center;pointer-events:none;opacity:0.07">
        <Emblem size={620} color="#ffffff" glyph="#ffffff" weight={2.4} />
      </div>

      {/* notes drifting up the stage */}
      <div style="position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none">
        {NOTES.map((n, i) => (
          <div
            key={i}
            style={`position:absolute;bottom:-40px;left:${n.left}%;font-size:${n.size}px;color:${n.color};text-shadow:0 0 12px currentColor;animation:ti-rise ${n.dur}s linear ${n.delay}s infinite`}
          >
            {n.glyph}
          </div>
        ))}
      </div>

      <div style="position:relative;z-index:1;width:100%;max-width:900px;display:flex;flex-direction:column;align-items:center;gap:14px;padding-top:18px">
        <div style="display:flex;align-items:center;gap:14px;width:100%">
          <button
            onClick={() => game.goMap()}
            style="background:#2c1b57;border:3px solid #3b2f63;color:#fff7f0;border-radius:14px;width:54px;height:46px;font-size:22px;cursor:pointer;font-weight:800;flex:none"
          >
            ←
          </button>
          <div style="flex:1;font-size:30px;font-weight:800;text-shadow:0 2px 8px rgba(0,0,0,.45)">
            🎤 {L.finale}
          </div>
        </div>

        {/* the chant, in a bubble over the stage */}
        <div style="background:#fff7f0;color:#2a1a4a;border:5px solid #2a1a4a;border-radius:26px;padding:14px 26px;box-shadow:0 7px 0 #120a2e;font-size:26px;font-weight:800;text-align:center;animation:ti-pop .5s;max-width:92%">
          {L.finaleChant}
        </div>

        {/* the band, each on a podium tier */}
        <div style="display:flex;align-items:flex-end;justify-content:center;gap:2px;flex-wrap:wrap;width:100%;margin-top:4px">
          {order.map(({ st, i }) => {
            const tier = tierOf(i);
            return (
              <div key={st.id} style="display:flex;flex-direction:column;align-items:center;flex:0 0 auto">
                <div
                  style={`animation:ti-bounce ${1.5 + (i % 4) * 0.18}s ease-in-out ${i * 0.12}s infinite`}
                  title={st.name}
                >
                  <Creature sticker={st} width={88} height={116} />
                </div>
                {/* the tier this member stands on */}
                <div
                  style={`width:96px;height:${26 + tier * 16}px;background:linear-gradient(#5b3fa8,#3a2470);border:4px solid #2a1a4a;border-bottom:none;border-radius:8px 8px 0 0;box-shadow:inset 0 4px 0 rgba(255,255,255,.18);display:flex;align-items:flex-start;justify-content:center;padding-top:4px`}
                >
                  <span style="font-size:15px;font-weight:800;color:#fff7f0;text-shadow:0 2px 3px rgba(0,0,0,.5)">
                    {st.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* stage floor with the mics along its front edge */}
        <div style="width:100%;max-width:820px;margin-top:-4px;background:linear-gradient(#2c1b57,#1c1140);border:4px solid #2a1a4a;border-radius:10px;box-shadow:0 8px 0 #120a2e;display:flex;align-items:flex-end;justify-content:space-around;padding:0 12px 6px 12px;min-height:58px">
          <Microphone />
          <Microphone size={38} />
          <Microphone />
          <Microphone size={38} />
          <Microphone />
        </div>

        <div style="font-size:19px;font-weight:800;color:#ffcf5c;text-shadow:0 2px 6px rgba(0,0,0,.5);margin-top:6px">
          {L.finaleChant}
        </div>
      </div>
    </>
  );
}
