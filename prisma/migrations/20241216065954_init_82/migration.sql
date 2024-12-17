-- DropForeignKey
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_folderId_fkey";

-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "playlistIds" TEXT[] DEFAULT ARRAY[]::TEXT[];
