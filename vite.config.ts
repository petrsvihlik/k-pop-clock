import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

// Static, client-only build. `base: "./"` keeps asset paths relative so the
// output drops onto GitHub Pages (or any static host / file server) unchanged.
export default defineConfig({
  base: "./",
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "preact",
  },
  resolve: {
    alias: {
      "@engine": fileURLToPath(new URL("./src/engine", import.meta.url)),
      "@game": fileURLToPath(new URL("./src/games/time-islands", import.meta.url)),
      "@ui": fileURLToPath(new URL("./src/ui", import.meta.url)),
    },
  },
});
