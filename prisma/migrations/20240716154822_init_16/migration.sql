-- AlterTable
ALTER TABLE "User" ADD COLUMN     "discoveredOn" TEXT[] DEFAULT ARRAY[]::TEXT[];
