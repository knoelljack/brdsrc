import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Surfboards - Find Your Perfect Board',
  description:
    'Browse hundreds of quality used surfboards for sale. Filter by location, size, price, condition, and brand to find your perfect board.',
  keywords: [
    'browse surfboards',
    'surfboards for sale',
    'used surfboards',
    'buy surfboards online',
    'surfboard marketplace',
    'longboards for sale',
    'shortboards for sale',
  ],
  openGraph: {
    title: 'Browse Surfboards - Find Your Perfect Board',
    description:
      'Browse hundreds of quality used surfboards for sale. Filter by location, size, price, condition, and brand.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse Surfboards - Find Your Perfect Board',
    description: 'Browse hundreds of quality used surfboards for sale.',
  },
};

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
