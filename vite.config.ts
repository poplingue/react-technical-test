import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.ts',
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, "./src"),
    },
  },
  preview: {
    port: 3000,
  },
  server: {
    port: 3000,
    open: true,
  },
});
