-- AlterTable
ALTER TABLE "Preference" ALTER COLUMN "homeSectionsSort" SET DEFAULT ARRAY['made for you', 'your favorite artists', 'best of artists']::TEXT[];
