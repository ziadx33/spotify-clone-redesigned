/*
  Warnings:

  - You are about to drop the column `authorId` on the `Playlist` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_authorId_fkey";

-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "authorId";

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
