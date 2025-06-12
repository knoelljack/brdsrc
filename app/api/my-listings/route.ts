import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth-config';
import { prisma } from '@/app/lib/prisma';

// Helper function to get listings with image information for cloud storage
async function getListingsWithImageInfo(
  userId: string
): Promise<SurfboardWithImageInfo[]> {
  return await prisma.surfboard.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      brand: true,
      length: true,
      condition: true,
      price: true,
      description: true,
      location: true,
      city: true,
      state: true,
      status: true,
      createdAt: true,
      images: true, // Now we can safely load image URLs (not base64)
    },
  });
}

interface UserListing {
  id: string;
  title: string;
  brand: string;
  length: string;
  condition: string;
  price: number;
  description: string;
  location: string;
  city: string;
  state: string;
  createdAt: string;
  status: 'active' | 'sold' | 'pending';
  hasImages: boolean;
  thumbnailUrl?: string; // First image URL for thumbnail
}

// Type for database query result with image URLs
type SurfboardWithImageInfo = {
  id: string;
  title: string;
  brand: string;
  length: string;
  condition: string;
  price: number;
  description: string;
  location: string;
  city: string;
  state: string;
  status: string;
  createdAt: Date;
  images: string[];
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user ID from session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's listings with image URLs (now safe since they're URLs, not base64)
    const listings = await getListingsWithImageInfo(user.id);

    // Transform to match frontend interface
    const formattedListings: UserListing[] = listings.map(
      (listing: SurfboardWithImageInfo) => ({
        id: listing.id,
        title: listing.title,
        brand: listing.brand,
        length: listing.length,
        condition: listing.condition,
        price: listing.price,
        description: listing.description,
        location: listing.location,
        city: listing.city,
        state: listing.state,
        status: listing.status as 'active' | 'sold' | 'pending',
        createdAt: listing.createdAt.toISOString(),
        hasImages: listing.images.length > 0,
        thumbnailUrl: listing.images.length > 0 ? listing.images[0] : undefined,
      })
    );

    return NextResponse.json(formattedListings);
  } catch (error) {
    console.error('My listings fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
