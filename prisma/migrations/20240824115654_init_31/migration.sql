/*
  Warnings:

  - You are about to drop the column `playlistId` on the `SearchHistory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SearchHistory" DROP CONSTRAINT "SearchHistory_playlistId_fkey";

-- AlterTable
ALTER TABLE "SearchHistory" DROP COLUMN "playlistId",
ADD COLUMN     "image" TEXT NOT NULL DEFAULT '';
