-- CreateEnum
CREATE TYPE "USER_THEME" AS ENUM ('DARK', 'LIGHT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "theme" "USER_THEME" NOT NULL DEFAULT 'DARK';

-- AlterTable
ALTER TABLE "_QueueToQueueList" ADD CONSTRAINT "_QueueToQueueList_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_QueueToQueueList_AB_unique";
