-- CreateEnum
CREATE TYPE "PLAYLIST_SORT_BY" AS ENUM ('TITLE', 'ARTIST', 'ALBUM', 'DATE_ADDED', 'DURATION', 'CUSTOM_ORDER');

-- CreateEnum
CREATE TYPE "PLAYLIST_VIEW_AS" AS ENUM ('COMPACT', 'LIST');

-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN     "sortBy" "PLAYLIST_SORT_BY" NOT NULL DEFAULT 'DATE_ADDED',
ADD COLUMN     "viewAs" "PLAYLIST_VIEW_AS" NOT NULL DEFAULT 'LIST';
