/*
  Warnings:

  - You are about to drop the column `number` on the `Chalet` table. All the data in the column will be lost.
  - Added the required column `name` to the `Chalet` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Chalet_number_key";

-- AlterTable
ALTER TABLE "Chalet" DROP COLUMN "number",
ADD COLUMN     "name" TEXT NOT NULL;
