-- CreateEnum
CREATE TYPE "ExpenditureType" AS ENUM ('INCOME', 'SPENDING');

-- CreateTable
CREATE TABLE "Expenditure" (
    "id" SERIAL NOT NULL,
    "type" "ExpenditureType" NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "monthlyBudgetCategoryId" INTEGER,

    CONSTRAINT "Expenditure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Expenditure_id_key" ON "Expenditure"("id");

-- AddForeignKey
ALTER TABLE "Expenditure" ADD CONSTRAINT "Expenditure_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expenditure" ADD CONSTRAINT "Expenditure_monthlyBudgetCategoryId_fkey" FOREIGN KEY ("monthlyBudgetCategoryId") REFERENCES "MonthlyBudgetCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
