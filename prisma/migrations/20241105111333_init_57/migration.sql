-- AlterTable
ALTER TABLE "Preference" ADD COLUMN     "ShowFollowersList" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "ShowTopPlayingTracks" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "ShowFollowingList" SET DEFAULT false;
