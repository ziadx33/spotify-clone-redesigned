/*
  Warnings:

  - You are about to drop the column `followers` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "followers",
ADD COLUMN     "following" TEXT[] DEFAULT ARRAY[]::TEXT[];
