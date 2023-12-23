/*
  Warnings:

  - You are about to drop the `MontlyBudget` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "MontlyBudget";

-- CreateTable
CREATE TABLE "MonthlyBudget" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "type" "MonthlyBudgetType" NOT NULL,
    "budget" INTEGER,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "MonthlyBudget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyBudget_id_key" ON "MonthlyBudget"("id");

-- AddForeignKey
ALTER TABLE "MonthlyBudget" ADD CONSTRAINT "MonthlyBudget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
