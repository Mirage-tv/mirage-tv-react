import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://mirage-divine-moon-57.fly.dev",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
