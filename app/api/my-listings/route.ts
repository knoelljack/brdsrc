import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth-config';
import { prisma } from '@/app/lib/prisma';

// Helper function to check if a listing has images
// TODO: When migrating to cloud storage, this function can be updated
// to check cloud storage instead of the database array
async function checkListingsHaveImages(
  userId: string
): Promise<SurfboardRawQueryResult[]> {
  return await prisma.$queryRaw<SurfboardRawQueryResult[]>`
    SELECT 
      id, title, brand, length, condition, price, description, 
      location, city, state, status, "createdAt",
      CASE WHEN array_length(images, 1) > 0 THEN true ELSE false END as "hasImages"
    FROM "Surfboard" 
    WHERE "userId" = ${userId}
    ORDER BY "createdAt" DESC
  `;
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
  hasImages: boolean; // Indicate if images exist without loading them
  // TODO: When migrating to cloud storage, add:
  // imageUrls?: string[]; // URLs from cloud storage (loaded on demand)
  // thumbnailUrl?: string; // Optimized thumbnail for listings
}

// Type for raw query result that includes hasImages flag
type SurfboardRawQueryResult = {
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
  hasImages: boolean;
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

    // Get user's listings with image availability check (avoiding loading large image data)
    const listings = await checkListingsHaveImages(user.id);

    // Transform to match frontend interface
    const formattedListings: UserListing[] = listings.map(
      (listing: SurfboardRawQueryResult) => ({
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
        hasImages: listing.hasImages,
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
