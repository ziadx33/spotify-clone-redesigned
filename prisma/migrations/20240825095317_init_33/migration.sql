-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "GENRES" ADD VALUE 'ROCK';
ALTER TYPE "GENRES" ADD VALUE 'POP';
ALTER TYPE "GENRES" ADD VALUE 'JAZZ';
ALTER TYPE "GENRES" ADD VALUE 'HIP_HOP';
ALTER TYPE "GENRES" ADD VALUE 'ELECTRONIC';
ALTER TYPE "GENRES" ADD VALUE 'CLASSICAL';
ALTER TYPE "GENRES" ADD VALUE 'REGGAE';
ALTER TYPE "GENRES" ADD VALUE 'COUNTRY';
ALTER TYPE "GENRES" ADD VALUE 'BLUES';
ALTER TYPE "GENRES" ADD VALUE 'RNB';
ALTER TYPE "GENRES" ADD VALUE 'METAL';
ALTER TYPE "GENRES" ADD VALUE 'FOLK';
ALTER TYPE "GENRES" ADD VALUE 'TECHNO';

-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "genres" "GENRES"[] DEFAULT ARRAY[]::"GENRES"[];
