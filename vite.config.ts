import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";

// =============================================================================
// GitHub Pages SPA fallback
// Pages has no rewrite engine (unlike Vercel `rewrites` / Cloudflare `_redirects`),
// so a deep link or refresh on any non-root path would 404. Pages serves 404.html
// for unmatched paths, so shipping a byte-copy of index.html there boots the SPA
// and lets the client router take over. Done as a build hook rather than an npm
// script so every build path (local, CI, `pnpm build`) produces it.
// =============================================================================
function spaFallback404(): Plugin {
  return {
    name: "gh-pages-spa-fallback",
    apply: "build",
    closeBundle() {
      const outDir = path.resolve(import.meta.dirname, "dist/public");
      const index = path.join(outDir, "index.html");
      if (fs.existsSync(index)) {
        fs.copyFileSync(index, path.join(outDir, "404.html"));
      }
    },
  };
}

const plugins = [react(), tailwindcss(), spaFallback404()];

export default defineConfig({
  plugins,
  // Served from https://<user>.github.io/ai-governance-map/ — every asset URL must carry
  // this prefix. Set unconditionally (not just in CI) so `pnpm dev` and `pnpm preview` run
  // under the same subpath as production and path bugs surface locally, not after deploy.
  base: "/ai-governance-map/",
  // Build-time stamp so the footer's "last updated" date is always the real
  // build/deploy date and can never go stale by hand.
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
