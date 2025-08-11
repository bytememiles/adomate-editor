import { Geist, Geist_Mono } from 'next/font/google';
import type { Metadata, Viewport } from 'next';

import '@/styles/index.css';
import Providers from './providers';

// Font configuration
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

// Metadata configuration
export const metadata: Metadata = {
  title: {
    default: 'Adomate Editor',
    template: '%s | Adomate Editor',
  },
  description: 'A modern, desktop-focused editor built with Next.js 15 and Tailwind CSS',
  publisher: 'Adomate',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Root layout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html
      lang='en'
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className='min-h-screen bg-neutral-50 text-neutral-900 antialiased'>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
