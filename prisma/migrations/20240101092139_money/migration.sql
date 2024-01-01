-- CreateTable
CREATE TABLE "Money" (
    "id" SERIAL NOT NULL,
    "balance" INTEGER NOT NULL,

    CONSTRAINT "Money_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Money_id_key" ON "Money"("id");
