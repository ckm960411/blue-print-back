/*
  Warnings:

  - Made the column `date` on table `Expenditure` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hour` on table `Expenditure` required. This step will fail if there are existing NULL values in that column.
  - Made the column `minute` on table `Expenditure` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Expenditure" ALTER COLUMN "date" SET NOT NULL,
ALTER COLUMN "hour" SET NOT NULL,
ALTER COLUMN "minute" SET NOT NULL;
