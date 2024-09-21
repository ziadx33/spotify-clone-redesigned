/*
  Warnings:

  - Added the required column `currentQueueId` to the `QueueList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QueueList" ADD COLUMN     "currentQueueId" TEXT NOT NULL;
