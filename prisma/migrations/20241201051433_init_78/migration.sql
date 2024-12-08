/*
  Warnings:

  - You are about to drop the column `following` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "following",
ADD COLUMN     "followers" TEXT[] DEFAULT ARRAY[]::TEXT[];
