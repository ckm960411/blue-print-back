/*
  Warnings:

  - You are about to drop the `UserExercise` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserExercise" DROP CONSTRAINT "UserExercise_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "UserExercise" DROP CONSTRAINT "UserExercise_userId_fkey";

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "userId" INTEGER;

-- DropTable
DROP TABLE "UserExercise";

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
