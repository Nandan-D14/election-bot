# CivicIQ Testing Documentation

## Test Strategy

The project uses a pyramid testing strategy with a focus on End-to-End (E2E) and Accessibility (A11y) tests.

### Test Suites:

- **E2E Tests**: Powered by Playwright, covering critical user journeys (Simulator, Voice Assistant, ID Verification).
- **Accessibility Tests**: Using `@axe-core/playwright` to ensure WCAG AA compliance.
- **Unit/Integration Tests**: (Planned) focusing on shared hooks and services.

## Running Tests

```bash
# Run all tests
npm run test

# Run tests in UI mode
npm run test:ui
```

## Accessibility Compliance

Current automated scans target:

- Color contrast.
- ARIA labels and roles.
- Keyboard navigation.
- Focus management.

## Recent Improvements:

- Fixed multiple `h1` tag violations.
- Added missing `aria-label` to interactive buttons in `FeatureCards`.
- Resolved `THREE.Clock` deprecation warnings in the simulator.
