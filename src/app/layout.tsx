import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Gems Signals — Discover Opportunities Around You',
  description:
    'AI-powered location intelligence platform. Discover hidden gems, trending spots, events, and more — all tailored to your neighborhood.',
  keywords: [
    'location intelligence',
    'discover places',
    'hidden gems',
    'Nairobi',
    'local events',
    'AI recommendations',
    'find restaurants',
    'property listings',
  ],
  authors: [{ name: 'Gems Signals' }],
  creator: 'Gems Signals',
  openGraph: {
    title: 'Gems Signals — Discover Opportunities Around You',
    description: 'AI-powered location intelligence platform for your neighborhood.',
    type: 'website',
    locale: 'en_KE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gems Signals',
    description: 'Discover opportunities around you.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#8b5cf6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}