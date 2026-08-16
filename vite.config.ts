import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "node:url";

/**
 * Identifies this build. The app compares it against `version.json` (fetched
 * uncached) to notice that a new release is live — installed home-screen copies
 * on iOS otherwise sit on the cached index.html indefinitely.
 */
const BUILD_ID = new Date().toISOString();

/** Emits version.json next to the bundle so the running app can poll it. */
const versionFile = {
  name: "emit-version-file",
  generateBundle(this: { emitFile: (f: { type: "asset"; fileName: string; source: string }) => void }) {
    this.emitFile({
      type: "asset",
      fileName: "version.json",
      source: JSON.stringify({ build: BUILD_ID }),
    });
  },
};

// Static, client-only build. `base: "./"` keeps asset paths relative so the
// output drops onto GitHub Pages (or any static host / file server) unchanged.
export default defineConfig({
  base: "./",
  plugins: [versionFile],
  define: { __BUILD_ID__: JSON.stringify(BUILD_ID) },
  // Vite 8 transforms with oxc; JSX is routed to Preact's automatic runtime.
  oxc: {
    jsx: { runtime: "automatic", importSource: "preact" },
  },
  resolve: {
    alias: {
      "@engine": fileURLToPath(new URL("./src/engine", import.meta.url)),
      "@game": fileURLToPath(new URL("./src/games/time-islands", import.meta.url)),
      "@ui": fileURLToPath(new URL("./src/ui", import.meta.url)),
    },
  },
  // jsdom gives the game controller a real localStorage; Web Audio and Speech
  // are stubbed per-test (see tests/setup.ts).
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts"],
  },
});
