import { authOptions } from '@/app/lib/auth-config';
import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

// DELETE /api/account/delete - Delete user account and all associated data
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { confirmationText } = await request.json();

    // Require confirmation text to prevent accidental deletions
    if (confirmationText !== 'DELETE MY ACCOUNT') {
      return NextResponse.json(
        { error: 'Invalid confirmation text' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Start a transaction to ensure all deletions happen atomically
    await prisma.$transaction(async tx => {
      // Delete user's favorites (these will be deleted automatically due to CASCADE)
      // But we'll be explicit for clarity
      await tx.favorite.deleteMany({
        where: { userId: user.id },
      });

      // Delete user's surfboard listings
      // This will also delete any favorites of these boards due to CASCADE
      await tx.surfboard.deleteMany({
        where: { userId: user.id },
      });

      // Delete user's sessions
      await tx.session.deleteMany({
        where: { userId: user.id },
      });

      // Delete user's OAuth accounts
      await tx.account.deleteMany({
        where: { userId: user.id },
      });

      // Finally, delete the user
      await tx.user.delete({
        where: { id: user.id },
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Account successfully deleted',
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
