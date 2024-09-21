-- AlterTable
ALTER TABLE "Queue" ADD COLUMN     "nextTypeIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "nextTypes" "QUEUE_TYPE"[] DEFAULT ARRAY[]::"QUEUE_TYPE"[];
