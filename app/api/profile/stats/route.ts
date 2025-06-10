import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth-config';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get stats for the user
    const [totalBoards, activeBoards, soldBoards, pendingBoards] =
      await Promise.all([
        // Total boards ever listed
        prisma.surfboard.count({
          where: { userId: user.id },
        }),
        // Currently active boards
        prisma.surfboard.count({
          where: {
            userId: user.id,
            status: 'active',
          },
        }),
        // Sold boards
        prisma.surfboard.count({
          where: {
            userId: user.id,
            status: 'sold',
          },
        }),
        // Pending boards
        prisma.surfboard.count({
          where: {
            userId: user.id,
            status: 'pending',
          },
        }),
      ]);

    const stats = {
      boardsListed: totalBoards,
      boardsActive: activeBoards,
      boardsSold: soldBoards,
      boardsPending: pendingBoards,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}
