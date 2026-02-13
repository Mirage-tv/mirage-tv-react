import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    watch: {
      usePolling: true,
    },
    proxy: {
      "/api": {
        target: "https://api.mirage-tv.com",
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: "localhost",
      },
    },
  },
});
