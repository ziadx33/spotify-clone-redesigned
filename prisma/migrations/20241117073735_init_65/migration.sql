/*
  Warnings:

  - You are about to drop the column `type` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "type";

-- DropEnum
DROP TYPE "NOTIFICATION_TYPE";
