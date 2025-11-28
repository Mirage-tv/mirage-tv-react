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

// CORS headers configuration
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400",
};

function addCorsHeaders(response: Response): Response {
  const newResponse = new Response(response.body, response);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    newResponse.headers.set(key, value);
  });
  return newResponse;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

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
      // Remove /api prefix before forwarding to backend
      const backendPath = pathname.replace(/^\/api/, "");
      const backendUrl = `${env.API_URL || "https://mirage-divine-moon-57.fly.dev"}${backendPath}${url.search}`;

      // Create new headers without host
      const headers = new Headers(request.headers);
      headers.delete("host");

      const apiRequest = new Request(backendUrl, {
        method: request.method,
        headers: headers,
        body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
      });

      try {
        const response = await fetch(apiRequest);
        return addCorsHeaders(response);
      } catch {
        return new Response(JSON.stringify({ error: "API request failed" }), {
          status: 502,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
      }
    }

    // SPA routing - serve index.html for all other routes
    return env.ASSETS.fetch(new Request(new URL("/index.html", request.url), request));
  },
};
