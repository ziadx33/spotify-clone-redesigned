-- AlterTable
ALTER TABLE "Preference" ADD COLUMN     "ShowFollowingList" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "ShowPlaylistsInProfile" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "ShowTopPlayingArtists" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showPlayingView" BOOLEAN NOT NULL DEFAULT true;
