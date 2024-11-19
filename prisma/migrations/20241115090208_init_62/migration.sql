/*
  Warnings:

  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "NOTIFICATION_TYPE" AS ENUM ('TRACK', 'ALBUM');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "seenNotifications" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "password" SET NOT NULL;

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "type" "NOTIFICATION_TYPE" NOT NULL DEFAULT 'TRACK',
    "userId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
