/*
  Warnings:

  - You are about to drop the column `sortBy` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `viewAs` on the `Playlist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "sortBy",
DROP COLUMN "viewAs";

-- AlterTable
ALTER TABLE "Track" ALTER COLUMN "playlists" SET DEFAULT ARRAY[]::TEXT[];
