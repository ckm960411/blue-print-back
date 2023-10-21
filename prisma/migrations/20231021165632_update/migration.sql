-- AlterTable
ALTER TABLE "Milestone" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "title" SET DEFAULT '마일스톤 이름',
ALTER COLUMN "unicode" DROP NOT NULL,
ALTER COLUMN "classification" DROP NOT NULL,
ALTER COLUMN "isBookmarked" SET DEFAULT false;
