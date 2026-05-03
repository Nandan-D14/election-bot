# CivicIQ - Multilingual Electoral Education Assistant

CivicIQ helps voters understand the electoral process — voter registration, polling day procedures, and EVM/VVPAT voting — in 22 Indian languages with complete political neutrality.

## Features

- **Voice Assistant**: Multilingual voice guidance for electoral information
- **EVM Simulator**: Interactive electronic voting machine simulation
- **Readiness Quiz**: Test your knowledge about the voting process
- **Myth Buster**: Debunk common electoral myths
- **Chatbot**: AI-powered Q&A for voter queries
- **Voting Rules**: Comprehensive guide to voting regulations
- **Voting Games**: Interactive learning games
- **Election Process Map**: Visual timeline of the electoral process
- **Election Mind Map**: Conceptual overview of elections

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **3D Graphics**: Three.js, React Three Fiber
- **Testing**: Playwright for E2E tests
- **Deployment**: Google Cloud Run with Docker
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm, yarn, pnpm, or bun

### Installation

```bash
cd frontend
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run test` - Run Playwright E2E tests
- `npm run test:ui` - Run tests with UI
- `npm run test:headed` - Run tests in headed mode

## Firebase Setup (Optional)

To enable Firebase Analytics:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Create a web app and copy the configuration
3. Add the following environment variables to your `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Security Features

- Content Security Policy (CSP) headers
- HTTP security headers (HSTS, X-Frame-Options, etc.)
- Security scanning with Trivy in CI/CD
- npm audit for dependency vulnerabilities
- Error boundary for graceful error handling

## Testing

The project includes comprehensive E2E tests with Playwright:

- Navigation tests
- Feature-specific tests (quiz, myths, chatbot, etc.)
- Accessibility tests with axe-core
- Mobile and desktop testing

Run tests:

```bash
npm run test
```

## Deployment

The project is configured for deployment to Google Cloud Run via GitHub Actions. The CI/CD pipeline includes:

- Quality checks (ESLint, TypeScript, Prettier)
- Security scanning (npm audit, Trivy)
- E2E testing
- Docker image building
- Automated deployment to Cloud Run

## Code Quality

- ESLint with Next.js configuration
- Prettier for consistent code formatting
- TypeScript strict mode
- Pre-commit hooks recommended (Husky, lint-staged)

## Performance Optimizations

- Code splitting with React.lazy
- Dynamic imports for heavy components
- Image optimization with Next.js Image
- Lazy loading for 3D graphics

## Accessibility

- WCAG AA compliance
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Accessibility testing with axe-core

## Tools Used

- Next.js 16 with App Router
- TypeScript
- Tailwind CSS 4
- Three.js, React Three Fiber
- Playwright for E2E tests
- Google Cloud Run with Docker
- GitHub Actions
- Firebase Analytics
- ESLint
- Prettier
- Gemini CLI
- Antigravity IDE
- Gemini Code Assistant
- Google Stitch AI
- Google Jules

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Playwright Documentation](https://playwright.dev)
- [Three.js Documentation](https://threejs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

This project is part of the CivicIQ initiative for voter education.
