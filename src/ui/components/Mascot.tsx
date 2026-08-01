import { Chibi } from "@ui/components/Creature.tsx";

/**
 * The fixed on-stage mascot shown beside the speech bubble during a level — a
 * cyan cat-eared band leader with a pink headband. (Distinct from the collectible
 * Creature, which is trait-driven.)
 */
export function Mascot({ width = 84, height = 111 }: { width?: number; height?: number }) {
  return <Chibi color="#4fd8e8" accent="#ff5fa2" ears="cat" acc="band" width={width} height={height} />;
}
