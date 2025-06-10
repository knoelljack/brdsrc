import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth-config';
import { prisma } from '@/app/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

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

    // Find the listing and ensure it belongs to the user
    const listing = await prisma.surfboard.findFirst({
      where: {
        id: id,
        userId: user.id, // Ensure user owns this listing
      },
    });

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json(listing);
  } catch (error) {
    console.error('Error fetching listing for edit:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listing' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      brand,
      length,
      price,
      condition,
      description,
      location,
      city,
      state,
      images,
      status,
    } = body;

    // Validate required fields
    if (!title || !brand || !length || !price || !condition || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user ID from session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify the listing belongs to the user before updating
    const existingListing = await prisma.surfboard.findFirst({
      where: {
        id: id,
        userId: user.id,
      },
    });

    if (!existingListing) {
      return NextResponse.json(
        { error: 'Listing not found or access denied' },
        { status: 404 }
      );
    }

    // Update the listing
    const updatedListing = await prisma.surfboard.update({
      where: { id: id },
      data: {
        title,
        brand,
        length,
        price: parseInt(price),
        condition,
        description,
        location,
        city: city || '',
        state: state || '',
        images: images || [],
        status: status || 'active',
      },
    });

    return NextResponse.json({
      message: 'Listing updated successfully',
      listing: updatedListing,
    });
  } catch (error) {
    console.error('Error updating listing:', error);
    return NextResponse.json(
      { error: 'Failed to update listing' },
      { status: 500 }
    );
  }
}
