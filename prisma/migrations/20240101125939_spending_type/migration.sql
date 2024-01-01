-- CreateEnum
CREATE TYPE "SpendingType" AS ENUM ('CARD', 'CASH');

-- AlterTable
ALTER TABLE "Expenditure" ADD COLUMN     "spendingType" "SpendingType";
