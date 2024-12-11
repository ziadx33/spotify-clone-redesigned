-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "likedUsers" TEXT[] DEFAULT ARRAY[]::TEXT[];
