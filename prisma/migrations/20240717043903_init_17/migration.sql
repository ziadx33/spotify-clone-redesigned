-- CreateEnum
CREATE TYPE "PLAYLIST_VISIBILITY" AS ENUM ('PRIVATE', 'PUBLIC');

-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN     "visibility" "PLAYLIST_VISIBILITY" NOT NULL DEFAULT 'PUBLIC';
