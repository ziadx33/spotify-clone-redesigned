-- CreateEnum
CREATE TYPE "USER_THEME" AS ENUM ('DARK', 'LIGHT', 'SYSTEM');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "theme" "USER_THEME" NOT NULL DEFAULT 'SYSTEM';
