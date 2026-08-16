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
  shirt?: string;
  openJacket?: string;
  shorts?: string;
  shortsTrim?: string;
  cropTop?: string;
  skirt?: string;
  boots?: string;
  gokdo?: boolean;
  jacket?: boolean;
  hoodie?: boolean;
  heart?: boolean;
  knives?: boolean;
  jewelry?: boolean;
  muscle?: boolean;
  slim?: boolean;
  wink?: boolean;
  lids?: boolean;
  tiger?: boolean;
  magpie?: boolean;
  eyeColor?: string;
  wideEyes?: boolean;
  topHat?: boolean;
  tripleEyes?: boolean;
  beakColor?: string;
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
  shirt,
  openJacket,
  shorts,
  shortsTrim,
  cropTop,
  skirt,
  boots,
  gokdo = false,
  jacket = false,
  hoodie = false,
  heart = false,
  knives = false,
  jewelry = false,
  muscle = false,
  slim = false,
  wink = false,
  lids = false,
  tiger = false,
  magpie = false,
  eyeColor,
  wideEyes = false,
  topHat = false,
  tripleEyes = false,
  beakColor = "#ff9d5c",
  width = 104,
  height = 137,
}: ChibiProps) {
  const human = !!skin;
  const spirit = tiger || magpie;
  const headFill = human ? skin! : c;
  // A crop top bares the midriff: the body itself renders in skin tone.
  const bodyFill = cropTop ? skin! : (shirt ?? outfit ?? "#2c1b57");
  const armFill = muscle ? skin! : magpie ? "#1f2a52" : human ? (openJacket ?? bodyFill) : c;
  const feetFill = human ? (gat ? "#17102b" : CREAM) : magpie ? "#ff9d3d" : c;
  const smile = !bird && !snake && !derp && !tiger;
  // The hair sprout only fits on creatures with a free head top.
  const ahoge = !human && acc !== "star" && acc !== "bolt" && !snake && !topHat;
  // Torso geometry: a rounded rect from y=74 to 120, centred on x=50. The
  // slim variant is a narrower capsule; arms and feet track its edges. Pieces
  // that only appear on default-width characters (jacket, hoodie, jewelry,
  // heart, gat straps, sash, badge) keep the default coordinates.
  const bw = slim ? 38 : 46;
  const bx = 50 - bw / 2;
  const br = slim ? 17 : 20;
  const armDx = bw / 2 + 5;
  const footDx = slim ? 10 : 11;
  // Wide eyes sit a touch higher so the muzzle/mouth keeps clear of them.
  const eyeR = wideEyes ? 10.5 : 8;
  const eyeCy = wideEyes ? 47 : 49;
  const eye = (cx: number) => (
    <g>
      {eyeColor && <circle cx={cx} cy={eyeCy} r={eyeR} fill={eyeColor} />}
      <circle cx={cx} cy={eyeCy} r={eyeColor ? eyeR * 0.5 : eyeR} fill={OUTLINE} />
      <circle cx={cx - 3} cy={eyeCy - 3.5} r={wideEyes ? 3.5 : 3} fill="#ffffff" />
      <circle cx={cx + 3} cy={eyeCy + 4} r={wideEyes ? 1.9 : 1.6} fill="#ffffff" opacity="0.95" />
    </g>
  );
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
      {/* long pigtails hang behind the shoulders; the roots tuck under the head, ties go on later */}
      {human && hair === "pigtails" && (
        <g>
          <path d="M20 37 Q6 52 7 78 Q7 100 11 116 Q16 102 15 80 Q14 58 23 44 Z" fill={hairColor} stroke={OUTLINE} stroke-width="2.5" stroke-linejoin="round" />
          <path d="M80 37 Q94 52 93 78 Q93 100 89 116 Q84 102 85 80 Q86 58 77 44 Z" fill={hairColor} stroke={OUTLINE} stroke-width="2.5" stroke-linejoin="round" />
          <path d="M11 62 Q9.5 80 11 100 M89 62 Q90.5 80 89 100" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round" opacity="0.3" />
        </g>
      )}

      {/* feet peeking out under the body — or heeled boots, whose shafts hide behind the body */}
      {!boots && (
        <g>
          <ellipse cx={50 - footDx} cy="120" rx="9" ry="7.5" fill={feetFill} stroke={OUTLINE} stroke-width="3" />
          <ellipse cx={50 + footDx} cy="120" rx="9" ry="7.5" fill={feetFill} stroke={OUTLINE} stroke-width="3" />
        </g>
      )}
      {boots &&
        [50 - footDx, 50 + footDx].map((cx, i) => (
          <g key={`boot-${i}`}>
            {/* heel spike on the outer side, then the shaft with a patent-leather shine */}
            <rect x={i === 0 ? cx - 6.5 : cx + 3} y="126" width="3.5" height="4.5" rx="1" fill={boots} stroke={OUTLINE} stroke-width="2" />
            <rect x={cx - 7} y="108" width="14" height="20" rx="4.5" fill={boots} stroke={OUTLINE} stroke-width="2.5" />
            <path d={`M${cx - 3} 121.5 L${cx - 3} 125.5`} stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" opacity="0.28" />
          </g>
        ))}

      {/* chubby body + stubby arms (bigger and bare when muscle) */}
      <rect x={bx} y="74" width={bw} height="46" rx={br} fill={bodyFill} stroke={OUTLINE} stroke-width="3.5" />
      <ellipse
        cx={50 - armDx}
        cy="90"
        rx={muscle ? 9 : 7.5}
        ry={muscle ? 12.5 : 11}
        fill={armFill}
        stroke={OUTLINE}
        stroke-width="3"
        transform={`rotate(18 ${50 - armDx} 90)`}
      />
      <ellipse
        cx={50 + armDx}
        cy="90"
        rx={muscle ? 9 : 7.5}
        ry={muscle ? 12.5 : 11}
        fill={armFill}
        stroke={OUTLINE}
        stroke-width="3"
        transform={`rotate(-18 ${50 + armDx} 90)`}
      />
      {spirit && <ellipse cx="50" cy="99" rx="13" ry="11" fill={accent} stroke={OUTLINE} stroke-width="2.5" />}
      {!spirit && !human && <circle cx="50" cy="99" r="11.5" fill={accent} stroke={OUTLINE} stroke-width="2.5" />}

      {/* outfit detailing */}
      {shorts && (
        <g>
          {/* exactly the body's bottom rounded region, so nothing pokes past the silhouette */}
          <path
            d={`M${bx} ${120 - br} A${br} ${br} 0 0 0 ${bx + br} 120 L${bx + bw - br} 120 A${br} ${br} 0 0 0 ${bx + bw} ${120 - br} Z`}
            fill={shorts}
            stroke={OUTLINE}
            stroke-width="2.5"
          />
          <path d="M50 112 L50 119" stroke={OUTLINE} stroke-width="2" />
          {shortsTrim && (
            <path
              d={`M${bx + 6} ${122 - br} L${bx + 11} 116 M${bx + bw - 6} ${122 - br} L${bx + bw - 11} 116`}
              stroke={shortsTrim}
              stroke-width="2.5"
              stroke-linecap="round"
            />
          )}
        </g>
      )}
      {cropTop && (
        <path
          d={`M${bx} ${74 + br} A${br} ${br} 0 0 1 ${bx + br} 74 L${bx + bw - br} 74 A${br} ${br} 0 0 1 ${bx + bw} ${74 + br} Z`}
          fill={cropTop}
          stroke={OUTLINE}
          stroke-width="2.5"
        />
      )}
      {skirt && (
        <g>
          {/* flares past the torso and its hem dips below the body's bottom edge */}
          <path
            d={`M${bx + 2} 101 L${bx - 6} 119 Q50 127 ${bx + bw + 6} 119 L${bx + bw - 2} 101 Z`}
            fill={skirt}
            stroke={OUTLINE}
            stroke-width="2.5"
            stroke-linejoin="round"
          />
          <path
            d={`M${bx + 13} 103 L${bx + 9} 121 M50 103 L50 123 M${bx + bw - 13} 103 L${bx + bw - 9} 121`}
            stroke={OUTLINE}
            stroke-width="1.5"
            stroke-linecap="round"
            opacity="0.3"
          />
        </g>
      )}
      {openJacket && (
        <g>
          <rect x="27" y="74" width="14" height="34" rx="7" fill={openJacket} stroke={OUTLINE} stroke-width="2.5" />
          <rect x="59" y="74" width="14" height="34" rx="7" fill={openJacket} stroke={OUTLINE} stroke-width="2.5" />
        </g>
      )}
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
      {human && (hair === "buns" || hair === "braidBuns") && (
        <g>
          <circle cx="25" cy="18" r={hair === "braidBuns" ? 8.5 : 8} fill={hairColor} stroke={OUTLINE} stroke-width="3" />
          <circle cx="75" cy="18" r={hair === "braidBuns" ? 8.5 : 8} fill={hairColor} stroke={OUTLINE} stroke-width="3" />
          {hair === "braidBuns" && (
            // Stacked chevrons read as braid plaits; a light sheen so they show on dark hair too.
            <path
              d="M21 13 L25 16 L29 13 M20 17.5 L25 20.5 L30 17.5 M21 22 L25 25 L29 22 M71 13 L75 16 L79 13 M70 17.5 L75 20.5 L80 17.5 M71 22 L75 25 L79 22"
              stroke="#ffffff"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
              opacity="0.35"
            />
          )}
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
          // Arc = the head ellipse (50,46 r33x30) grown by ~1 for volume, spanning
          // its full width so the arc's center coincides with the head's.
          d="M16 46 A34 31.5 0 0 1 84 46 Q76 37 66 39 Q58 33 50 35 Q42 33 34 39 Q24 37 16 46 Z"
          fill={hairColor}
          stroke={OUTLINE}
          stroke-width="3"
          stroke-linejoin="round"
        />
      )}
      {human && hair === "pigtails" && (
        <g>
          <circle cx="17.5" cy="40" r="4" fill="#ffcf5c" stroke={OUTLINE} stroke-width="2.5" />
          <circle cx="82.5" cy="40" r="4" fill="#ffcf5c" stroke={OUTLINE} stroke-width="2.5" />
        </g>
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
      {topHat && (
        <g>
          <rect x="38" y="0.5" width="24" height="16" rx="3" fill="#17102b" stroke={OUTLINE} stroke-width="2.5" />
          <rect x="39" y="12" width="22" height="3.5" fill="#3b2f63" />
          <ellipse cx="50" cy="17" rx="17" ry="4" fill="#17102b" stroke={OUTLINE} stroke-width="2.5" />
        </g>
      )}
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
      {!derp && !tripleEyes && (
        <g>
          {eye(36)}
          {!wink && eye(64)}
          {wink && <path d="M58 47 Q64 52 70 47" stroke={OUTLINE} stroke-width="3" fill="none" stroke-linecap="round" />}
        </g>
      )}
      {tripleEyes && (
        <g>
          {[27, 37.5, 48].map((cy) => (
            <g key={cy}>
              <circle cx="50" cy={cy} r="4.5" fill={eyeColor ?? CREAM} stroke={OUTLINE} stroke-width="2" />
              <circle cx="50" cy={cy} r="2.2" fill={OUTLINE} />
              <circle cx="48.7" cy={cy - 1.4} r="0.9" fill="#ffffff" />
            </g>
          ))}
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
      {bird && <polygon points="44,54 56,54 50,63" fill={beakColor} stroke={OUTLINE} stroke-width="2.5" stroke-linejoin="round" />}
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
      {gokdo && (
        <g>
          {/* wooden shaft past the right arm, gold ferrule, curved single-edged blade */}
          <path d="M83 124 L91 30" stroke="#5b3a1e" stroke-width="3.5" stroke-linecap="round" />
          <path d="M83 124 L91 30" stroke="#8a5a2b" stroke-width="1.2" stroke-linecap="round" opacity="0.6" />
          <rect x="87.5" y="27" width="7" height="5" rx="1.5" fill="#ffcf5c" stroke={OUTLINE} stroke-width="1.8" transform="rotate(5 91 29.5)" />
          <path d="M92 28 Q101 16 90 4 Q93 17 89.5 28.5 Z" fill="#dbe4f3" stroke={OUTLINE} stroke-width="2" stroke-linejoin="round" />
          <path d="M91.5 24 Q95 16 90.5 8" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" opacity="0.7" />
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
      shirt={sticker.shirt}
      openJacket={sticker.openJacket}
      shorts={sticker.shorts}
      shortsTrim={sticker.shortsTrim}
      cropTop={sticker.cropTop}
      skirt={sticker.skirt}
      boots={sticker.boots}
      gokdo={sticker.gokdo}
      jacket={sticker.jacket}
      hoodie={sticker.hoodie}
      heart={sticker.heart}
      knives={sticker.knives}
      jewelry={sticker.jewelry}
      muscle={sticker.muscle}
      slim={sticker.slim}
      wink={sticker.wink}
      lids={sticker.lids}
      tiger={sticker.tiger}
      magpie={sticker.magpie}
      eyeColor={sticker.eyeColor}
      wideEyes={sticker.wideEyes}
      topHat={sticker.topHat}
      tripleEyes={sticker.tripleEyes}
      beakColor={sticker.beakColor}
      width={width}
      height={height}
    />
  );
}
