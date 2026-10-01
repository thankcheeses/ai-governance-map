import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import path from "path";

const templateRoot = path.resolve(import.meta.dirname);

export default defineConfig({
  plugins: [react()],
  root: templateRoot,
  resolve: {
    alias: {
      "@": path.resolve(templateRoot, "client", "src"),
      "@shared": path.resolve(templateRoot, "shared"),
      "@assets": path.resolve(templateRoot, "attached_assets"),
    },
  },
  test: {
    // Previously this pointed at `server/**`, a directory that does not exist, so
    // `pnpm test` silently ran zero tests. Tests now live beside the code they cover.
    environment: "jsdom",
    globals: true,
    setupFiles: ["./client/src/test/setup.ts"],
    include: ["client/src/**/*.{test,spec}.{ts,tsx}"],
  },
});
