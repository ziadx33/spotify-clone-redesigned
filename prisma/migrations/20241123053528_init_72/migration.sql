/*
  Warnings:

  - The `type` column on the `Playlist` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "type",
ADD COLUMN     "type" "PLAYLIST_TYPE" NOT NULL DEFAULT 'PLAYLIST';
