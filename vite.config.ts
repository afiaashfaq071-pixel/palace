import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { seoPlugin } from "./vite-plugins/seo";

export default defineConfig({
  plugins: [react(), seoPlugin()],
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks: { motion: ["framer-motion"] },
      },
    },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
});
