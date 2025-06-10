import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth-config';

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

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For now, return empty array since we don't have surfboard listings in the database yet
    // This is where you would query the database for user's listings:
    // const listings = await prisma.surfboard.findMany({
    //   where: { userId: session.user.id },
    //   orderBy: { createdAt: 'desc' }
    // });

    // Mock data for demonstration - replace with real database query
    const mockListings: UserListing[] = [
      // You can add mock listings here for testing
      // {
      //   id: 1,
      //   title: "9'6\" Performance Longboard",
      //   brand: "Bing Surfboards",
      //   length: "9'6\"",
      //   condition: "Good",
      //   price: 850,
      //   images: ["/placeholder-board.jpg"],
      //   description: "Classic performance longboard in great condition. Perfect for nose riding and cruising small to medium waves.",
      //   location: "Malibu, CA",
      //   city: "Malibu",
      //   state: "CA",
      //   createdAt: new Date().toISOString(),
      //   status: "active" as const
      // }
    ];

    return NextResponse.json(mockListings);
  } catch (error) {
    console.error('My listings fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
