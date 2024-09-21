-- AlterTable
ALTER TABLE "QueueList" ADD COLUMN     "queueListOrder" TEXT[] DEFAULT ARRAY[]::TEXT[];
