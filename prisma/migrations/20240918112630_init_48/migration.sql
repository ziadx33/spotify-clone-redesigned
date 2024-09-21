/*
  Warnings:

  - You are about to drop the column `nextTypeIds` on the `Queue` table. All the data in the column will be lost.
  - You are about to drop the column `nextTypes` on the `Queue` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Queue` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Queue" DROP CONSTRAINT "Queue_userId_fkey";

-- DropIndex
DROP INDEX "Queue_userId_key";

-- AlterTable
ALTER TABLE "Queue" DROP COLUMN "nextTypeIds",
DROP COLUMN "nextTypes",
DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "QueueList" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "QueueList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_QueueToQueueList" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "QueueList_userId_key" ON "QueueList"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_QueueToQueueList_AB_unique" ON "_QueueToQueueList"("A", "B");

-- CreateIndex
CREATE INDEX "_QueueToQueueList_B_index" ON "_QueueToQueueList"("B");

-- AddForeignKey
ALTER TABLE "QueueList" ADD CONSTRAINT "QueueList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QueueToQueueList" ADD CONSTRAINT "_QueueToQueueList_A_fkey" FOREIGN KEY ("A") REFERENCES "Queue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QueueToQueueList" ADD CONSTRAINT "_QueueToQueueList_B_fkey" FOREIGN KEY ("B") REFERENCES "QueueList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
