/*
  Warnings:

  - You are about to drop the column `type` on the `Chalet` table. All the data in the column will be lost.
  - Added the required column `chaletType` to the `Chalet` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Chalet_available_type_idx";

-- AlterTable
ALTER TABLE "Chalet" DROP COLUMN "type",
ADD COLUMN     "chaletType" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Chalet_available_chaletType_idx" ON "Chalet"("available", "chaletType");
