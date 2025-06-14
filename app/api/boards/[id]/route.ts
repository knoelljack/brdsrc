import { surfboards as dummySurfboards } from '@/app/data/surfboards';
import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // First, try to find in database (real listings)
    if (id && isNaN(Number(id))) {
      // If ID is not a number, it's likely a database ID (cuid)
      const surfboard = await prisma.surfboard.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      if (surfboard) {
        const transformedSurfboard = {
          id: surfboard.id,
          title: surfboard.title,
          brand: surfboard.brand,
          length: surfboard.length,
          price: surfboard.price, // Already a number from schema
          condition: surfboard.condition,
          location: surfboard.location,
          city: surfboard.city,
          state: surfboard.state,
          description: surfboard.description,
          images: surfboard.images,
          userId: surfboard.userId,
          status: surfboard.status,
          createdAt: surfboard.createdAt,
          seller: {
            name: surfboard.user.name,
            email: surfboard.user.email,
            phone: surfboard.user.phone,
          },
        };

        return NextResponse.json({ surfboard: transformedSurfboard });
      }
    }

    // If not found in database, try dummy data (for IDs > 10000, we subtract the offset)
    const numericId = Number(id);
    if (!isNaN(numericId)) {
      const dummyId = numericId > 10000 ? numericId - 10000 : numericId;
      const dummyBoard = dummySurfboards.find(b => b.id === dummyId);

      if (dummyBoard) {
        return NextResponse.json({
          surfboard: {
            ...dummyBoard,
            id: numericId, // Keep the offset ID for consistency
          },
        });
      }
    }

    return NextResponse.json({ error: 'Surfboard not found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching surfboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch surfboard' },
      { status: 500 }
    );
  }
}
