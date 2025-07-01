import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import SessionProvider from './components/providers/SessionProvider';
import { FavoritesProvider } from './context/FavoritesContext';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'BoardSource - Buy & Sell Surfboards Online',
    template: '%s | BoardSource',
  },
  description:
    'Find quality used surfboards from surfers worldwide. Buy and sell longboards, shortboards, and specialty boards with confidence on BoardSource marketplace.',
  keywords: [
    'surfboards',
    'buy surfboards',
    'sell surfboards',
    'used surfboards',
    'surfboard marketplace',
    'longboards',
    'shortboards',
    'surf gear',
    'surfing equipment',
  ],
  authors: [{ name: 'BoardSource' }],
  creator: 'BoardSource',
  publisher: 'BoardSource',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'https://brdsrc.com'
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'BoardSource - Buy & Sell Surfboards Online',
    description:
      'Find quality used surfboards from surfers worldwide. Buy and sell longboards, shortboards, and specialty boards with confidence.',
    siteName: 'BoardSource',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BoardSource - Surfboard Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BoardSource - Buy & Sell Surfboards Online',
    description:
      'Find quality used surfboards from surfers worldwide. Buy and sell longboards, shortboards, and specialty boards with confidence.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    // bing: process.env.BING_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'BoardSource',
              description:
                'Buy and sell quality surfboards from surfers worldwide',
              url: process.env.NEXT_PUBLIC_BASE_URL || 'https://brdsrc.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://brdsrc.com'}/?search={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <FavoritesProvider>{children}</FavoritesProvider>
        </SessionProvider>

        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}

        {/* Google Places API */}
        <Script
          id="google-maps"
          strategy="afterInteractive"
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`}
        />
      </body>
    </html>
  );
}
