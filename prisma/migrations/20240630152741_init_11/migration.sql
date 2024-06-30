-- AlterTable
ALTER TABLE "User" ADD COLUMN     "playlists" TEXT[] DEFAULT ARRAY[]::TEXT[];
