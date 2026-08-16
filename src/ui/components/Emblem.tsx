/**
 * The band's lattice emblem: a quatrefoil of four overlapping rings, a window
 * lattice grid, and the H glyph in the middle. Vectorised from the logo art.
 * Draws in a 0–100 viewBox. Two modes:
 *  - line art (default): rings + grid + glyph in `color`/`glyph`;
 *  - filled (`fill` set): the quatrefoil silhouette filled and outlined, with
 *    the lattice ghosted on top — used for the island tiles.
 */

/** Ring centres and radius; the union of the four discs is the quatrefoil. */
const RINGS: ReadonlyArray<readonly [number, number]> = [
  [50, 27],
  [50, 73],
  [27, 50],
  [73, 50],
];
const R = 23;
/** Grid lines sit at 38/62; where they cross the rings' edges (√(R²−12²) from a centre). */
const GRID_HALF = Math.sqrt(R * R - 12 * 12);
const GRID_A = 27 - GRID_HALF;
const GRID_B = 73 + GRID_HALF;

/** Path of the four grid lines and the glyph, shared by both modes. */
const GRID_D = [38, 62]
  .flatMap((p) => [`M${p} ${GRID_A} L${p} ${GRID_B}`, `M${GRID_A} ${p} L${GRID_B} ${p}`])
  .join(" ");
const GLYPH_D = "M43 36 h3.5 v28 h-3.5 Z M53.5 41 h3.5 v23 h-3.5 Z M43 48.5 h14 v3 h-14 Z";

export interface EmblemProps {
  size: number;
  /** Lattice line color (line-art mode) / lattice ghost color (filled mode). */
  color?: string;
  /** Centre glyph color; omit or pass `null` to hide the glyph. */
  glyph?: string | null;
  /** Filled mode: silhouette fill. */
  fill?: string;
  /** Filled mode: silhouette outline color. */
  outline?: string;
  /** Filled mode: drop-shadow color drawn 6 units below (matches the app's button shadows). */
  shadow?: string;
  /** Line width in viewBox units. */
  weight?: number;
  /** Lattice opacity in filled mode. */
  latticeOpacity?: number;
  style?: string;
}

export function Emblem({
  size,
  color = "#d9a7d5",
  glyph = "#7148a8",
  fill,
  outline = "#2a1a4a",
  shadow,
  weight = 3.2,
  latticeOpacity = 0.16,
  style,
}: EmblemProps) {
  const rings = (props: Record<string, string | number | undefined>) =>
    RINGS.map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={R} {...props} />);

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={style} aria-hidden="true">
      {fill && shadow && <g transform="translate(0 6)">{rings({ fill: shadow })}</g>}
      {fill && (
        <g>
          {/* outlined discs, then the same discs unstroked on top: only the union's outer edge keeps its stroke */}
          {rings({ fill, stroke: outline, "stroke-width": weight * 2 })}
          {rings({ fill })}
        </g>
      )}
      <g
        fill="none"
        stroke={color}
        stroke-width={weight}
        stroke-linecap="round"
        opacity={fill ? latticeOpacity : 1}
      >
        {rings({})}
        <path d={GRID_D} />
      </g>
      {glyph && <path d={GLYPH_D} fill={glyph} />}
    </svg>
  );
}
