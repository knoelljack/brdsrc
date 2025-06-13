import { authOptions } from '@/app/lib/auth-config';
import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const {
      title,
      brand,
      length,
      condition,
      price,
      description,
      city,
      state,
      images,
      // contactName, contactEmail, contactPhone - we'll store these later if needed
    } = body;

    // Validation
    if (
      !title ||
      !brand ||
      !length ||
      !condition ||
      !price ||
      !description ||
      !city ||
      !state
    ) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    if (price <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    // Create location string
    const location = `${city}, ${state}`;

    // Create the surfboard listing
    const surfboard = await prisma.surfboard.create({
      data: {
        title: title.trim(),
        brand: brand.trim(),
        length: length.trim(),
        condition: condition.trim(),
        price: parseInt(price),
        description: description.trim(),
        location,
        city: city.trim(),
        state: state.trim(),
        images: images || [], // Store the uploaded images
        status: 'active',
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        surfboard: {
          id: surfboard.id,
          title: surfboard.title,
          location: surfboard.location,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Surfboard creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
