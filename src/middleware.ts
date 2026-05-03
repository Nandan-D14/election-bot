import { NextResponse } from 'next/server';

export function middleware() {
  const response = NextResponse.next();

  // Security Headers
  const securityHeaders = {
    // Prevent clickjacking attacks
    'X-Frame-Options': 'DENY',
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    // Enable XSS protection
    'X-XSS-Protection': '1; mode=block',
    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    // Permissions policy (formerly Feature-Policy)
    'Permissions-Policy': 'camera=(), microphone=(self), geolocation=()',
  };

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Content Security Policy
  const cspHeader = [
    // Default to self only
    "default-src 'self'",
    // Scripts from self and Google Fonts
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
    // Styles from self and Google Fonts
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
    // Images from self and data URIs
    "img-src 'self' data: blob:",
    // Fonts from self and Google Fonts
    "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com",
    // Connect to self and Google Analytics/Firebase
    "connect-src 'self' https://www.google-analytics.com https://*.firebaseio.com https://*.googleapis.com",
    // Media from self
    "media-src 'self'",
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
  ].join('; ');

  response.headers.set('Content-Security-Policy', cspHeader);

  // Strict-Transport-Security (only in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
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
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
