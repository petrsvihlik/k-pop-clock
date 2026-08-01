import type { Accessory, Ears, Hair, Sticker } from "@game/index.ts";

/**
 * Chibi band members: oversized head, no neck, stubby limbs, big glossy eyes.
 * `Chibi` is the shared parameterised drawing; `Creature` maps a Sticker's
 * traits onto it (the Mascot reuses it with fixed props). Creatures are furry
 * blobs, humans (skin set) get hair + outfits, spirits (tiger/magpie) get
 * animal detailing — all sharing the same body plan and eye language.
 */

const OUTLINE = "#2a1a4a";
const CREAM = "#fff7f0";

export interface ChibiProps {
  /** Fur color (creatures/spirits); unused for humans. */
  color: string;
  /** Belly badge / spirit belly + headband bobble color. */
  accent?: string;
  ears?: Ears;
  acc?: Accessory;
  bird?: boolean;
  snake?: boolean;
  derp?: boolean;
  skin?: string;
  hair?: Hair;
  hairColor?: string;
  outfit?: string;
  gat?: boolean;
  marks?: boolean;
  sash?: string;
  jacket?: boolean;
  hoodie?: boolean;
  heart?: boolean;
  knives?: boolean;
  jewelry?: boolean;
  muscle?: boolean;
  wink?: boolean;
  lids?: boolean;
  tiger?: boolean;
  magpie?: boolean;
  width?: number;
  height?: number;
}

