import { STICKERS } from "@game/index.ts";
import { Creature } from "@ui/components/Creature.tsx";
import { Mascot } from "@ui/components/Mascot.tsx";

const CARD =
  "border:4px solid #2a1a4a;border-radius:22px;box-shadow:0 6px 0 #120a2e;padding:14px 10px 10px 10px;" +
  "width:150px;display:flex;flex-direction:column;align-items:center;gap:6px";

/**
 * Design gallery of the full band, rendered from live data — open with ?gallery.
 * Not linked from the game; it exists so character tweaks can be eyeballed quickly.
 */
export function GalleryScreen() {
  return (
    <div style="min-height:100vh;background:linear-gradient(#1d1145,#2c1b57);padding:28px;box-sizing:border-box">
      <div style="display:flex;flex-wrap:wrap;gap:18px;justify-content:center;max-width:980px;margin:0 auto">
        {STICKERS.map((st) => (
          <div key={st.id} style={`background:#fff7f0;${CARD}`}>
            <Creature sticker={st} width={120} height={158} />
            <div style="font-weight:800;color:#2a1a4a;font-size:17px">{st.name}</div>
          </div>
        ))}
        <div style={`background:#ffe9f2;${CARD}`}>
          <Mascot width={120} height={158} />
          <div style="font-weight:800;color:#2a1a4a;font-size:17px">Maskot</div>
        </div>
      </div>
    </div>
  );
}
