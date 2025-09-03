-- AlterTable
ALTER TABLE "User" ADD COLUMN     "shopAddress" TEXT,
ADD COLUMN     "shopDescription" TEXT,
ADD COLUMN     "shopName" TEXT,
ADD COLUMN     "shopWebsite" TEXT,
ADD COLUMN     "userType" TEXT NOT NULL DEFAULT 'individual';
