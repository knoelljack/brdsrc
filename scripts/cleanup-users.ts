import { prisma } from '../app/lib/prisma';

// Type for user objects used in logging
type UserForLogging = {
  email: string;
  name: string | null;
};

// Configuration options
const CLEANUP_OPTIONS = {
  // Delete users with 'test' in their email
  testUsers: true,

  // Delete users created in the last X hours (set to 0 to disable)
  recentHours: 0,

  // Delete users without passwords (OAuth only, be careful!)
  oauthOnlyUsers: false,

  // Dry run mode - shows what would be deleted without actually deleting
  dryRun: false,
};

async function cleanupTestUsers() {
  try {
    console.log('🧹 Starting user cleanup...');
    console.log('Options:', CLEANUP_OPTIONS);
    console.log('---');

    let totalDeleted = 0;

    // Cleanup test users
    if (CLEANUP_OPTIONS.testUsers) {
      const testUsersQuery = {
        where: {
          email: {
            contains: 'test',
          },
        },
      };

      if (CLEANUP_OPTIONS.dryRun) {
        const testUsers = await prisma.user.findMany(testUsersQuery);
        console.log(`[DRY RUN] Would delete ${testUsers.length} test users:`);
        testUsers.forEach((user: UserForLogging) =>
          console.log(`  - ${user.email} (${user.name || 'No name'})`)
        );
      } else {
        const testUsers = await prisma.user.deleteMany(testUsersQuery);
        console.log(`✅ Deleted ${testUsers.count} test users`);
        totalDeleted += testUsers.count;
      }
    }

    // Cleanup recent users
    if (CLEANUP_OPTIONS.recentHours > 0) {
      const cutoffTime = new Date();
      cutoffTime.setHours(cutoffTime.getHours() - CLEANUP_OPTIONS.recentHours);

      const recentUsersQuery = {
        where: {
          createdAt: {
            gte: cutoffTime,
          },
        },
      };

      if (CLEANUP_OPTIONS.dryRun) {
        const recentUsers = await prisma.user.findMany(recentUsersQuery);
        console.log(
          `[DRY RUN] Would delete ${recentUsers.length} users created in the last ${CLEANUP_OPTIONS.recentHours} hours:`
        );
        recentUsers.forEach((user: UserForLogging) =>
          console.log(`  - ${user.email} (${user.name || 'No name'})`)
        );
      } else {
        const recentUsers = await prisma.user.deleteMany(recentUsersQuery);
        console.log(
          `✅ Deleted ${recentUsers.count} users created in the last ${CLEANUP_OPTIONS.recentHours} hours`
        );
        totalDeleted += recentUsers.count;
      }
    }

    // Cleanup OAuth-only users (be careful with this!)
    if (CLEANUP_OPTIONS.oauthOnlyUsers) {
      const oauthUsersQuery = {
        where: {
          password: null,
        },
      };

      if (CLEANUP_OPTIONS.dryRun) {
        const oauthUsers = await prisma.user.findMany(oauthUsersQuery);
        console.log(
          `[DRY RUN] Would delete ${oauthUsers.length} OAuth-only users:`
        );
        oauthUsers.forEach((user: UserForLogging) =>
          console.log(`  - ${user.email} (${user.name || 'No name'})`)
        );
      } else {
        const oauthUsers = await prisma.user.deleteMany(oauthUsersQuery);
        console.log(`✅ Deleted ${oauthUsers.count} OAuth-only users`);
        totalDeleted += oauthUsers.count;
      }
    }

    console.log('---');
    if (CLEANUP_OPTIONS.dryRun) {
      console.log('🔍 DRY RUN COMPLETE - No users were actually deleted');
    } else {
      console.log(`🎉 Cleanup complete! Total users deleted: ${totalDeleted}`);
    }

    // Show remaining user count
    const remainingUsers = await prisma.user.count();
    console.log(`📊 Remaining users in database: ${remainingUsers}`);
  } catch (error) {
    console.error('❌ Error cleaning up users:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Check command line arguments
const args = process.argv.slice(2);
if (args.includes('--dry-run')) {
  CLEANUP_OPTIONS.dryRun = true;
}
if (args.includes('--recent=24')) {
  CLEANUP_OPTIONS.recentHours = 24;
}
if (args.includes('--oauth-only')) {
  CLEANUP_OPTIONS.oauthOnlyUsers = true;
}

cleanupTestUsers();
