/*
  Warnings:

  - Added the required column `type` to the `Printer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Printer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Printer" ADD COLUMN     "reason" TEXT,
ADD COLUMN     "type" "ColorMode" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
