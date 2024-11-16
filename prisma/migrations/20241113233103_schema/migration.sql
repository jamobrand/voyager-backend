/*
  Warnings:

  - Added the required column `paymentMethod` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ChaletType" ADD VALUE 'LUXURY';

-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'PARTIALLY_PAID';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ReservationStatus" ADD VALUE 'CHECKED_IN';
ALTER TYPE "ReservationStatus" ADD VALUE 'CHECKED_OUT';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "RoomType" ADD VALUE 'DELUXE';
ALTER TYPE "RoomType" ADD VALUE 'EXECUTIVE';

-- AlterTable
ALTER TABLE "Chalet" ADD COLUMN     "amenities" TEXT[],
ADD COLUMN     "description" TEXT,
ADD COLUMN     "maintenanceMode" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "address" TEXT,
ADD COLUMN     "nationalIdNumber" TEXT,
ADD COLUMN     "nationality" TEXT;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "paymentMethod" TEXT NOT NULL,
ADD COLUMN     "transactionId" TEXT;

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "adults" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "children" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "specialRequests" TEXT;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "amenities" TEXT[],
ADD COLUMN     "description" TEXT,
ADD COLUMN     "floor" INTEGER,
ADD COLUMN     "maintenanceMode" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Chalet_available_type_idx" ON "Chalet"("available", "type");

-- CreateIndex
CREATE INDEX "Payment_status_date_idx" ON "Payment"("status", "date");

-- CreateIndex
CREATE INDEX "Reservation_checkIn_checkOut_idx" ON "Reservation"("checkIn", "checkOut");

-- CreateIndex
CREATE INDEX "Reservation_status_paymentStatus_idx" ON "Reservation"("status", "paymentStatus");

-- CreateIndex
CREATE INDEX "Room_available_type_idx" ON "Room"("available", "type");
