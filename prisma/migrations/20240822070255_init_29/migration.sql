-- CreateTable
CREATE TABLE "SearchHistory" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "type" "TAB_TYPE" NOT NULL DEFAULT 'PLAYLIST',
    "href" TEXT NOT NULL DEFAULT '',
    "userId" TEXT,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "SearchHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SearchHistory" ADD CONSTRAINT "SearchHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
