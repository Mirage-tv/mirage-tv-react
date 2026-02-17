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

// Allowed origins for CORS
const ALLOWED_ORIGINS = ["http://localhost:5173", "http://localhost:3000", "https://mirage-tv.pages.dev", "https://mirage.tv"];

function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("Origin") || "";

  // Check if the origin is allowed, otherwise use the first allowed origin
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Cookie",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;

      // Handle CORS preflight requests
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: getCorsHeaders(request),
        });
      }

      // Check if ASSETS binding is available
      if (!env || !env.ASSETS) {
        throw new Error(
          "ASSETS binding is missing. Ensure 'assets' is configured in wrangler.jsonc and you are using the correct environment.",
        );
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
        return await env.ASSETS.fetch(request);
      }

      // Proxy pour les sous-titres VTT (évite les problèmes CORS)
      if (pathname.startsWith("/proxy-vtt/")) {
        const vttUrl = decodeURIComponent(pathname.replace("/proxy-vtt/", ""));

        try {
          const response = await fetch(vttUrl);
          const corsHeaders = getCorsHeaders(request);

          return new Response(response.body, {
            status: response.status,
            headers: {
              "Content-Type": "text/vtt; charset=utf-8",
              ...corsHeaders,
            },
          });
        } catch (err) {
          return new Response("Failed to fetch VTT file", {
            status: 502,
            headers: getCorsHeaders(request),
          });
        }
      }

      // API proxy - forward to backend
      if (pathname.startsWith("/api/")) {
        const backendUrl = `${env.API_URL || "https://api.mirage-tv.com"}${pathname}${url.search}`;

        // Create new headers, preserving cookies
        const headers = new Headers();

        // Copy relevant headers from the original request
        const headersToForward = ["content-type", "cookie", "authorization", "accept", "accept-language"];
        headersToForward.forEach((headerName) => {
          const value = request.headers.get(headerName);
          if (value) {
            headers.set(headerName, value);
          }
        });

        const apiRequest = new Request(backendUrl, {
          method: request.method,
          headers: headers,
          body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
          redirect: "follow",
        });

        try {
          const response = await fetch(apiRequest);

          // Create response with CORS headers and preserve Set-Cookie
          const corsHeaders = getCorsHeaders(request);
          const newHeaders = new Headers();

          // Copy all response headers
          response.headers.forEach((value, key) => {
            newHeaders.append(key, value);
          });

          // Add CORS headers
          Object.entries(corsHeaders).forEach(([key, value]) => {
            newHeaders.set(key, value);
          });

          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
          });
        } catch (apiError) {
          return new Response(
            JSON.stringify({
              error: "API request failed",
              details: apiError instanceof Error ? apiError.message : String(apiError),
            }),
            {
              status: 502,
              headers: {
                "Content-Type": "application/json",
                ...getCorsHeaders(request),
              },
            },
          );
        }
      }

      // SPA routing - serve index.html for all other routes
      const indexUrl = new URL("/index.html", request.url);
      return await env.ASSETS.fetch(new Request(indexUrl.toString()));
    } catch (err) {
      const error = err as Error;
      return new Response(`Worker Error: ${error.message}\n${error.stack}`, {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }
  },
};
