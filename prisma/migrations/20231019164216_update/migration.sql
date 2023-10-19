/*
  Warnings:

  - The values [None] on the enum `ProgressStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProgressStatus_new" AS ENUM ('ToDo', 'InProgress', 'Review', 'Completed');
ALTER TABLE "Task" ALTER COLUMN "progress" DROP DEFAULT;
ALTER TABLE "Milestone" ALTER COLUMN "progress" DROP DEFAULT;
ALTER TABLE "Task" ALTER COLUMN "progress" TYPE "ProgressStatus_new" USING ("progress"::text::"ProgressStatus_new");
ALTER TABLE "Milestone" ALTER COLUMN "progress" TYPE "ProgressStatus_new" USING ("progress"::text::"ProgressStatus_new");
ALTER TYPE "ProgressStatus" RENAME TO "ProgressStatus_old";
ALTER TYPE "ProgressStatus_new" RENAME TO "ProgressStatus";
DROP TYPE "ProgressStatus_old";
ALTER TABLE "Task" ALTER COLUMN "progress" SET DEFAULT 'ToDo';
ALTER TABLE "Milestone" ALTER COLUMN "progress" SET DEFAULT 'ToDo';
COMMIT;

-- AlterTable
ALTER TABLE "Milestone" ALTER COLUMN "progress" SET DEFAULT 'ToDo';

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "progress" SET DEFAULT 'ToDo';
