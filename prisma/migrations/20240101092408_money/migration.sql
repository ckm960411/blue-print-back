/*
  Warnings:

  - Added the required column `userId` to the `Money` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Money" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Money" ADD CONSTRAINT "Money_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
