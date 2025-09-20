/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,       // ✅ allows using expect, describe, test without imports
    environment: "jsdom",// ✅ simulates browser DOM
    setupFiles: "./src/setupTests.ts", // optional: for jest-dom
  },
});
