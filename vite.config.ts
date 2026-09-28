import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: { rollupOptions: { input: { main: path.resolve(__dirname, "index.html"), crypto: path.resolve(__dirname, "crypto/index.html") } } },
  resolve: { alias: { "@": path.resolve(__dirname) } },
});
