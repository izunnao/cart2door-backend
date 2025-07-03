-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'customer');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'customer';
