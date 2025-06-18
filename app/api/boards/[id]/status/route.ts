import { authOptions } from '@/app/lib/auth-config';
import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/boards/[id]/status - Update board status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: boardId } = await params;
    const { status } = await request.json();

    // Validate status
    if (!status || !['active', 'sold'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "active" or "sold"' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if board exists and belongs to the user
    const board = await prisma.surfboard.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      return NextResponse.json(
        { error: 'Surfboard not found' },
        { status: 404 }
      );
    }

    if (board.userId !== user.id) {
      return NextResponse.json(
        { error: 'You can only update your own listings' },
        { status: 403 }
      );
    }

    // Update the board status
    const updatedBoard = await prisma.surfboard.update({
      where: { id: boardId },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      message: `Board marked as ${status}`,
      board: {
        id: updatedBoard.id,
        status: updatedBoard.status,
        updatedAt: updatedBoard.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error updating board status:', error);
    return NextResponse.json(
      { error: 'Failed to update board status' },
      { status: 500 }
    );
  }
}
