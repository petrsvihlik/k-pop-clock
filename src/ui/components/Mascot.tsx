import type { Sticker } from "@game/index.ts";
import { Creature } from "@ui/components/Creature.tsx";

/**
 * The on-stage guide beside the speech bubble. Whichever band member the player
 * picked in "My band" (Derpy until someone joins) — see `game.guideSticker()`.
 */
export function Mascot({
  sticker,
  width = 84,
  height = 111,
}: {
  sticker: Sticker;
  width?: number;
  height?: number;
}) {
  return <Creature sticker={sticker} width={width} height={height} />;
}
