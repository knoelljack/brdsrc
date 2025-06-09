import { prisma } from '../app/lib/prisma';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');

    // Create some test users
    const testUsers = [
      {
        name: 'Test User 1',
        email: 'test1@example.com',
        password: 'password123',
      },
      {
        name: 'Test User 2',
        email: 'test2@example.com',
        password: 'password123',
      },
      {
        name: 'Demo User',
        email: 'demo@boardsource.com',
        password: 'demo123',
      },
    ];

    for (const userData of testUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (!existingUser) {
        const user = await prisma.user.create({
          data: {
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
          },
        });
        console.log(`✅ Created user: ${user.email}`);
      } else {
        console.log(`⚠️  User already exists: ${userData.email}`);
      }
    }

    console.log('🎉 Database seeding complete!');

    // Show total user count
    const totalUsers = await prisma.user.count();
    console.log(`📊 Total users in database: ${totalUsers}`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
