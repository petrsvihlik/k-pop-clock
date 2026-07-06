/**
 * Animated concert light beams behind the map screen. Purely decorative,
 * non-interactive, sitting on z-index 0 beneath the content.
 */
const CLIP = "polygon(42% 0, 58% 0, 100% 100%, 0 100%)";

const BEAMS = [
  { left: "8%", grad: "rgba(255,95,162,0.55)", anim: "ti-sweepA 9s ease-in-out infinite", delay: "0s" },
  { left: "34%", grad: "rgba(79,216,232,0.5)", anim: "ti-sweepB 7.5s ease-in-out infinite", delay: "-2s" },
  { left: "60%", grad: "rgba(255,207,92,0.45)", anim: "ti-sweepC 11s ease-in-out infinite", delay: "-5s" },
  { left: "84%", grad: "rgba(167,139,250,0.55)", anim: "ti-sweepD 8.5s ease-in-out infinite", delay: "-3.5s" },
];

export function LightSweeps() {
  return (
    <div style="position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:0">
      {BEAMS.map((b) => (
        <div
          key={b.left}
          style={`position:absolute;top:-60px;left:${b.left};width:150px;height:130vh;transform-origin:50% 0;background:linear-gradient(to bottom, ${b.grad}, ${b.grad.replace(/[\d.]+\)$/, "0)")} 78%);clip-path:${CLIP};mix-blend-mode:screen;animation:${b.anim};animation-delay:${b.delay}`}
        />
      ))}
    </div>
  );
}
