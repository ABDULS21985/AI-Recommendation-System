-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP DEFAULT,
ALTER COLUMN "password" SET DATA TYPE TEXT;
