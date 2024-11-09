-- CreateEnum
CREATE TYPE "CATEGORIES" AS ENUM ('Playlists', 'Artists', 'Albums');

-- AlterTable
ALTER TABLE "Preference" ADD COLUMN     "currentCategory" "CATEGORIES",
ADD COLUMN     "showSidebar" BOOLEAN NOT NULL DEFAULT true;
