/*
  Warnings:

  - Made the column `content` on table `Expenditure` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Expenditure" ALTER COLUMN "content" SET NOT NULL;
