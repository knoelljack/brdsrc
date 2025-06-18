import { authOptions } from '@/app/lib/auth-config';
import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// DELETE /api/favorites/[id] - Remove surfboard from favorites
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: surfboardId } = await params;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find and delete the favorite
    const deletedFavorite = await prisma.favorite.deleteMany({
      where: {
        userId: user.id,
        surfboardId: surfboardId,
      },
    });

    if (deletedFavorite.count === 0) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Removed from favorites',
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return NextResponse.json(
      { error: 'Failed to remove from favorites' },
      { status: 500 }
    );
  }
}
