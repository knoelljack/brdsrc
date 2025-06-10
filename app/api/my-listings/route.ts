import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth-config';
import { prisma } from '@/app/lib/prisma';

interface UserListing {
  id: number;
  title: string;
  brand: string;
  length: string;
  condition: string;
  price: number;
  images: string[];
  description: string;
  location: string;
  city: string;
  state: string;
  createdAt: string;
  status: 'active' | 'sold' | 'pending';
}

type SurfboardSelect = {
  id: string;
  title: string;
  brand: string;
  length: string;
  condition: string;
  price: number;
  images: string[];
  description: string;
  location: string;
  city: string;
  state: string;
  status: string;
  createdAt: Date;
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

    // Query database for user's listings
    const listings = await prisma.surfboard.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        brand: true,
        length: true,
        condition: true,
        price: true,
        images: true,
        description: true,
        location: true,
        city: true,
        state: true,
        status: true,
        createdAt: true,
      },
    });

    // Transform to match frontend interface
    const formattedListings: UserListing[] = listings.map(
      (listing: SurfboardSelect) => ({
        id: parseInt(listing.id), // Convert string ID to number for frontend
        title: listing.title,
        brand: listing.brand,
        length: listing.length,
        condition: listing.condition,
        price: listing.price,
        images: listing.images,
        description: listing.description,
        location: listing.location,
        city: listing.city,
        state: listing.state,
        status: listing.status as 'active' | 'sold' | 'pending',
        createdAt: listing.createdAt.toISOString(),
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
