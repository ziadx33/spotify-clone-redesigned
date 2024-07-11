/*
  Warnings:

  - The `followers` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "followers",
ADD COLUMN     "followers" TEXT[] DEFAULT ARRAY[]::TEXT[];