export function Chibi({
  color: c,
  accent = "#ffcf5c",
  ears = "none",
  acc = "none",
  bird = false,
  snake = false,
  derp = false,
  skin,
  hair,
  hairColor = "#2f2440",
  outfit,
  gat = false,
  marks = false,
  sash,
  jacket = false,
  hoodie = false,
  heart = false,
  knives = false,
  jewelry = false,
  muscle = false,
  wink = false,
  lids = false,
  tiger = false,
  magpie = false,
  width = 104,
  height = 137,
}: ChibiProps) {
  const human = !!skin;
  const spirit = tiger || magpie;
  const headFill = human ? skin! : c;
  const bodyFill = outfit ?? "#2c1b57";
  const armFill = muscle ? skin! : magpie ? "#1f2a52" : human ? bodyFill : c;
  const feetFill = human ? (gat ? "#17102b" : CREAM) : magpie ? "#ff9d3d" : c;
  const smile = !bird && !snake && !derp && !tiger;
  // The hair sprout only fits on creatures with a free head top.
  const ahoge = !human && acc !== "star" && acc !== "bolt" && !snake;
  return (
    <svg width={width} height={height} viewBox="0 0 100 132">
      {/* ears (behind the head) */}
      {!human && ears === "cat" && (
        <g stroke-linejoin="round">
          <polygon points="23,30 26,3 45,15" fill={c} stroke={OUTLINE} stroke-width="4" />
          <polygon points="77,30 74,3 55,15" fill={c} stroke={OUTLINE} stroke-width="4" />
          <polygon points="28,24 29,11 38,15" fill={CREAM} opacity="0.55" />
          <polygon points="72,24 71,11 62,15" fill={CREAM} opacity="0.55" />
        </g>
      )}
      {!human && ears === "round" && (
        <g>
          <circle cx="23" cy="17" r="10" fill={c} stroke={OUTLINE} stroke-width="4" />
          <circle cx="77" cy="17" r="10" fill={c} stroke={OUTLINE} stroke-width="4" />
          <circle cx="23" cy="17" r="4.5" fill={CREAM} opacity="0.55" />
          <circle cx="77" cy="17" r="4.5" fill={CREAM} opacity="0.55" />
        </g>
      )}

      {/* tails (behind the body) */}
      {tiger && (
        <g>
          <path d="M72 114 Q88 112 85 98" stroke={c} stroke-width="7" fill="none" stroke-linecap="round" />
          <path d="M80 111 L85 108 M83 104 L87 102" stroke="#1a1030" stroke-width="3" stroke-linecap="round" />
        </g>
      )}
      {magpie && (
        <polygon points="30,110 36,116 14,128" fill="#1f2a52" stroke={OUTLINE} stroke-width="2.5" stroke-linejoin="round" />
      )}

      {/* feet peeking out under the body */}
      <ellipse cx="39" cy="120" rx="9" ry="7.5" fill={feetFill} stroke={OUTLINE} stroke-width="3" />
      <ellipse cx="61" cy="120" rx="9" ry="7.5" fill={feetFill} stroke={OUTLINE} stroke-width="3" />

      {/* chubby body + stubby arms (bigger and bare when muscle) */}
      <rect x="27" y="74" width="46" height="46" rx="20" fill={bodyFill} stroke={OUTLINE} stroke-width="3.5" />
      <ellipse
        cx="22"
        cy="90"
        rx={muscle ? 9 : 7.5}
        ry={muscle ? 12.5 : 11}
        fill={armFill}
        stroke={OUTLINE}
        stroke-width="3"
        transform="rotate(18 22 90)"
      />
      <ellipse
        cx="78"
        cy="90"
        rx={muscle ? 9 : 7.5}
        ry={muscle ? 12.5 : 11}
        fill={armFill}
        stroke={OUTLINE}
        stroke-width="3"
        transform="rotate(-18 78 90)"
      />
      {spirit && <ellipse cx="50" cy="99" rx="13" ry="11" fill={accent} stroke={OUTLINE} stroke-width="2.5" />}
      {!spirit && !human && <circle cx="50" cy="99" r="11.5" fill={accent} stroke={OUTLINE} stroke-width="2.5" />}

      {/* outfit detailing */}
      {jacket && (
        <g>
          <polygon points="35,76 46,76 35,92" fill="#120d1d" />
          <polygon points="65,76 54,76 65,92" fill="#120d1d" />
          <path d="M50 78 L50 116" stroke="#b7c0d8" stroke-width="2" />
          <circle cx="50" cy="82" r="1.6" fill="#b7c0d8" />
          <path d="M31 100 L69 88" stroke="#b7c0d8" stroke-width="2.5" />
        </g>
      )}
      {hoodie && (
        <g>
          <path d="M44 78 L43 88 M56 78 L57 88" stroke={CREAM} stroke-width="2" stroke-linecap="round" />
          <polygon
            points="50,92 52,97 57,97 53,100 55,105 50,102 45,105 47,100 43,97 48,97"
            fill={CREAM}
            opacity="0.95"
          />
        </g>
      )}
      {jewelry && (
        <g>
          <polygon points="43,76 57,76 50,93" fill={skin} stroke={OUTLINE} stroke-width="1.5" />
          <path d="M42 80 Q50 90 58 80" stroke="#ffcf5c" stroke-width="2" fill="none" />
          <circle cx="50" cy="87" r="2.2" fill="#ffcf5c" stroke={OUTLINE} stroke-width="1.2" />
        </g>
      )}
      {heart && (
        <path
          d="M50 104 Q44 97 47 93 Q50 90 50 95 Q50 90 53 93 Q56 97 50 104 Z"
          fill="#f472b6"
          stroke={OUTLINE}
          stroke-width="1.8"
        />
      )}
      {gat && <path d="M34 76 L50 92 M66 76 L50 92" stroke={CREAM} stroke-width="4" stroke-linecap="round" />}
      {sash && <rect x="30" y="108" width="40" height="5" rx="2.5" fill={sash} stroke={OUTLINE} stroke-width="2" />}

      {/* head overlapping the body — the no-neck chibi merge */}
      <ellipse cx="50" cy="46" rx="33" ry="30" fill={headFill} stroke={OUTLINE} stroke-width="3.5" />
      {!human && (
        <ellipse
          cx="37"
          cy="30"
          rx="11"
          ry="6"
          fill={magpie ? "#7de2ff" : "#ffffff"}
          opacity={magpie ? 0.3 : 0.18}
          transform="rotate(-16 37 30)"
        />
      )}
      {ahoge && <path d="M50 17 Q47 5 57 7 Q51 10 52 17 Z" fill={c} stroke={OUTLINE} stroke-width="3" stroke-linejoin="round" />}

      {/* hair (humans): under-shapes first, then the fringed cap, then side pieces */}
      {human && hair === "buns" && (
        <g>
          <circle cx="21" cy="13" r="8" fill={hairColor} stroke={OUTLINE} stroke-width="3" />
          <circle cx="79" cy="13" r="8" fill={hairColor} stroke={OUTLINE} stroke-width="3" />
        </g>
      )}
      {human && hair === "fluffy" && (
        <g>
          <circle cx="32" cy="15" r="7.5" fill={hairColor} stroke={OUTLINE} stroke-width="3" />
          <circle cx="68" cy="15" r="7.5" fill={hairColor} stroke={OUTLINE} stroke-width="3" />
          <circle cx="50" cy="11" r="7.5" fill={hairColor} stroke={OUTLINE} stroke-width="3" />
        </g>
      )}
      {human && (
        <path
          d="M17.5 46 A33 30 0 0 1 82.5 46 Q76 37 66 39 Q58 33 50 35 Q42 33 34 39 Q24 37 17.5 46 Z"
          fill={hairColor}
          stroke={OUTLINE}
          stroke-width="3"
          stroke-linejoin="round"
        />
      )}
      {human && hair === "bob" && (
        <g>
          <path d="M17.5 44 Q14 60 20 68 Q27 62 25 46 Z" fill={hairColor} stroke={OUTLINE} stroke-width="3" stroke-linejoin="round" />
          <path d="M82.5 44 Q86 60 80 68 Q73 62 75 46 Z" fill={hairColor} stroke={OUTLINE} stroke-width="3" stroke-linejoin="round" />
        </g>
      )}
      {human && hair === "curtain" && (
        <g>
          <path d="M20 40 Q18 52 24 57 Q28 48 26 40 Z" fill={hairColor} stroke={OUTLINE} stroke-width="3" stroke-linejoin="round" />
          <path d="M80 40 Q82 52 76 57 Q72 48 74 40 Z" fill={hairColor} stroke={OUTLINE} stroke-width="3" stroke-linejoin="round" />
        </g>
      )}
      {human && hair === "braid" && (
        <g>
          <circle cx="80" cy="56" r="5.5" fill={hairColor} stroke={OUTLINE} stroke-width="2.5" />
          <circle cx="83" cy="68" r="5.5" fill={hairColor} stroke={OUTLINE} stroke-width="2.5" />
          <circle cx="85" cy="80" r="5.5" fill={hairColor} stroke={OUTLINE} stroke-width="2.5" />
          <circle cx="86" cy="92" r="5" fill={hairColor} stroke={OUTLINE} stroke-width="2.5" />
          <circle cx="86.5" cy="100" r="3" fill="#ffcf5c" stroke={OUTLINE} stroke-width="2" />
        </g>
      )}

      {/* gat hat over the hair */}
      {gat && (
        <g>
          <path d="M24 20 Q28 44 42 60 M76 20 Q72 44 58 60" stroke="#17102b" stroke-width="1.8" fill="none" opacity="0.7" />
          <rect x="39" y="3" width="22" height="17" rx="5" fill="#17102b" stroke={OUTLINE} stroke-width="2.5" />
          <ellipse cx="50" cy="18" rx="29" ry="5.5" fill="#17102b" stroke={OUTLINE} stroke-width="2.5" opacity="0.95" />
        </g>
      )}

      {/* accessories on the head */}
      {acc === "band" && (
        <g>
          <path d="M20 33 Q50 13 80 33" stroke={OUTLINE} stroke-width="6" fill="none" />
          <circle cx="20" cy="37" r="6.5" fill={accent} stroke={OUTLINE} stroke-width="3" />
          <circle cx="80" cy="37" r="6.5" fill={accent} stroke={OUTLINE} stroke-width="3" />
        </g>
      )}
      {acc === "star" && (
        <polygon
          points="50,1 53,9 61,10 55,16 57,24 50,19 43,24 45,16 39,10 47,9"
          fill="#ffcf5c"
          stroke={OUTLINE}
          stroke-width="2.5"
          stroke-linejoin="round"
        />
      )}
      {acc === "bolt" && (
        <polygon
          points="56,1 45,15 51,15 46,26 59,10 52,10"
          fill="#ffcf5c"
          stroke={OUTLINE}
          stroke-width="2.5"
          stroke-linejoin="round"
        />
      )}

      {/* tiger detailing */}
      {tiger && (
        <g>
          <path
            d="M22 36 Q28 38 26 45 M78 36 Q72 38 74 45 M45 21 L46 29 M55 21 L54 29"
            stroke="#1a1030"
            stroke-width="3.5"
            fill="none"
            stroke-linecap="round"
          />
          <path d="M30 34 Q36 31 42 34 M58 34 Q64 31 70 34" stroke="#1a1030" stroke-width="2.5" fill="none" stroke-linecap="round" />
        </g>
      )}

      {/* big glossy eyes */}
      {!derp && (
        <g>
          <circle cx="36" cy="49" r="8" fill={OUTLINE} />
          <circle cx="33" cy="45.5" r="3" fill="#ffffff" />
          <circle cx="39" cy="53" r="1.6" fill="#ffffff" opacity="0.95" />
          {!wink && (
            <g>
              <circle cx="64" cy="49" r="8" fill={OUTLINE} />
              <circle cx="61" cy="45.5" r="3" fill="#ffffff" />
              <circle cx="67" cy="53" r="1.6" fill="#ffffff" opacity="0.95" />
            </g>
          )}
          {wink && <path d="M58 47 Q64 52 70 47" stroke={OUTLINE} stroke-width="3" fill="none" stroke-linecap="round" />}
        </g>
      )}
      {lids && (
        <g>
          <rect x="27" y="40" width="18" height="5" fill={headFill} />
          <rect x="55" y="40" width="18" height="5" fill={headFill} />
          <path d="M28 45 L44 45 M56 45 L72 45" stroke={OUTLINE} stroke-width="2.5" stroke-linecap="round" />
        </g>
      )}
      {derp && (
        <g>
          <circle cx="34" cy="47" r="6" fill={CREAM} stroke={OUTLINE} stroke-width="2" />
          <circle cx="33" cy="45" r="3" fill={OUTLINE} />
          <circle cx="65" cy="45" r="9.5" fill={CREAM} stroke={OUTLINE} stroke-width="2" />
          <circle cx="68" cy="48" r="4.5" fill={OUTLINE} />
          <circle cx="66.5" cy="46" r="1.5" fill="#ffffff" />
        </g>
      )}
      {snake && (
        <g>
          <circle cx="50" cy="29" r="6" fill={CREAM} stroke={OUTLINE} stroke-width="2.5" />
          <circle cx="50" cy="29.5" r="2.8" fill={OUTLINE} />
          <circle cx="48.8" cy="28" r="1" fill="#ffffff" />
        </g>
      )}
      {magpie && (
        <path d="M28 39 L42 43 M72 39 L58 43" stroke={OUTLINE} stroke-width="2.5" stroke-linecap="round" />
      )}
      {marks && (
        <g fill="#6ee7ff" opacity="0.9">
          <polygon points="21,47 24,50 21,53 18,50" />
          <polygon points="26,55 28,57 26,59 24,57" />
        </g>
      )}

      {/* blush — deeper rose than the pink fur so it reads on Ruby too */}
      <ellipse cx="24" cy="59" rx="5.5" ry="3.2" fill="#d9267b" opacity="0.45" />
      <ellipse cx="76" cy="59" rx="5.5" ry="3.2" fill="#d9267b" opacity="0.45" />

      {/* mouth variants */}
      {smile && <path d="M44 59 Q50 66.5 56 59" stroke={OUTLINE} stroke-width="3" fill="none" stroke-linecap="round" />}
      {bird && <polygon points="44,54 56,54 50,63" fill="#ff9d5c" stroke={OUTLINE} stroke-width="2.5" stroke-linejoin="round" />}
      {tiger && (
        <g>
          <ellipse cx="50" cy="59" rx="13" ry="9.5" fill={CREAM} stroke={OUTLINE} stroke-width="2.5" />
          <path d="M47 55 Q50 58 53 55 Z" fill="#1a1030" stroke={OUTLINE} stroke-width="1.5" stroke-linejoin="round" />
          <path d="M39 60 Q50 70 61 60" stroke={OUTLINE} stroke-width="2.5" fill="none" stroke-linecap="round" />
          <rect x="45" y="63" width="4" height="4" rx="1" fill="#ffffff" stroke={OUTLINE} stroke-width="1.2" />
          <rect x="51" y="63" width="4" height="4" rx="1" fill="#ffffff" stroke={OUTLINE} stroke-width="1.2" />
        </g>
      )}
      {derp && <path d="M46 61 Q50 70 54 61 Z" fill="#ff5fa2" stroke={OUTLINE} stroke-width="2" />}
      {snake && (
        <path d="M50 61 L50 70 M50 70 L46 76 M50 70 L54 76" stroke="#ff5fa2" stroke-width="3" fill="none" stroke-linecap="round" />
      )}

      {/* held things (front) */}
      {acc === "mic" && (
        <g>
          <rect x="75.5" y="77" width="5.5" height="17" rx="2.5" fill={OUTLINE} transform="rotate(-22 78 84)" />
          <circle cx="81.5" cy="72.5" r="7" fill="#8b7fb8" stroke={OUTLINE} stroke-width="3" />
        </g>
      )}
      {knives && (
        <g>
          <polygon points="12,108 16,94 20,108" fill="#dbe4f3" stroke={OUTLINE} stroke-width="2" stroke-linejoin="round" />
          <rect x="14" y="108" width="4" height="7" rx="1.5" fill={OUTLINE} />
          <polygon points="80,108 84,94 88,108" fill="#dbe4f3" stroke={OUTLINE} stroke-width="2" stroke-linejoin="round" />
          <rect x="82" y="108" width="4" height="7" rx="1.5" fill={OUTLINE} />
        </g>
      )}
    </svg>
  );
}

export interface CreatureProps {
  sticker: Sticker;
  width?: number;
  height?: number;
}

/** The collectible band member, drawn from a Sticker's traits. */
export function Creature({ sticker, width = 104, height = 137 }: CreatureProps) {
  return (
    <Chibi
      color={sticker.color}
      accent={sticker.accent}
      ears={sticker.ears}
      acc={sticker.acc}
      bird={sticker.bird}
      snake={sticker.snake}
      derp={sticker.derp}
      skin={sticker.skin}
      hair={sticker.hair}
      hairColor={sticker.hairColor}
      outfit={sticker.outfit}
      gat={sticker.gat}
      marks={sticker.marks}
      sash={sticker.sash}
      jacket={sticker.jacket}
      hoodie={sticker.hoodie}
      heart={sticker.heart}
      knives={sticker.knives}
      jewelry={sticker.jewelry}
      muscle={sticker.muscle}
      wink={sticker.wink}
      lids={sticker.lids}
      tiger={sticker.tiger}
      magpie={sticker.magpie}
      width={width}
      height={height}
    />
  );
}
