/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `Job` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Job_type_key" ON "Job"("type");
