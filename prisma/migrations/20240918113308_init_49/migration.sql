/*
  Warnings:

  - You are about to drop the column `randomize` on the `Queue` table. All the data in the column will be lost.
  - You are about to drop the column `repeatQueue` on the `Queue` table. All the data in the column will be lost.
  - You are about to drop the column `volumeLevel` on the `Queue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Queue" DROP COLUMN "randomize",
DROP COLUMN "repeatQueue",
DROP COLUMN "volumeLevel";

-- AlterTable
ALTER TABLE "QueueList" ADD COLUMN     "randomize" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "repeatQueue" "REPEAT_QUEUE_TYPE" DEFAULT 'PLAYLIST',
ADD COLUMN     "volumeLevel" INTEGER NOT NULL DEFAULT 50;
