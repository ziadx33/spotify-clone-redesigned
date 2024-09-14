-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN     "preferenceId" TEXT;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_preferenceId_fkey" FOREIGN KEY ("preferenceId") REFERENCES "Preference"("id") ON DELETE SET NULL ON UPDATE CASCADE;
