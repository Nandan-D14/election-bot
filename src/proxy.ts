import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Generate a nonce for CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const isDev = process.env.NODE_ENV === "development";

  // Content Security Policy
  const cspHeader = [
    // Default to self only
    "default-src 'self'",
    // Scripts: nonced for security, allow Google Fonts/Firebase
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: ${isDev ? "'unsafe-inline' 'unsafe-eval'" : ""}`,
    // Styles: nonced or self + fonts
    `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com ${isDev ? "'unsafe-inline'" : ""}`,
    // Images: self + data/blob
    "img-src 'self' data: blob: https://*.googleapis.com",
    // Fonts: self + Google Fonts
    "font-src 'self' https://fonts.gstatic.com",
    // Connect: self + APIs
    "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://www.google-analytics.com",
    // Media: self + blob (for WebAudio/Voice)
    "media-src 'self' blob:",
    // Object sources blocked
    "object-src 'none'",
    // Base URI self
    "base-uri 'self'",
    // Form actions to self
    "form-action 'self'",
    // Frame ancestors blocked
    "frame-ancestors 'none'",
    // Upgrade insecure requests
    "upgrade-insecure-requests",
  ].join("; ");

  // Set the nonce in the request headers so it can be read in layouts/components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Security Headers
  const securityHeaders = {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(self), geolocation=()",
    "Content-Security-Policy": cspHeader,
  };

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Strict-Transport-Security (only in production)
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
