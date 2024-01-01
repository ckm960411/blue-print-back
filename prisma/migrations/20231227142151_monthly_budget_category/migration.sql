/*
  Warnings:

  - You are about to drop the column `month` on the `MonthlyBudgetCategory` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `MonthlyBudgetCategory` table. All the data in the column will be lost.
  - Added the required column `monthlyBudgetId` to the `MonthlyBudgetCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MonthlyBudgetCategory" DROP COLUMN "month",
DROP COLUMN "year",
ADD COLUMN     "monthlyBudgetId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "MonthlyBudgetCategory" ADD CONSTRAINT "MonthlyBudgetCategory_monthlyBudgetId_fkey" FOREIGN KEY ("monthlyBudgetId") REFERENCES "MonthlyBudget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
