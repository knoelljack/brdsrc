import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

// Define the type for surfboard with user data
type SurfboardWithUser = {
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
  latitude: number | null;
  longitude: number | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: {
    name: string | null;
    email: string;
  };
};

export async function GET() {
  try {
    const surfboards = await prisma.surfboard.findMany({
      where: {
        status: 'active', // Only show active listings
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data to match the frontend interface
    const transformedSurfboards = surfboards.map(
      (board: SurfboardWithUser) => ({
        id: board.id,
        title: board.title,
        brand: board.brand,
        length: board.length,
        price: board.price, // Already a number from schema
        condition: board.condition,
        location: board.location,
        city: board.city,
        state: board.state,
        coordinates:
          board.latitude && board.longitude
            ? {
                lat: board.latitude,
                lng: board.longitude,
              }
            : undefined,
        description: board.description,
        images: board.images,
        userId: board.userId,
        status: board.status,
        createdAt: board.createdAt,
        // Include seller contact info for potential buyers
        seller: {
          name: board.user.name,
          email: board.user.email,
        },
      })
    );

    return NextResponse.json({ surfboards: transformedSurfboards });
  } catch (error) {
    console.error('Error fetching surfboards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch surfboards' },
      { status: 500 }
    );
  }
}
