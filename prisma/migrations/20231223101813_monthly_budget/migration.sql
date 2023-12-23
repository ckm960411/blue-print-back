-- CreateEnum
CREATE TYPE "MonthlyBudgetType" AS ENUM ('SUM', 'SPECIFIED');

-- CreateTable
CREATE TABLE "MontlyBudget" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "type" "MonthlyBudgetType" NOT NULL,
    "budget" INTEGER,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,

    CONSTRAINT "MontlyBudget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "unicode" TEXT NOT NULL,

    CONSTRAINT "BudgetCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyBudgetCategory" (
    "id" SERIAL NOT NULL,
    "budgetCategoryId" INTEGER,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "budget" INTEGER NOT NULL,

    CONSTRAINT "MonthlyBudgetCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MontlyBudget_id_key" ON "MontlyBudget"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BudgetCategory_id_key" ON "BudgetCategory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyBudgetCategory_id_key" ON "MonthlyBudgetCategory"("id");

-- AddForeignKey
ALTER TABLE "MonthlyBudgetCategory" ADD CONSTRAINT "MonthlyBudgetCategory_budgetCategoryId_fkey" FOREIGN KEY ("budgetCategoryId") REFERENCES "BudgetCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
