/*
  Warnings:

  - The values [PRINTED,PRINTING] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [SUCCESS,FAILED,REFUNDED] on the enum `PrintStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');
ALTER TABLE "public"."Payment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Payment" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "public"."PaymentStatus_old";
ALTER TABLE "Payment" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PrintStatus_new" AS ENUM ('PENDING', 'PRINTED', 'PRINTING');
ALTER TABLE "public"."Print" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Print" ALTER COLUMN "status" TYPE "PrintStatus_new" USING ("status"::text::"PrintStatus_new");
ALTER TYPE "PrintStatus" RENAME TO "PrintStatus_old";
ALTER TYPE "PrintStatus_new" RENAME TO "PrintStatus";
DROP TYPE "public"."PrintStatus_old";
ALTER TABLE "Print" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
