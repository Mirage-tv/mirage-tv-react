import react from "@vitejs/plugin-react";
import https from "https";
import type { Connect, Plugin } from "vite";
import { defineConfig } from "vite";

// Plugin pour proxifier les fichiers VTT (évite les problèmes CORS)
function vttProxyPlugin(): Plugin {
  return {
    name: "vtt-proxy",
    configureServer(server) {
      const middleware: Connect.NextHandleFunction = (req, res, next) => {
        const url = req.url;
        if (url?.startsWith("/proxy-vtt/")) {
          const encodedUrl = url.replace("/proxy-vtt/", "");
          const vttUrl = decodeURIComponent(encodedUrl);

          https
            .get(vttUrl, (proxyRes) => {
              let data = "";
              proxyRes.on("data", (chunk: Buffer) => {
                data += chunk.toString();
              });
              proxyRes.on("end", () => {
                res.setHeader("Content-Type", "text/vtt; charset=utf-8");
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.end(data);
              });
            })
            .on("error", () => {
              res.statusCode = 502;
              res.end("Failed to fetch VTT file");
            });
          return;
        }
        next();
      };
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig({
  plugins: [react(), vttProxyPlugin()],
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
