import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CivicIQ — Multilingual Electoral Education Assistant',
  description:
    'CivicIQ helps voters understand the electoral process — voter registration, polling day procedures, and EVM/VVPAT voting — in 22 Indian languages with complete political neutrality.',
  keywords: [
    'voter education',
    'election process',
    'EVM simulator',
    'VVPAT',
    'voter registration India',
    'multilingual',
    'civic education',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Professional clean background */}
        <div className="professional-bg" aria-hidden="true" />

        {children}
      </body>
    </html>
  );
}
