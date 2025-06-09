import { prisma } from '../app/lib/prisma';

async function cleanupTestUsers() {
  try {
    // Option 1: Delete specific users by email pattern
    const testUsers = await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'test', // Deletes any user with 'test' in email
        },
      },
    });

    console.log(`Deleted ${testUsers.count} test users`);

    // Option 2: Delete users created today (uncomment if needed)
    // const today = new Date();
    // today.setHours(0, 0, 0, 0);
    //
    // const todayUsers = await prisma.user.deleteMany({
    //   where: {
    //     createdAt: {
    //       gte: today
    //     }
    //   }
    // });
    //
    // console.log(`Deleted ${todayUsers.count} users created today`);
  } catch (error) {
    console.error('Error cleaning up users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupTestUsers();
