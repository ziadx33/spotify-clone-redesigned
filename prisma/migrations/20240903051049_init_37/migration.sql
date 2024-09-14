-- AlterTable
ALTER TABLE "Preference" ADD COLUMN     "homeSectionsSort" TEXT[] DEFAULT ARRAY[]::TEXT[];
