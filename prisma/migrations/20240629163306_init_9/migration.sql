/*
  Warnings:

  - You are about to drop the column `coreAlbum` on the `Track` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Track" DROP COLUMN "coreAlbum",
ADD COLUMN     "playlists" TEXT[];
