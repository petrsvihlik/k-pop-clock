import { STICKERS } from "@game/index.ts";
import { Creature } from "@ui/components/Creature.tsx";

/**
 * The fixed on-stage guide shown beside the speech bubble during a level —
 * Tygřík, the goofy tiger spirit, borrowed from the collectible band.
 */
const TIGER = STICKERS.find((st) => st.id === "tiger")!;

export function Mascot({ width = 84, height = 111 }: { width?: number; height?: number }) {
  return <Creature sticker={TIGER} width={width} height={height} />;
}
