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
      latitude,
      longitude,
      contactName,
      contactPhone,
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

    // Validate coordinates if provided
    if (latitude !== null && longitude !== null) {
      if (
        typeof latitude !== 'number' ||
        typeof longitude !== 'number' ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        return NextResponse.json(
          { error: 'Invalid coordinates provided' },
          { status: 400 }
        );
      }
    }

    // Create location string
    const location = `${city}, ${state}`;

    // Update user's contact info if provided
    if (contactName || contactPhone) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          ...(contactName && { name: contactName.trim() }),
          ...(contactPhone && { phone: contactPhone.trim() }),
        },
      });
    }

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
        latitude: latitude || null,
        longitude: longitude || null,
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
