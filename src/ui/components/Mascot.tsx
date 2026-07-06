/**
 * The fixed on-stage mascot shown beside the speech bubble during a level — a
 * cyan cat-eared band leader with a pink headband. (Distinct from the collectible
 * Creature, which is trait-driven.)
 */
export function Mascot({ width = 84, height = 111 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 100 132">
      <rect x="37" y="104" width="10" height="20" rx="5" fill="#2a1a4a" />
      <rect x="53" y="104" width="10" height="20" rx="5" fill="#2a1a4a" />
      <rect x="18" y="78" width="9" height="24" rx="4.5" fill="#4fd8e8" stroke="#2a1a4a" stroke-width="3" transform="rotate(18 22 80)" />
      <rect x="73" y="78" width="9" height="24" rx="4.5" fill="#4fd8e8" stroke="#2a1a4a" stroke-width="3" transform="rotate(-18 78 80)" />
      <rect x="30" y="72" width="40" height="36" rx="15" fill="#2c1b57" stroke="#2a1a4a" stroke-width="3.5" />
      <rect x="34" y="94" width="32" height="7" rx="3.5" fill="#ff5fa2" stroke="#2a1a4a" stroke-width="2.5" />
      <polygon points="26,34 29,4 46,22" fill="#4fd8e8" stroke="#2a1a4a" stroke-width="4" stroke-linejoin="round" />
      <polygon points="74,34 71,4 54,22" fill="#4fd8e8" stroke="#2a1a4a" stroke-width="4" stroke-linejoin="round" />
      <circle cx="50" cy="44" r="30" fill="#4fd8e8" stroke="#2a1a4a" stroke-width="4" />
      <path d="M24 32 Q50 12 76 32" stroke="#2a1a4a" stroke-width="6" fill="none" />
      <circle cx="24" cy="36" r="7" fill="#ff5fa2" stroke="#2a1a4a" stroke-width="3" />
      <circle cx="76" cy="36" r="7" fill="#ff5fa2" stroke="#2a1a4a" stroke-width="3" />
      <path d="M31 32 L42 30" stroke="#2a1a4a" stroke-width="3" stroke-linecap="round" />
      <path d="M58 30 L69 32" stroke="#2a1a4a" stroke-width="3" stroke-linecap="round" />
      <circle cx="38" cy="42" r="8" fill="#fff7f0" />
      <circle cx="62" cy="42" r="8" fill="#fff7f0" />
      <circle cx="39.5" cy="43" r="4" fill="#2a1a4a" />
      <circle cx="63.5" cy="43" r="4" fill="#2a1a4a" />
      <circle cx="41" cy="41.5" r="1.6" fill="#ffffff" />
      <circle cx="65" cy="41.5" r="1.6" fill="#ffffff" />
      <circle cx="29" cy="52" r="4.5" fill="#ff5fa2" opacity="0.35" />
      <circle cx="71" cy="52" r="4.5" fill="#ff5fa2" opacity="0.35" />
      <path d="M42 54 Q50 63 58 54" stroke="#2a1a4a" stroke-width="3.5" fill="none" stroke-linecap="round" />
    </svg>
  );
}
