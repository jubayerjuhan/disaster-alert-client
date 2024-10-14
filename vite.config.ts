import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    NodeGlobalsPolyfillPlugin({ process: true, buffer: true }),
    NodeModulesPolyfillPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Use the ESM-compatible 'global' package directly
      global: "global", // Just 'global' is enough, no need for require.resolve in Vite
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis", // Polyfill global as globalThis
      },
    },
  },
});
