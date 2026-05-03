import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import FirebaseAnalytics from "@/shared/FirebaseAnalytics/FirebaseAnalytics";
import ErrorBoundary from "@/shared/ErrorBoundary/ErrorBoundary";

// Next.js font optimization — eliminates render-blocking @import
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-merriweather",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CivicIQ — Multilingual Electoral Education Assistant",
  description:
    "CivicIQ helps voters understand the electoral process — voter registration, polling day procedures, and EVM/VVPAT voting — in 22 Indian languages with complete political neutrality.",
  keywords: [
    "voter education",
    "election process",
    "EVM simulator",
    "VVPAT",
    "voter registration India",
    "multilingual",
    "civic education",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${merriweather.variable}`}>
        {/* Skip to Content for screen readers and keyboard users */}
        <a href="#main-content" className="skip-link">Skip to Content</a>

        {/* Firebase Analytics */}
        <FirebaseAnalytics />

        {/* Error Boundary */}
        <ErrorBoundary>
          {/* Professional clean background */}
          <div className="professional-bg" aria-hidden="true" />

          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
