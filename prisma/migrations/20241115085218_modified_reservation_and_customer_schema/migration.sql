/*
  Warnings:

  - You are about to drop the column `roomId` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the `Room` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_roomId_fkey";

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "loyaltyPoints" INTEGER,
ADD COLUMN     "preferredRoomType" "RoomType",
ADD COLUMN     "profilePicture" TEXT;

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "roomId",
ADD COLUMN     "bookingRefNumber" TEXT,
ADD COLUMN     "bookingSource" TEXT,
ADD COLUMN     "cancellationReason" TEXT,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "checkInTime" TIMESTAMP(3),
ADD COLUMN     "checkOutTime" TIMESTAMP(3),
ADD COLUMN     "discountApplied" DECIMAL(65,30),
ADD COLUMN     "earlyCheckinRequest" BOOLEAN,
ADD COLUMN     "lateCheckoutRequest" BOOLEAN,
ADD COLUMN     "refundedAmount" DECIMAL(65,30);

-- DropTable
DROP TABLE "Room";
