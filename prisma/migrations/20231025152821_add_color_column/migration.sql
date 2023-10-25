-- AlterTable
ALTER TABLE "Memo" ALTER COLUMN "color" SET DEFAULT 'gray';

-- AlterTable
ALTER TABLE "Milestone" ADD COLUMN     "color" TEXT DEFAULT 'gray';

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "color" TEXT DEFAULT 'gray';
