/*
  Warnings:

  - You are about to drop the column `status` on the `Print` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" "PrintStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Print" DROP COLUMN "status";
