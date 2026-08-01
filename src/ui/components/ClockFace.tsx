import type { Ref } from "preact";

/** Hand colors — also used to tint the digits of time labels in early levels. */
export const HOUR_COLOR = "#ff5fa2";
export const MINUTE_COLOR = "#4fd8e8";

/** A numeral to draw on the dial: [label, x, y] in the 0–200 viewBox. */
export type Numeral = [string, number, number];

/** Full 12-numeral dial (used by the large "read" and "set" clocks). */
export const FULL_NUMERALS: Numeral[] = [
  ["12", 100, 30],
  ["1", 137, 39],
  ["2", 162, 63],
  ["3", 171, 100],
  ["4", 162, 137],
  ["5", 137, 161],
  ["6", 100, 170],
  ["7", 63, 161],
  ["8", 38, 137],
  ["9", 29, 100],
  ["10", 38, 63],
  ["11", 63, 39],
];

/** Sparse 12/3/6/9 dial for the digital-24 option clocks. */
export const QUARTER_NUMERALS_DIG24: Numeral[] = [
  ["12", 100, 30],
  ["3", 171, 100],
  ["6", 100, 170],
  ["9", 29, 100],
];

/** Sparse 12/3/6/9 dial for the matching-game clocks (thicker face). */
export const QUARTER_NUMERALS_MATCH: Numeral[] = [
  ["12", 100, 32],
  ["3", 169, 100],
  ["6", 100, 168],
  ["9", 31, 100],
];

const TICK_ANGLES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

export interface Interactive {
  svgRef: Ref<SVGSVGElement>;
  onPointerDown: (e: PointerEvent) => void;
  onPointerMove: (e: PointerEvent) => void;
  onPointerUp: () => void;
}

export interface ClockFaceProps {
  /** Rendered pixel size (viewBox is always 0 0 200 200). */
  size: number;
  hourAngle: number;
  minAngle: number;
  numerals: Numeral[];
  numeralSize: number;
  faceStroke?: number;
  showTicks?: boolean;
  hourWidth?: number;
  minWidth?: number;
  centerR?: number;
  /** Draw draggable knobs on the hand tips (the "set the hands" clock). */
  knobs?: boolean;
  /** Blink a hand to draw attention (tutorial). */
  pulseHand?: "hour" | "minute";
  /** Hide the minute hand entirely (beginner mode). */
  showMinute?: boolean;
  interactive?: Interactive;
}

export function ClockFace({
  size,
  hourAngle,
  minAngle,
  numerals,
  numeralSize,
  faceStroke = 6,
  showTicks = false,
  hourWidth = 11,
  minWidth = 7,
  centerR = 8,
  knobs = false,
  pulseHand,
  showMinute = true,
  interactive,
}: ClockFaceProps) {
  return (
    <svg
      ref={interactive?.svgRef}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={interactive ? "touch-action:none;cursor:grab" : undefined}
      onPointerDown={interactive?.onPointerDown}
      onPointerMove={interactive?.onPointerMove}
      onPointerUp={interactive?.onPointerUp}
      onPointerLeave={interactive?.onPointerUp}
    >
      <circle cx="100" cy="100" r="94" fill="#fff7f0" stroke="#2a1a4a" stroke-width={faceStroke} />

      {showTicks &&
        TICK_ANGLES.map((a) => (
          <line
            key={`tick-${a}`}
            x1="100"
            y1="12"
            x2="100"
            y2="20"
            stroke="#2a1a4a"
            stroke-width="3"
            transform={`rotate(${a} 100 100)`}
          />
        ))}

      {numerals.map(([label, x, y]) => (
        <text
          key={`num-${label}`}
          x={x}
          y={y}
          text-anchor="middle"
          dominant-baseline="central"
          font-size={numeralSize}
          font-weight="800"
          fill="#2a1a4a"
          font-family="'Baloo 2',sans-serif"
        >
          {label}
        </text>
      ))}

      <g transform={`rotate(${hourAngle} 100 100)`} class={pulseHand === "hour" ? "pulse" : undefined}>
        <line x1="100" y1="108" x2="100" y2="58" stroke={HOUR_COLOR} stroke-width={hourWidth} stroke-linecap="round" />
        {knobs && <circle cx="100" cy="58" r="11" fill={HOUR_COLOR} stroke="#2a1a4a" stroke-width="3" />}
      </g>
      {showMinute && (
        <g transform={`rotate(${minAngle} 100 100)`} class={pulseHand === "minute" ? "pulse" : undefined}>
          <line x1="100" y1="110" x2="100" y2="32" stroke={MINUTE_COLOR} stroke-width={minWidth} stroke-linecap="round" />
          {knobs && <circle cx="100" cy="32" r="10" fill={MINUTE_COLOR} stroke="#2a1a4a" stroke-width="3" />}
        </g>
      )}
      <circle cx="100" cy="100" r={centerR} fill="#2a1a4a" />
    </svg>
  );
}
