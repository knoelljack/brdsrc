import { authOptions } from '@/app/lib/auth-config';
import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

interface FavoriteWithSurfboard {
  id: string;
  userId: string;
  surfboardId: string;
  createdAt: Date;
  surfboard: {
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
      phone: string | null;
    };
  };
}

// GET /api/favorites - Get user's favorite surfboards
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: {
        surfboard: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform the data to match frontend interface
    const transformedFavorites = favorites.map(
      (favorite: FavoriteWithSurfboard) => ({
        id: favorite.surfboard.id,
        title: favorite.surfboard.title,
        brand: favorite.surfboard.brand,
        length: favorite.surfboard.length,
        price: favorite.surfboard.price,
        condition: favorite.surfboard.condition,
        location: favorite.surfboard.location,
        city: favorite.surfboard.city,
        state: favorite.surfboard.state,
        coordinates:
          favorite.surfboard.latitude && favorite.surfboard.longitude
            ? {
                lat: favorite.surfboard.latitude,
                lng: favorite.surfboard.longitude,
              }
            : undefined,
        description: favorite.surfboard.description,
        images: favorite.surfboard.images,
        userId: favorite.surfboard.userId,
        status: favorite.surfboard.status,
        createdAt: favorite.surfboard.createdAt,
        favoritedAt: favorite.createdAt, // When user favorited it
        seller: {
          name: favorite.surfboard.user.name,
          email: favorite.surfboard.user.email,
          phone: favorite.surfboard.user.phone,
        },
      })
    );

    return NextResponse.json({ favorites: transformedFavorites });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

// POST /api/favorites - Add surfboard to favorites
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { surfboardId } = await request.json();

    if (!surfboardId) {
      return NextResponse.json(
        { error: 'Surfboard ID is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if surfboard exists
    const surfboard = await prisma.surfboard.findUnique({
      where: { id: surfboardId },
    });

    if (!surfboard) {
      return NextResponse.json(
        { error: 'Surfboard not found' },
        { status: 404 }
      );
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_surfboardId: {
          userId: user.id,
          surfboardId: surfboardId,
        },
      },
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Surfboard already in favorites' },
        { status: 409 }
      );
    }

    // Add to favorites
    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        surfboardId: surfboardId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Added to favorites',
      favoriteId: favorite.id,
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return NextResponse.json(
      { error: 'Failed to add to favorites' },
      { status: 500 }
    );
  }
}
