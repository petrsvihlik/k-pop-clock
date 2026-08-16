import { STICKERS } from "@game/index.ts";
import { Creature } from "@ui/components/Creature.tsx";

/**
 * The fixed on-stage guide shown beside the speech bubble during a level —
 * Derpy, the goofy tiger spirit, borrowed from the collectible band.
 */
const TIGER = STICKERS.find((st) => st.id === "derpy")!;

export function Mascot({ width = 84, height = 111 }: { width?: number; height?: number }) {
  return <Creature sticker={TIGER} width={width} height={height} />;
}
