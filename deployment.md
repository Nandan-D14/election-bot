# CivicIQ Deployment Documentation

## Infrastructure
The application is containerized using Docker and deployed on **Google Cloud Run** for high scalability and low latency.

## CI/CD Pipeline
GitHub Actions automates the build, test, and deployment process.

### Workflow Steps:
1. **Linting & Formatting**: Ensures code quality via ESLint and Prettier.
2. **Type Checking**: Validates TypeScript integrity.
3. **Automated Testing**: Runs Playwright E2E and A11y tests.
4. **Build**: Generates an optimized production bundle using Turbopack.
5. **Docker Build & Push**: Pushes the image to Google Artifact Registry.
6. **Deploy**: Updates the Cloud Run service.

## Environment Configuration
Required environment variables:
- `GEMINI_API_KEY`: API key for Google Generative AI.
- `NEXT_PUBLIC_FIREBASE_CONFIG`: Client-side Firebase configuration for analytics.

## Production Checklist:
- [x] Strict CSP implemented.
- [x] SSL/TLS enforced (HSTS).
- [x] Standalone build mode enabled in `next.config.ts`.
- [x] Structured logging active.
- [x] Accessibility regression checks in CI.
