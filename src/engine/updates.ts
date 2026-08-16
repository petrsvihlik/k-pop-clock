/**
 * Release checker for installed (home-screen) copies.
 *
 * There is no service worker: asset filenames are content-hashed, so the only
 * file that can go stale is the HTML shell — and iOS keeps that cached for an
 * installed app more or less forever. This polls `version.json` with caching
 * defeated and reports when the deployed build id differs from the running one,
 * so the UI can offer a reload.
 */

/** Build id baked in at compile time (see `define` in vite.config.ts). */
declare const __BUILD_ID__: string;

export const RUNNING_BUILD: string = typeof __BUILD_ID__ === "string" ? __BUILD_ID__ : "dev";

export interface UpdateWatchOptions {
  /** Called once, when a different build is found on the server. */
  onUpdate: () => void;
  /** Poll interval in ms (also checked whenever the app regains focus). */
  intervalMs?: number;
  /** Where the build id lives, relative to the page. */
  url?: string;
}

/** Fetch the deployed build id, or null if it cannot be determined. */
export async function fetchDeployedBuild(url = "./version.json"): Promise<string | null> {
  try {
    const res = await fetch(`${url}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { build?: unknown };
    return typeof data.build === "string" ? data.build : null;
  } catch {
    return null; // offline or blocked — try again on the next tick
  }
}

/**
 * Watch for a newer deployment. Returns a stop function. `onUpdate` fires at
 * most once; polling stops after it does.
 */
export function watchForUpdates({
  onUpdate,
  intervalMs = 15 * 60 * 1000,
  url = "./version.json",
}: UpdateWatchOptions): () => void {
  let stopped = false;
  const check = async (): Promise<void> => {
    if (stopped) return;
    const deployed = await fetchDeployedBuild(url);
    // In dev there is no baked id, so never nag.
    if (stopped || !deployed || RUNNING_BUILD === "dev" || deployed === RUNNING_BUILD) return;
    stop();
    onUpdate();
  };
  const onVisible = (): void => {
    if (document.visibilityState === "visible") void check();
  };

  const timer = setInterval(() => void check(), intervalMs);
  document.addEventListener("visibilitychange", onVisible);
  window.addEventListener("focus", onVisible);
  void check();

  function stop(): void {
    stopped = true;
    clearInterval(timer);
    document.removeEventListener("visibilitychange", onVisible);
    window.removeEventListener("focus", onVisible);
  }
  return stop;
}

/** Reload onto the newest build, bypassing the HTTP cache for the shell. */
export function reloadForUpdate(): void {
  const url = new URL(window.location.href);
  url.searchParams.set("v", Date.now().toString(36));
  window.location.replace(url.toString());
}
