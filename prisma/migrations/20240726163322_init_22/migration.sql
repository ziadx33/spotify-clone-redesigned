-- CreateEnum
CREATE TYPE "TAB_TYPE" AS ENUM ('ARTIST', 'PLAYLIST');

-- CreateTable
CREATE TABLE "Tab" (
    "id" TEXT NOT NULL,
    "type" "TAB_TYPE" NOT NULL DEFAULT 'PLAYLIST',
    "href" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Tab_pkey" PRIMARY KEY ("id")
);
