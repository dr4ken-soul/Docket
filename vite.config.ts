import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Vite configuration for the Docket frontend.
 *
 * @returns the resolved Vite config
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@/convex", replacement: resolve(__dirname, "convex") },
      { find: "@", replacement: resolve(__dirname, "src") },
    ],
  },
  server: {
    port: 5173,
  },
});
