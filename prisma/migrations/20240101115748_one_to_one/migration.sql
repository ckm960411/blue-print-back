/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Money` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Money_userId_key" ON "Money"("userId");
