import { Surfboard } from '@/app/data/surfboards';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BoardDetailClient from './BoardDetailClient';

interface BoardDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function fetchBoard(id: string): Promise<Surfboard | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/boards/${id}`, {
      cache: 'no-store', // Always fetch fresh data for SEO
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error('Failed to fetch board details');
    }

    const data = await response.json();
    return data.surfboard;
  } catch (error) {
    console.error('Error fetching board:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: BoardDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const board = await fetchBoard(id);

  if (!board) {
    return {
      title: 'Board Not Found',
      description: 'The requested surfboard could not be found.',
    };
  }

  const title = `${board.title} - ${board.brand} ${board.length} Surfboard`;
  const description = `${board.condition} condition ${board.brand} ${board.length} surfboard for $${board.price}. Located in ${board.location || `${board.city}, ${board.state}`}. ${board.description.substring(0, 100)}...`;

  const imageUrl =
    board.images && board.images.length > 0
      ? board.images[0].startsWith('data:')
        ? '/og-image.jpg' // Fallback for base64 images
        : board.images[0]
      : '/og-image.jpg';

  return {
    title,
    description,
    keywords: [
      board.brand,
      board.title,
      board.length,
      board.condition,
      'surfboard',
      'buy surfboard',
      board.city,
      board.state,
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: `${board.title} - ${board.brand} surfboard`,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `/boards/${id}`,
    },
  };
}

// Generate structured data for the product
function generateProductStructuredData(board: Surfboard) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${board.title} - ${board.brand}`,
    description: board.description,
    brand: {
      '@type': 'Brand',
      name: board.brand,
    },
    offers: {
      '@type': 'Offer',
      price: board.price.toString(),
      priceCurrency: 'USD',
      availability:
        board.status === 'active'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Person',
        name: board.seller?.name || 'BoardSource Seller',
      },
    },
    condition: 'https://schema.org/UsedCondition',
    category: 'Sporting Goods > Water Sports > Surfing > Surfboards',
    image:
      board.images &&
      board.images.length > 0 &&
      !board.images[0].startsWith('data:')
        ? board.images[0]
        : undefined,
  };
}

export default async function BoardDetailPage({
  params,
}: BoardDetailPageProps) {
  const { id } = await params;
  const board = await fetchBoard(id);

  if (!board) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateProductStructuredData(board)),
        }}
      />
      <BoardDetailClient board={board} />
    </>
  );
}
