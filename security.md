# CivicIQ Security Documentation

## Content Security Policy (CSP)
The application implements a strict, nonce-based CSP to mitigate Cross-Site Scripting (XSS) and data injection attacks.

### Key Rules:
- **`script-src`**: Uses `nonce` for all inline and external scripts. `unsafe-eval` has been removed.
- **`style-src`**: Uses `nonce` or hashes for inline styles.
- **`frame-ancestors`**: Set to `none` to prevent Clickjacking.
- **`connect-src`**: Restricted to trusted domains (Google APIs, Firebase).

## Security Headers
The following headers are applied via `src/proxy.ts` (Next.js middleware):
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`: Restricted access to camera and geolocation; microphone allowed for voice features.

## Input Validation
- All API routes (`/api/chat`, `/api/verify-id`) use robust error handling and type checking.
- Chat responses are sanitized to prevent injection.

## Authentication & Session Safety
- No sensitive keys are exposed to the client.
- `GEMINI_API_KEY` is strictly server-side.
