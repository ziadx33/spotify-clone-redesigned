/*
  Warnings:

  - You are about to drop the column `albumId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `trackId` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "albumId",
DROP COLUMN "trackId",
ADD COLUMN     "playlistId" TEXT;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
