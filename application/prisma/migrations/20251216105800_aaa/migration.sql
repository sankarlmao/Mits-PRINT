/*
  Warnings:

  - The `pageRange` column on the `Print` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PrintRange" AS ENUM ('ALL', 'EVEN', 'ODD', 'CUSTOM');

-- AlterTable
ALTER TABLE "Print" ADD COLUMN     "customRange" TEXT,
DROP COLUMN "pageRange",
ADD COLUMN     "pageRange" "PrintRange" NOT NULL DEFAULT 'ALL';
