/*
  Warnings:

  - You are about to drop the column `topArtistsLastReset` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tracksHistoryLastReset` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "topArtistsLastReset",
DROP COLUMN "tracksHistoryLastReset";
