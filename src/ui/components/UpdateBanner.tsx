import { useEffect, useState } from "preact/hooks";
import { reloadForUpdate, watchForUpdates } from "@engine/index.ts";
import { STR, type Lang } from "@game/index.ts";

/**
 * Offers a reload when a newer build is deployed. Installed home-screen copies
 * would otherwise keep running the cached shell indefinitely. Also shown on
 * demand from the map's ⟳ button via `force`.
 */
export function UpdateBanner({ lang }: { lang: Lang }) {
  const [available, setAvailable] = useState(false);
  const L = STR[lang];

  useEffect(() => watchForUpdates({ onUpdate: () => setAvailable(true) }), []);

  if (!available) return null;
  return (
    <div style="position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:80;display:flex;align-items:center;gap:12px;background:#fff7f0;color:#2a1a4a;border:4px solid #2a1a4a;border-radius:20px;padding:10px 14px 10px 18px;box-shadow:0 6px 0 #120a2e;animation:ti-pop .4s;max-width:92vw">
      <div style="font-size:17px;font-weight:800">{L.updateReady}</div>
      <button
        onClick={reloadForUpdate}
        class="press-3"
        style="background:#7ee081;color:#1c4a2a;border:3px solid #2a1a4a;border-radius:14px;padding:8px 16px;font-size:17px;font-weight:800;cursor:pointer;box-shadow:0 4px 0 #120a2e;font-family:inherit;white-space:nowrap"
      >
        ⟳ {L.updateNow}
      </button>
    </div>
  );
}
