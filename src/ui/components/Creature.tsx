import type { Sticker } from "@game/index.ts";

/**
 * The collectible band-member creature. A single parameterised SVG whose parts
 * toggle by opacity from a Sticker's traits (ears, accessory, bird/snake/derp),
 * exactly mirroring the design prototype's `stickerView` mapping.
 */

export interface CreatureProps {
  sticker: Sticker;
  width?: number;
  height?: number;
}

function traits(st: Sticker) {
  return {
    color: st.color,
    earsCatOp: st.ears === "cat" ? 1 : 0,
    earsRoundOp: st.ears === "round" ? 1 : 0,
    accStarOp: st.acc === "star" ? 1 : 0,
    accBoltOp: st.acc === "bolt" ? 1 : 0,
    accBandOp: st.acc === "band" ? 1 : 0,
    accMicOp: st.acc === "mic" ? 1 : 0,
    beakOp: st.bird ? 1 : 0,
    smileOp: st.bird || st.snake ? 0 : 1,
    eyesOp: st.derp ? 0 : 1,
    derpOp: st.derp ? 1 : 0,
    thirdEyeOp: st.snake ? 1 : 0,
    tongueOp: st.derp ? 1 : 0,
    forkOp: st.snake ? 1 : 0,
  };
}

export function Creature({ sticker, width = 104, height = 137 }: CreatureProps) {
  const t = traits(sticker);
  const c = t.color;
  return (
    <svg width={width} height={height} viewBox="0 0 100 132">
      {/* legs */}
      <rect x="37" y="104" width="10" height="20" rx="5" fill="#2a1a4a" />
      <rect x="53" y="104" width="10" height="20" rx="5" fill="#2a1a4a" />
      {/* arms */}
      <rect x="18" y="78" width="9" height="24" rx="4.5" fill={c} stroke="#2a1a4a" stroke-width="3" transform="rotate(18 22 80)" />
      <rect x="73" y="78" width="9" height="24" rx="4.5" fill={c} stroke="#2a1a4a" stroke-width="3" transform="rotate(-18 78 80)" />
      {/* body + belly */}
      <rect x="30" y="72" width="40" height="36" rx="15" fill="#2c1b57" stroke="#2a1a4a" stroke-width="3.5" />
      <rect x="34" y="94" width="32" height="7" rx="3.5" fill="#ffcf5c" stroke="#2a1a4a" stroke-width="2.5" />
      {/* cat ears */}
      <polygon points="26,34 29,4 46,22" fill={c} stroke="#2a1a4a" stroke-width="4" stroke-linejoin="round" opacity={t.earsCatOp} />
      <polygon points="74,34 71,4 54,22" fill={c} stroke="#2a1a4a" stroke-width="4" stroke-linejoin="round" opacity={t.earsCatOp} />
      {/* round ears */}
      <circle cx="25" cy="20" r="9" fill={c} stroke="#2a1a4a" stroke-width="4" opacity={t.earsRoundOp} />
      <circle cx="75" cy="20" r="9" fill={c} stroke="#2a1a4a" stroke-width="4" opacity={t.earsRoundOp} />
      {/* head */}
      <circle cx="50" cy="44" r="30" fill={c} stroke="#2a1a4a" stroke-width="4" />
      {/* headband accessory */}
      <g opacity={t.accBandOp}>
        <path d="M24 32 Q50 12 76 32" stroke="#2a1a4a" stroke-width="6" fill="none" />
        <circle cx="24" cy="36" r="7" fill="#ffcf5c" stroke="#2a1a4a" stroke-width="3" />
        <circle cx="76" cy="36" r="7" fill="#ffcf5c" stroke="#2a1a4a" stroke-width="3" />
      </g>
      {/* star / bolt accessories */}
      <polygon points="50,0 53,8 62,9 55,15 57,24 50,19 43,24 45,15 38,9 47,8" fill="#ffcf5c" stroke="#2a1a4a" stroke-width="2.5" opacity={t.accStarOp} stroke-linejoin="round" />
      <polygon points="56,0 45,14 52,14 47,26 60,10 53,10" fill="#ffcf5c" stroke="#2a1a4a" stroke-width="2.5" opacity={t.accBoltOp} stroke-linejoin="round" />
      {/* normal eyes */}
      <g opacity={t.eyesOp}>
        <path d="M31 32 L42 30" stroke="#2a1a4a" stroke-width="3" stroke-linecap="round" />
        <path d="M58 30 L69 32" stroke="#2a1a4a" stroke-width="3" stroke-linecap="round" />
        <circle cx="38" cy="42" r="8" fill="#fff7f0" />
        <circle cx="62" cy="42" r="8" fill="#fff7f0" />
        <circle cx="39.5" cy="43" r="4" fill="#2a1a4a" />
        <circle cx="63.5" cy="43" r="4" fill="#2a1a4a" />
        <circle cx="41" cy="41.5" r="1.6" fill="#ffffff" />
        <circle cx="65" cy="41.5" r="1.6" fill="#ffffff" />
      </g>
      {/* derp eyes */}
      <g opacity={t.derpOp}>
        <circle cx="36" cy="42" r="6.5" fill="#fff7f0" stroke="#2a1a4a" stroke-width="2" />
        <circle cx="35" cy="40" r="3" fill="#2a1a4a" />
        <circle cx="63" cy="40" r="10" fill="#fff7f0" stroke="#2a1a4a" stroke-width="2" />
        <circle cx="66" cy="43" r="4.5" fill="#2a1a4a" />
      </g>
      {/* third eye (snake) */}
      <g opacity={t.thirdEyeOp}>
        <circle cx="50" cy="26" r="6.5" fill="#fff7f0" stroke="#2a1a4a" stroke-width="2.5" />
        <circle cx="50" cy="26" r="3" fill="#2a1a4a" />
      </g>
      {/* blush */}
      <circle cx="29" cy="52" r="4.5" fill="#ff5fa2" opacity="0.35" />
      <circle cx="71" cy="52" r="4.5" fill="#ff5fa2" opacity="0.35" />
      {/* mouth variants */}
      <path d="M42 54 Q50 63 58 54" stroke="#2a1a4a" stroke-width="3.5" fill="none" stroke-linecap="round" opacity={t.smileOp} />
      <polygon points="43,48 57,48 50,58" fill="#ff9d5c" stroke="#2a1a4a" stroke-width="2.5" stroke-linejoin="round" opacity={t.beakOp} />
      <path d="M46 58 Q50 68 54 58 Z" fill="#ff5fa2" stroke="#2a1a4a" stroke-width="2" opacity={t.tongueOp} />
      <path d="M50 56 L50 66 M50 66 L45 72 M50 66 L55 72" stroke="#ff5fa2" stroke-width="3" fill="none" stroke-linecap="round" opacity={t.forkOp} />
      {/* mic accessory */}
      <g opacity={t.accMicOp}>
        <rect x="75" y="88" width="6" height="22" rx="3" fill="#2a1a4a" transform="rotate(-24 78 92)" />
        <circle cx="82" cy="84" r="8" fill="#8b7fb8" stroke="#2a1a4a" stroke-width="3" />
      </g>
    </svg>
  );
}
