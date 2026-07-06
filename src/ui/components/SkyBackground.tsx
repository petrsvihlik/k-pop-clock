import { celestial, PHASE_GRADIENT, phaseFor, starsVisible } from "@game/index.ts";

/**
 * Full-screen sky backdrop driven by a 24-hour time. The gradient, the sun/moon
 * position, and the stars all shift with the clock so the child *sees* what a
 * time of day looks like. Smooth CSS transitions make the sky glide as she moves
 * the hands. Sits on z-index 0 beneath the screen content.
 */

// Deterministic star field (fixed so stars don't jump on every re-render).
const STARS = [
  { x: 8, y: 12, r: 3, dur: 3.1, delay: 0 },
  { x: 18, y: 26, r: 2, dur: 2.4, delay: 0.6 },
  { x: 27, y: 8, r: 2, dur: 3.6, delay: 1.1 },
  { x: 39, y: 20, r: 3, dur: 2.9, delay: 0.3 },
  { x: 52, y: 10, r: 2, dur: 3.3, delay: 1.5 },
  { x: 63, y: 24, r: 2, dur: 2.6, delay: 0.9 },
  { x: 71, y: 9, r: 3, dur: 3.8, delay: 0.2 },
  { x: 83, y: 18, r: 2, dur: 2.7, delay: 1.3 },
  { x: 91, y: 30, r: 2, dur: 3.2, delay: 0.5 },
  { x: 46, y: 33, r: 2, dur: 2.5, delay: 1.8 },
  { x: 14, y: 40, r: 2, dur: 3.4, delay: 0.7 },
  { x: 77, y: 40, r: 3, dur: 2.8, delay: 1.0 },
];

export function SkyBackground({ h24, m = 0 }: { h24: number; m?: number }) {
  const phase = phaseFor(h24);
  const body = celestial(h24, m);
  const stars = starsVisible(h24);

  return (
    <div style={`position:fixed;inset:0;z-index:0;overflow:hidden;background:${PHASE_GRADIENT[phase]};transition:background .7s ease`}>
      {stars &&
        STARS.map((s, i) => (
          <div
            key={i}
            style={`position:absolute;left:${s.x}%;top:${s.y}%;width:${s.r}px;height:${s.r}px;background:#fffbe6;border-radius:50%;box-shadow:0 0 6px 1px rgba(255,255,255,.7);animation:ti-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`}
          />
        ))}

      {body.isSun ? (
        <div
          style={`position:absolute;left:${body.x}%;top:${body.y}%;transform:translate(-50%,-50%);width:84px;height:84px;border-radius:50%;background:radial-gradient(circle at 50% 45%,#fff6cf 0%,#ffd94a 55%,#ffb02e 100%);box-shadow:0 0 60px 22px rgba(255,207,74,.45);transition:left .7s ease,top .7s ease`}
        />
      ) : (
        <div
          style={`position:absolute;left:${body.x}%;top:${body.y}%;transform:translate(-50%,-50%);width:70px;height:70px;border-radius:50%;background:radial-gradient(circle at 38% 34%,#ffffff 0%,#e6e9ff 60%,#c9cff2 100%);box-shadow:0 0 40px 12px rgba(220,225,255,.35);transition:left .7s ease,top .7s ease`}
        >
          <div style="position:absolute;left:44%;top:30%;width:12px;height:12px;border-radius:50%;background:rgba(160,168,214,.55)" />
          <div style="position:absolute;left:24%;top:56%;width:9px;height:9px;border-radius:50%;background:rgba(160,168,214,.45)" />
          <div style="position:absolute;left:62%;top:60%;width:7px;height:7px;border-radius:50%;background:rgba(160,168,214,.4)" />
        </div>
      )}
    </div>
  );
}
