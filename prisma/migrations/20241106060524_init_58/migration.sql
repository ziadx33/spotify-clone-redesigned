/*
  Warnings:

  - You are about to drop the column `href` on the `SearchHistory` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `SearchHistory` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `SearchHistory` table. All the data in the column will be lost.
  - Added the required column `searchPlaylist` to the `SearchHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `searchUser` to the `SearchHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SearchHistory" DROP COLUMN "href",
DROP COLUMN "image",
DROP COLUMN "title",
ADD COLUMN     "searchPlaylist" TEXT NOT NULL,
ADD COLUMN     "searchUser" TEXT NOT NULL;
