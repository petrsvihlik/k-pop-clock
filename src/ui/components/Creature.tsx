import type { Accessory, Ears, Hair, Sticker } from "@game/index.ts";

/**
 * Chibi band members: oversized head, no neck, stubby limbs, big glossy eyes.
 * `Chibi` is the shared parameterised drawing; `Creature` maps a Sticker's
 * traits onto it (the Mascot reuses it with fixed props). Creatures are furry
 * blobs, humans (skin set) get hair + outfits, the tiger spirit gets animal
 * detailing — all sharing the same body plan and eye language. The magpie is
 * the one exception: a side-view bird with its own drawing (`MagpieProfile`).
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
  marks?: string;
  marksGlow?: string;
  robe?: string;
  slitPupils?: boolean;
  sash?: string;
  shirt?: string;
  openJacket?: string;
  shorts?: string;
  shortsTrim?: string;
  cropTop?: string;
  skirt?: string;
  boots?: string;
  gokdo?: boolean;
  argyle?: string;
  collar?: string;
  cap?: string;
  neonNails?: boolean;
  makeup?: string;
  necklace?: string;
  jacket?: boolean;
  hoodie?: boolean;
  heart?: boolean;
  knives?: boolean;
  shinkal?: boolean;
  jewelry?: boolean;
  muscle?: boolean;
  slim?: boolean;
  wink?: boolean;
  lids?: boolean;
  tiger?: boolean;
  eyeColor?: string;
  sclera?: string;
  hypnoEyes?: boolean;
  crossEyes?: boolean;
  stripeColor?: string;
  wideEyes?: boolean;
  earInner?: string;
  rosettes?: string;
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
  marks,
  marksGlow,
  robe,
  slitPupils = false,
  sash,
  shirt,
  openJacket,
  shorts,
  shortsTrim,
  cropTop,
  skirt,
  boots,
  gokdo = false,
  argyle,
  collar,
  cap,
  neonNails = false,
  makeup,
  necklace,
  jacket = false,
  hoodie = false,
  heart = false,
  knives = false,
  shinkal = false,
  jewelry = false,
  muscle = false,
  slim = false,
  wink = false,
  lids = false,
  tiger = false,
  eyeColor,
  sclera,
  hypnoEyes = false,
  crossEyes = false,
  stripeColor = "#111111",
  wideEyes = false,
  earInner,
  rosettes,
  topHat = false,
  tripleEyes = false,
  beakColor = "#ff9d5c",
  width = 104,
  height = 137,
}: ChibiProps) {
  const human = !!skin;
  const headFill = human ? skin! : c;
  // A crop top bares the midriff: the body itself renders in skin tone.
  const bodyFill = cropTop ? skin! : (shirt ?? outfit ?? "#2c1b57");
  const armFill = muscle ? skin! : human ? (openJacket ?? bodyFill) : c;
  const feetFill = human ? (gat ? "#111113" : CREAM) : c;
  // Arcane trim on the robe borrows the skin markings' colors.
  const arcane = marks ?? "#c9d1e0";
  const arcaneGlow = marksGlow ?? "#4b2e83";
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
  // Where the fists sit (the lower tip of each tilted arm), for hand-held gear.
  const fistL: [number, number] = [50 - armDx + 3.4, 100.5];
  const fistR: [number, number] = [50 + armDx - 3.4, 100.5];
  // A shin-kal pointing up from its grip at the origin: silver blade, yellow
  // guard and handle, teal turtle charm and tassel at the pommel.
  const dagger = (x: number, y: number, deg: number, key: string) => (
    <g key={key} transform={`translate(${x} ${y}) rotate(${deg})`}>
      <polygon points="-2.2,-3 0,-19 2.2,-3" fill="#c0c0c0" stroke={OUTLINE} stroke-width="1.4" stroke-linejoin="round" />
      <path d="M0 -16 L0 -5" stroke="#ffffff" stroke-width="0.8" opacity="0.7" />
      <rect x="-3.2" y="-4" width="6.4" height="1.8" rx="0.6" fill="#ffd700" stroke={OUTLINE} stroke-width="1" />
      <rect x="-1.7" y="-2.4" width="3.4" height="8" rx="1" fill="#ffd700" stroke={OUTLINE} stroke-width="1.2" />
      <circle cx="0" cy="8.2" r="1.7" fill="#008080" stroke={OUTLINE} stroke-width="0.9" />
      <circle cx="0" cy="8" r="0.7" fill="#5fd3c8" />
      <path d="M0 9.8 L-1.6 13.5 M0 9.8 L0 14 M0 9.8 L1.6 13.5" stroke="#008080" stroke-width="1.1" stroke-linecap="round" />
    </g>
  );
  // Wide eyes sit a touch higher so the muzzle/mouth keeps clear of them.
  const eyeR = wideEyes ? 10.5 : 8;
  const eyeCy = wideEyes ? 47 : 49;
  // Eye anatomy: solid dark by default; `eyeColor` adds an iris; `sclera` adds
  // an eye-white with a soft glow and shrinks the iris to a ring inside it;
  // `hypnoEyes` replaces the iris with a spiral coiling out from the pupil;
  // `crossEyes` pulls both pupils toward the nose, each off by a different
  // amount so the gaze reads as uncoordinated rather than merely crossed.
  // `drift` is the inward nudge for the pupil: +x for the left eye, −x for the right.
  const eye = (cx: number, drift = 0, dy = 0) => {
    const irisR = sclera ? eyeR * 0.62 : eyeR;
    const pupilR = hypnoEyes ? 1.6 : sclera ? eyeR * 0.34 : eyeColor ? eyeR * 0.5 : eyeR;
    const px = cx + (crossEyes ? drift : 0);
    const py = eyeCy + (crossEyes ? dy : 0);
    return (
      <g>
        {sclera && <circle cx={cx} cy={eyeCy} r={eyeR + 2.5} fill={sclera} opacity="0.35" />}
        {sclera && <circle cx={cx} cy={eyeCy} r={eyeR} fill={sclera} stroke={OUTLINE} stroke-width="2" />}
        {eyeColor && !hypnoEyes && <circle cx={px} cy={py} r={irisR} fill={eyeColor} />}
        {hypnoEyes && (
          // Half-circle arcs of growing radius = a compass spiral, ~6 units across.
          <path
            d="M0 0 a1 1 0 0 1 2 0 a2 2 0 0 1 -4 0 a3 3 0 0 1 6 0 a4 4 0 0 1 -8 0 a5 5 0 0 1 10 0 a6 6 0 0 1 -12 0"
            transform={`translate(${cx} ${eyeCy})`}
            stroke={eyeColor ?? OUTLINE}
            stroke-width="2.2"
            stroke-linecap="round"
            fill="none"
          />
        )}
        {slitPupils ? (
          <ellipse cx={px} cy={py} rx="1.6" ry={eyeR * 0.72} fill={OUTLINE} />
        ) : (
          <circle cx={px} cy={py} r={pupilR} fill={OUTLINE} />
        )}
        {/* a big catchlight fills a solid dark eye; against a coloured sclera it
            would read as a second eyeball, so there it shrinks into the pupil */}
        {!hypnoEyes && !slitPupils && !sclera && (
          <circle cx={px - 3} cy={py - 3.5} r={wideEyes ? 3.5 : 3} fill="#ffffff" />
        )}
        {!hypnoEyes && !slitPupils && sclera && <circle cx={px - 1.3} cy={py - 1.3} r="1.2" fill="#ffffff" />}
        <circle cx={px + 3} cy={py + 4} r={wideEyes ? 1.9 : 1.6} fill="#ffffff" opacity="0.95" />
      </g>
    );
  };
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
          <circle cx="23" cy="17" r="4.5" fill={earInner ?? CREAM} opacity={earInner ? 0.9 : 0.55} />
          <circle cx="77" cy="17" r="4.5" fill={earInner ?? CREAM} opacity={earInner ? 0.9 : 0.55} />
        </g>
      )}
      {!human && ears === "soft" && (
        <g stroke-linejoin="round">
          {/* rounded triangles: cubic curves keep every edge soft; bases tuck under the head */}
          <path d="M20 31 C15 23 17 13 26 10 C34 12 37 19 35 26 Z" fill={c} stroke={OUTLINE} stroke-width="3.5" />
          <path d="M80 31 C85 23 83 13 74 10 C66 12 63 19 65 26 Z" fill={c} stroke={OUTLINE} stroke-width="3.5" />
          <path d="M23.5 26 C21.5 20 22.5 15 26 13 C30 14 32 18 31 23 Z" fill={earInner ?? CREAM} opacity={earInner ? 0.9 : 0.55} />
          <path d="M76.5 26 C78.5 20 77.5 15 74 13 C70 14 68 18 69 23 Z" fill={earInner ?? CREAM} opacity={earInner ? 0.9 : 0.55} />
        </g>
      )}

      {/* tails (behind the body) */}
      {tiger && (
        <g>
          <path d="M72 114 Q88 112 85 98" stroke={c} stroke-width="7" fill="none" stroke-linecap="round" />
          <path d="M80 111 L85 108 M83 104 L87 102" stroke={stripeColor} stroke-width="3" stroke-linecap="round" />
        </g>
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
      {robe && (
        <g>
          {/* two flared panels with tattered hems, parting at the front; sleeves (arms) go on over them */}
          <path d="M27 76 L21 116 L25 121 L29 116 L33 122 L38 117 L44 76 Z" fill={robe} stroke={OUTLINE} stroke-width="2.5" stroke-linejoin="round" />
          <path d="M73 76 L79 116 L75 121 L71 116 L67 122 L62 117 L56 76 Z" fill={robe} stroke={OUTLINE} stroke-width="2.5" stroke-linejoin="round" />
          {/* charcoal jeogori in the opening, with crossed straps, two chains and a pendant */}
          <path d="M44 76 L41 100 L59 100 L56 76 Z" fill="#1c1c21" stroke={OUTLINE} stroke-width="2" stroke-linejoin="round" />
          <path d="M45 77 L58 99 M55 77 L42 99" stroke="#111113" stroke-width="2.4" stroke-linecap="round" />
          <path d="M43 78 Q50 89 57 78 M42 82 Q50 96 58 82" stroke={OUTLINE} stroke-width="2.6" fill="none" stroke-linecap="round" />
          <path d="M43 78 Q50 89 57 78 M42 82 Q50 96 58 82" stroke="#c9d1e0" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-dasharray="1.6 1.2" />
          <circle cx="50" cy="90.5" r="3.8" fill={arcaneGlow} opacity="0.55" />
          <path d="M50 87 L52.8 90.5 L50 94 L47.2 90.5 Z" fill={arcane} stroke={OUTLINE} stroke-width="1" stroke-linejoin="round" />
          {/* thigh chain on the trousers */}
          <path d="M50 105 Q55 111 60 106" stroke={OUTLINE} stroke-width="2.4" fill="none" stroke-linecap="round" />
          <path d="M50 105 Q55 111 60 106" stroke="#c9d1e0" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-dasharray="1.4 1.1" />
          {/* arcane trim along the hems */}
          <g fill={arcaneGlow} opacity="0.5">
            <circle cx="24" cy="116" r="2.6" /><circle cx="31" cy="118" r="2.6" /><circle cx="37" cy="116" r="2.6" />
            <circle cx="76" cy="116" r="2.6" /><circle cx="69" cy="118" r="2.6" /><circle cx="63" cy="116" r="2.6" />
          </g>
          <g fill={arcane}>
            <path d="M24 114.5 L25.5 116 L24 117.5 L22.5 116 Z M31 116.5 L32.5 118 L31 119.5 L29.5 118 Z M37 114.5 L38.5 116 L37 117.5 L35.5 116 Z" />
            <path d="M76 114.5 L77.5 116 L76 117.5 L74.5 116 Z M69 116.5 L70.5 118 L69 119.5 L67.5 118 Z M63 114.5 L64.5 116 L63 117.5 L61.5 116 Z" />
          </g>
        </g>
      )}
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
      {tiger && <ellipse cx="50" cy="99" rx="13" ry="11" fill={accent} stroke={OUTLINE} stroke-width="2.5" />}
      {!tiger && !human && <circle cx="50" cy="99" r="11.5" fill={accent} stroke={OUTLINE} stroke-width="2.5" />}
      {rosettes && (
        <g fill={rosettes}>
          <circle cx="50" cy="83" r="2.5" />
          <circle cx="33" cy="91" r="3" />
          <circle cx="67" cy="91" r="3" />
          <circle cx="35" cy="109" r="2.5" />
          <circle cx="65" cy="109" r="2.5" />
        </g>
      )}

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
      {argyle && (
        <g>
          {/* a row of diamonds across the chest and two staggered below, threaded by thin diagonals */}
          <path d="M30 86 L70 106 M30 106 L70 86" stroke={argyle} stroke-width="1.2" opacity="0.7" />
          <g fill={argyle}>
            <path d="M38 88 L43.5 96 L38 104 L32.5 96 Z" />
            <path d="M50 88 L55.5 96 L50 104 L44.5 96 Z" />
            <path d="M62 88 L67.5 96 L62 104 L56.5 96 Z" />
            <path d="M44 104 L48.5 111 L44 118 L39.5 111 Z" />
            <path d="M56 104 L60.5 111 L56 118 L51.5 111 Z" />
          </g>
        </g>
      )}
      {collar && (
        <g>
          {/* shirt in the V of the neckline, with two collar points folded over it */}
          <path d="M40 75 L50 88 L60 75 Z" fill={collar} />
          <path d="M40 75 L46.5 84.5 L50 79.5 Z M60 75 L53.5 84.5 L50 79.5 Z" fill={collar} stroke="#5b5bc0" stroke-width="1.5" stroke-linejoin="round" />
        </g>
      )}
      {necklace && (
        <g>
          {/* chunky chain (dashed silver over a dark base) and an open diamond pendant with a crystal */}
          <path d="M40 75 Q50 92 60 75" stroke={OUTLINE} stroke-width="4.5" fill="none" stroke-linecap="round" />
          <path d="M40 75 Q50 92 60 75" stroke="#c9d1e0" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="2 1.6" />
          <path d="M50 83 L55 89 L50 95 L45 89 Z" fill="none" stroke={OUTLINE} stroke-width="4" stroke-linejoin="round" />
          <path d="M50 83 L55 89 L50 95 L45 89 Z" fill="none" stroke="#c9d1e0" stroke-width="2" stroke-linejoin="round" />
          <path d="M50 86.5 L52.5 89 L50 91.5 L47.5 89 Z" fill={necklace} stroke={OUTLINE} stroke-width="1" stroke-linejoin="round" />
        </g>
      )}
      {neonNails && (
        <g>
          {/* three tiny polish dots on each fingertip: a different neon per nail */}
          <circle cx="23.5" cy="101" r="1.4" fill="#39ff14" />
          <circle cx="25.6" cy="102.2" r="1.4" fill="#ff10f0" />
          <circle cx="27.7" cy="101" r="1.4" fill="#00f0ff" />
          <circle cx="72.3" cy="101" r="1.4" fill="#ff10f0" />
          <circle cx="74.4" cy="102.2" r="1.4" fill="#00f0ff" />
          <circle cx="76.5" cy="101" r="1.4" fill="#39ff14" />
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
      {robe && (
        <g>
          {/* arcane sigils on the cuffs, at the sleeve tips */}
          <circle cx="25.4" cy="101" r="3.2" fill={arcaneGlow} opacity="0.55" />
          <circle cx="74.6" cy="101" r="3.2" fill={arcaneGlow} opacity="0.55" />
          <path d="M25.4 98.8 L27.4 101 L25.4 103.2 L23.4 101 Z M74.6 98.8 L76.6 101 L74.6 103.2 L72.6 101 Z" fill={arcane} stroke={OUTLINE} stroke-width="0.8" stroke-linejoin="round" />
        </g>
      )}
      {sash && <rect x="30" y="108" width="40" height="5" rx="2.5" fill={sash} stroke={OUTLINE} stroke-width="2" />}

      {/* head overlapping the body — the no-neck chibi merge */}
      <ellipse cx="50" cy="46" rx="33" ry="30" fill={headFill} stroke={OUTLINE} stroke-width="3.5" />
      {!human && (
        <ellipse cx="37" cy="30" rx="11" ry="6" fill="#ffffff" opacity="0.18" transform="rotate(-16 37 30)" />
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
      {human && hair === "mop" && (
        <g>
          {/* fluffy tufts at the temples and a messy fringe, on top of the cap so their curves read as volume */}
          <circle cx="22" cy="32" r="6.5" fill={hairColor} stroke={OUTLINE} stroke-width="3" />
          <circle cx="78" cy="32" r="6.5" fill={hairColor} stroke={OUTLINE} stroke-width="3" />
          <circle cx="37" cy="38" r="4" fill={hairColor} stroke={OUTLINE} stroke-width="2.5" />
          <circle cx="50" cy="40" r="4" fill={hairColor} stroke={OUTLINE} stroke-width="2.5" />
          <circle cx="63" cy="38" r="4" fill={hairColor} stroke={OUTLINE} stroke-width="2.5" />
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
          {/* gathered high on the crown, then plaited down the side; each bead
              overlaps the next so the braid reads as one strand */}
          <circle cx="50" cy="13" r="10" fill={hairColor} stroke={OUTLINE} stroke-width="3" />
          <circle cx="65" cy="18" r="7.5" fill={hairColor} stroke={OUTLINE} stroke-width="2.5" />
          <circle cx="74" cy="28" r="7" fill={hairColor} stroke={OUTLINE} stroke-width="2.5" />
          <circle cx="80" cy="39" r="6.5" fill={hairColor} stroke={OUTLINE} stroke-width="2.5" />
          <circle cx="83" cy="50" r="6" fill={hairColor} stroke={OUTLINE} stroke-width="2.5" />
          <circle cx="85" cy="60" r="5.5" fill={hairColor} stroke={OUTLINE} stroke-width="2.5" />
          <circle cx="85.5" cy="68" r="3.2" fill="#ffcf5c" stroke={OUTLINE} stroke-width="2" />
        </g>
      )}

      {/* tilted newsboy/beret cap: soft dome dipping to the right, short peak under the low side, top button */}
      {cap && (
        <g>
          <ellipse cx="50" cy="21" rx="28" ry="11" fill={cap} stroke={OUTLINE} stroke-width="3" transform="rotate(10 50 21)" />
          <path d="M31 21 Q49 9 68 20" stroke="#d9b23a" stroke-width="1.5" fill="none" stroke-linecap="round" transform="rotate(10 50 21)" />
          <path d="M50 32.5 Q68 39 84 30.5 Q68 34 50 32.5 Z" fill="#d9b23a" stroke={OUTLINE} stroke-width="2.5" stroke-linejoin="round" />
          <circle cx="47" cy="10.5" r="2.2" fill={OUTLINE} />
        </g>
      )}

      {/* gat hat over the hair: tall semi-transparent horsehair crown, wide flat brim, chin straps */}
      {gat && (
        <g>
          <path d="M24 24 Q28 46 42 60 M76 24 Q72 46 58 60" stroke="#111113" stroke-width="1.8" fill="none" opacity="0.7" />
          <rect x="38" y="1" width="24" height="22" rx="4" fill="#111113" opacity="0.8" stroke={OUTLINE} stroke-width="2.5" />
          <ellipse cx="50" cy="22" rx="35" ry="5" fill="#111113" stroke={OUTLINE} stroke-width="2.5" />
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
            stroke={stripeColor}
            stroke-width="3.5"
            fill="none"
            stroke-linecap="round"
          />
          <path d="M30 34 Q36 31 42 34 M58 34 Q64 31 70 34" stroke={stripeColor} stroke-width="2.5" fill="none" stroke-linecap="round" />
        </g>
      )}

      {/* stage makeup: eyeshadow sweeps above each eye, glitter star on the cheek */}
      {makeup && (
        <g>
          <ellipse cx="36" cy="41.5" rx="7.5" ry="2.8" fill={makeup} opacity="0.4" />
          <ellipse cx="64" cy="41.5" rx="7.5" ry="2.8" fill={makeup} opacity="0.4" />
          <path d="M71 53 L72 56 L75 57 L72 58 L71 61 L70 58 L67 57 L70 56 Z" fill="#ffb6c1" stroke={OUTLINE} stroke-width="1" stroke-linejoin="round" />
        </g>
      )}

      {/* big glossy eyes */}
      {!derp && !tripleEyes && (
        <g>
          {eye(36, 3.2, -0.8)}
          {!wink && eye(64, -2.4, 1.1)}
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
        <g>
          {marksGlow && (
            <g fill={marksGlow} opacity="0.5">
              <circle cx="21" cy="50" r="4.5" />
              <circle cx="26" cy="57" r="3.5" />
              <circle cx="79" cy="50" r="4.5" />
              <circle cx="74" cy="57" r="3.5" />
              <circle cx="50" cy="40" r="4.5" />
            </g>
          )}
          <g fill={marks} opacity="0.9">
            <polygon points="21,47 24,50 21,53 18,50" />
            <polygon points="26,55 28,57 26,59 24,57" />
            {marksGlow && (
              <g>
                <polygon points="79,47 82,50 79,53 76,50" />
                <polygon points="74,55 76,57 74,59 72,57" />
                <polygon points="50,36.5 52.5,40 50,43.5 47.5,40" />
              </g>
            )}
          </g>
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
          {/* fur-colored muzzle, pink nose, goofy grin: tongue, flat teeth, little tusks at the corners */}
          <ellipse cx="50" cy="59" rx="13" ry="9.5" fill={c} stroke={OUTLINE} stroke-width="2.5" />
          <path d="M47 55 Q50 58 53 55 Z" fill="#ffb6c1" stroke={OUTLINE} stroke-width="1.5" stroke-linejoin="round" />
          <path d="M39 60 Q50 70 61 60" stroke={OUTLINE} stroke-width="2.5" fill="none" stroke-linecap="round" />
          <path d="M46.5 66 Q50 73 53.5 66 Z" fill="#e53935" stroke={OUTLINE} stroke-width="1.5" stroke-linejoin="round" />
          <rect x="45" y="63" width="4" height="4" rx="1" fill="#ffffff" stroke={OUTLINE} stroke-width="1.2" />
          <rect x="51" y="63" width="4" height="4" rx="1" fill="#ffffff" stroke={OUTLINE} stroke-width="1.2" />
          {/* oversized fangs hanging past the jaw */}
          <path
            d="M38.5 60 L42 72 L45.5 60.5 Z M54.5 60.5 L58 72 L61.5 60 Z"
            fill="#ffffff"
            stroke={OUTLINE}
            stroke-width="1.6"
            stroke-linejoin="round"
          />
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
      {shinkal && (
        <g>
          {/* pink spirit aura around each fist, then three daggers fanned outward per hand */}
          <circle cx={fistL[0]} cy={fistL[1] - 4} r="15" fill="#ff69b4" opacity="0.22" />
          <circle cx={fistR[0]} cy={fistR[1] - 4} r="15" fill="#ff69b4" opacity="0.22" />
          {[-55, -35, -15].map((deg) => dagger(fistL[0], fistL[1], deg, `sl${deg}`))}
          {[15, 35, 55].map((deg) => dagger(fistR[0], fistR[1], deg, `sr${deg}`))}
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

/**
 * The magpie spirit, drawn in profile facing right: long tail, folded wing
 * with the white shoulder patch, white belly, forward beak. Keeps the band's
 * eye language (stacked yellow eyes) and the hat, but on a bird silhouette.
 */
function MagpieProfile({ sticker, width = 104, height = 137 }: CreatureProps) {
  const c = sticker.color;
  const dark = "#1f2a52";
  const belly = sticker.accent ?? CREAM;
  const beak = sticker.beakColor ?? "#ff9d5c";
  const iris = sticker.eyeColor ?? "#ffcf5c";
  const sheen = "#7de2ff";
  const eyeYs = sticker.tripleEyes ? [41, 51.5, 62] : [51.5];
  return (
    <svg width={width} height={height} viewBox="0 0 100 132">
      {/* long tail sweeping back and down, base hidden inside the body */}
      <path d="M34 94 L6 122 L12 128 L40 108 Z" fill={dark} stroke={OUTLINE} stroke-width="2.5" stroke-linejoin="round" />
      <path d="M30 105 L14 121" stroke={sheen} stroke-width="2" stroke-linecap="round" opacity="0.35" />

      {/* legs and toes */}
      <g stroke="#ff9d3d" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <path d="M40 116 L38 125 M50 116 L49 125" stroke-width="3" />
        <path d="M32 126.5 L38 125 L38 128.5 M38 125 L44 126.5 M43 126.5 L49 125 L49 128.5 M49 125 L55 126.5" stroke-width="2.5" />
      </g>

      {/* neck bridge, body, belly */}
      <ellipse cx="52" cy="76" rx="14" ry="8" fill={c} />
      <ellipse cx="46" cy="98" rx="25" ry="21" fill={c} stroke={OUTLINE} stroke-width="3" />
      <ellipse cx="54" cy="104" rx="14" ry="11" fill={belly} />

      {/* folded wing along the back, white shoulder patch, iridescent sheen */}
      <path d="M46 84 Q26 90 22 110 Q34 106 56 90 Z" fill={dark} stroke={OUTLINE} stroke-width="2.5" stroke-linejoin="round" />
      <ellipse cx="44" cy="88" rx="5" ry="3.5" fill={belly} />
      <path d="M40 92 Q30 98 27 106" stroke={sheen} stroke-width="2" stroke-linecap="round" fill="none" opacity="0.35" />

      {/* head — a circle, not a balloon: about the body's size */}
      <ellipse cx="52" cy="72" rx="8" ry="6" fill={c} stroke={OUTLINE} stroke-width="3" />
      <circle cx="56" cy="52" r="23" fill={c} stroke={OUTLINE} stroke-width="3" />
      <ellipse cx="47" cy="40" rx="7" ry="4" fill={sheen} opacity="0.3" transform="rotate(-30 47 40)" />

      {/* beak pointing forward */}
      <polygon points="77,46 95,52.5 77,58" fill={beak} stroke={OUTLINE} stroke-width="2.5" stroke-linejoin="round" />
      <path d="M79 48 L91 51.5" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" opacity="0.35" />

      {/* stacked eyes down the front of the face */}
      {eyeYs.map((cy) => (
        <g key={cy}>
          <circle cx="64" cy={cy} r="4.5" fill={iris} stroke={OUTLINE} stroke-width="2" />
          <circle cx="65" cy={cy} r="2.2" fill={OUTLINE} />
          <circle cx="63.6" cy={cy - 1.4} r="0.9" fill="#ffffff" />
        </g>
      ))}
      <ellipse cx="73" cy="63" rx="3.5" ry="2.2" fill="#d9267b" opacity="0.45" />

      {/* hat: flat brim, taller tapered crown */}
      {sticker.topHat && (
        <g>
          <ellipse cx="55" cy="28" rx="19" ry="4.5" fill="#17102b" stroke={OUTLINE} stroke-width="2.5" />
          <path d="M43 29 L47.5 8 Q55 4.5 62.5 8 L67 29 Z" fill="#17102b" stroke={OUTLINE} stroke-width="2.5" stroke-linejoin="round" />
          <path d="M44.6 23 L65.4 23" stroke="#3b2f63" stroke-width="3.5" />
        </g>
      )}
    </svg>
  );
}

/** The collectible band member, drawn from a Sticker's traits. */
export function Creature({ sticker, width = 104, height = 137 }: CreatureProps) {
  if (sticker.magpie) return <MagpieProfile sticker={sticker} width={width} height={height} />;
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
      marksGlow={sticker.marksGlow}
      robe={sticker.robe}
      slitPupils={sticker.slitPupils}
      sash={sticker.sash}
      shirt={sticker.shirt}
      openJacket={sticker.openJacket}
      shorts={sticker.shorts}
      shortsTrim={sticker.shortsTrim}
      cropTop={sticker.cropTop}
      skirt={sticker.skirt}
      boots={sticker.boots}
      gokdo={sticker.gokdo}
      argyle={sticker.argyle}
      collar={sticker.collar}
      cap={sticker.cap}
      neonNails={sticker.neonNails}
      makeup={sticker.makeup}
      necklace={sticker.necklace}
      jacket={sticker.jacket}
      hoodie={sticker.hoodie}
      heart={sticker.heart}
      knives={sticker.knives}
      shinkal={sticker.shinkal}
      jewelry={sticker.jewelry}
      muscle={sticker.muscle}
      slim={sticker.slim}
      wink={sticker.wink}
      lids={sticker.lids}
      tiger={sticker.tiger}
      eyeColor={sticker.eyeColor}
      sclera={sticker.sclera}
      hypnoEyes={sticker.hypnoEyes}
      crossEyes={sticker.crossEyes}
      stripeColor={sticker.stripeColor}
      wideEyes={sticker.wideEyes}
      earInner={sticker.earInner}
      rosettes={sticker.rosettes}
      topHat={sticker.topHat}
      tripleEyes={sticker.tripleEyes}
      beakColor={sticker.beakColor}
      width={width}
      height={height}
    />
  );
}
