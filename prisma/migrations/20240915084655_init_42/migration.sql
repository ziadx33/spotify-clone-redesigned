-- CreateEnum
CREATE TYPE "QUEUE_TYPE" AS ENUM ('PLAYLIST', 'ARTIST');

-- CreateEnum
CREATE TYPE "REPEAT_QUEUE_TYPE" AS ENUM ('TRACK', 'PLAYLIST');

-- CreateTable
CREATE TABLE "Queue" (
    "id" TEXT NOT NULL,
    "type" "QUEUE_TYPE" NOT NULL DEFAULT 'PLAYLIST',
    "typeId" TEXT NOT NULL,
    "currentPlaying" TEXT NOT NULL,
    "currentPlayingProgress" INTEGER NOT NULL DEFAULT 0,
    "trackList" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "volumeLevel" INTEGER NOT NULL DEFAULT 50,
    "repeatQueue" "REPEAT_QUEUE_TYPE" NOT NULL DEFAULT 'PLAYLIST',
    "randomize" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Queue_pkey" PRIMARY KEY ("id")
);
