import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth-config';
import { prisma } from '@/app/lib/prisma';
import { del } from '@vercel/blob';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params;

    // Check if the surfboard exists and belongs to the user
    const surfboard = await prisma.surfboard.findUnique({
      where: { id },
      select: { id: true, userId: true, title: true, images: true },
    });

    if (!surfboard) {
      return NextResponse.json(
        { error: 'Surfboard not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (surfboard.userId !== user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own listings' },
        { status: 403 }
      );
    }

    // Delete image blobs from Vercel Blob storage
    if (surfboard.images && Array.isArray(surfboard.images)) {
      for (const imageUrl of surfboard.images) {
        try {
          if (
            typeof imageUrl === 'string' &&
            imageUrl.includes('blob.vercel-storage.com')
          ) {
            await del(imageUrl);
          }
        } catch (blobError) {
          console.error('Error deleting blob:', imageUrl, blobError);
          // Continue with deletion even if blob deletion fails
        }
      }
    }

    // Delete the surfboard from database
    await prisma.surfboard.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `"${surfboard.title}" has been deleted successfully`,
    });
  } catch (error) {
    console.error('Surfboard deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET method for fetching individual surfboard details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const surfboard = await prisma.surfboard.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!surfboard) {
      return NextResponse.json(
        { error: 'Surfboard not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(surfboard);
  } catch (error) {
    console.error('Surfboard fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
