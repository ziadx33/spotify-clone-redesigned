-- DropForeignKey
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_preferenceId_fkey";

-- AlterTable
ALTER TABLE "Preference" ADD COLUMN     "homeLibSection" TEXT[] DEFAULT ARRAY[]::TEXT[];
