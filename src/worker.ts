/**
 * Cloudflare Worker - Mirage TV Frontend
 * Handles static asset serving and SPA routing
 */

interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
  API_URL?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Serve static assets from /dist directory
    if (
      pathname.startsWith("/assets/") ||
      pathname.endsWith(".js") ||
      pathname.endsWith(".css") ||
      pathname.endsWith(".png") ||
      pathname.endsWith(".jpg") ||
      pathname.endsWith(".svg") ||
      pathname.endsWith(".ico") ||
      pathname.endsWith(".woff2") ||
      pathname.endsWith(".woff")
    ) {
      return env.ASSETS.fetch(request);
    }

    // API proxy - forward to backend
    if (pathname.startsWith("/api/")) {
      const backendUrl = `${env.API_URL || "https://mirage-divine-moon-57.fly.dev"}${pathname}${url.search}`;
      const apiRequest = new Request(backendUrl, {
        method: request.method,
        headers: request.headers,
        body: request.method !== "GET" ? request.body : undefined,
      });

      try {
        return await fetch(apiRequest);
      } catch {
        return new Response(JSON.stringify({ error: "API request failed" }), {
          status: 502,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // SPA routing - serve index.html for all other routes
    return env.ASSETS.fetch(new Request(new URL("/index.html", request.url), request));
  },
};
