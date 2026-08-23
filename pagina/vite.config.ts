import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Django backend URL for local development
const DJANGO_API = "http://127.0.0.1:8001";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    // ─── Dev Proxy ──────────────────────────────────────────────────────────
    // In development, Vite forwards all /api/* requests to the local Django
    // backend. This avoids CORS issues entirely — the browser sees everything
    // as coming from the same origin (localhost:8080).
    proxy: {
      "/api": {
        target: DJANGO_API,
        changeOrigin: true,
        secure: false,
        // Keep /api prefix intact — Django routes are already under /api/
        rewrite: (p) => p,
      },
      "/media": {
        target: DJANGO_API,
        changeOrigin: true,
        secure: false,
      },
      "/static": {
        target: DJANGO_API,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
