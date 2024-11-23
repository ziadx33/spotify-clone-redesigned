/*
  Warnings:

  - The `type` column on the `Playlist` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
ALTER TYPE "PLAYLIST_TYPE" ADD VALUE 'PLAYLIST';

-- AlterTable
ALTER TABLE "Playlist" ALTER COLUMN "imageSrc" SET DEFAULT '/images/no-image-playlist.png',
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT '';
