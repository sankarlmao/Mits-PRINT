-- CreateEnum
CREATE TYPE "PrinterStatus" AS ENUM ('OFF', 'READY', 'OUT_OF_PAPER', 'ERROR');

-- CreateTable
CREATE TABLE "Printer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "PrinterStatus" NOT NULL DEFAULT 'READY',

    CONSTRAINT "Printer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Printer_id_key" ON "Printer"("id");
