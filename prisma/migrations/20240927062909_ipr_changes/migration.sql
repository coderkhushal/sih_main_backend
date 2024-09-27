/*
  Warnings:

  - You are about to drop the column `type` on the `IPR` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `IPR` table. All the data in the column will be lost.
  - You are about to drop the `Patent` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[patentNumber]` on the table `IPR` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `IPRType` to the `IPR` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `IPR` table without a default value. This is not possible if the table is not empty.
  - The required column `patentNumber` was added to the `IPR` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `pdfPath` to the `IPR` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "IPR" DROP CONSTRAINT "IPR_userId_fkey";

-- DropForeignKey
ALTER TABLE "Patent" DROP CONSTRAINT "Patent_startupId_fkey";

-- AlterTable
ALTER TABLE "IPR" DROP COLUMN "type",
DROP COLUMN "userId",
ADD COLUMN     "IPRType" "IPRType" NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "patentNumber" TEXT NOT NULL,
ADD COLUMN     "pdfPath" TEXT NOT NULL,
ADD COLUMN     "projectId" INTEGER,
ADD COLUMN     "startupId" INTEGER,
ALTER COLUMN "applicationDate" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Patent";

-- CreateTable
CREATE TABLE "StartupRounds" (
    "id" SERIAL NOT NULL,
    "startupId" INTEGER NOT NULL,
    "round_name" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "valuation" DOUBLE PRECISION NOT NULL,
    "investors" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "equity" DOUBLE PRECISION NOT NULL
);

-- CreateTable
CREATE TABLE "IPR_PROFESSIONAL" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IPR_PROFESSIONAL_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_IPRToIPR_PROFESSIONAL" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "StartupRounds_id_key" ON "StartupRounds"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_IPRToIPR_PROFESSIONAL_AB_unique" ON "_IPRToIPR_PROFESSIONAL"("A", "B");

-- CreateIndex
CREATE INDEX "_IPRToIPR_PROFESSIONAL_B_index" ON "_IPRToIPR_PROFESSIONAL"("B");

-- CreateIndex
CREATE UNIQUE INDEX "IPR_patentNumber_key" ON "IPR"("patentNumber");

-- AddForeignKey
ALTER TABLE "IPR" ADD CONSTRAINT "IPR_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IPR" ADD CONSTRAINT "IPR_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StartupRounds" ADD CONSTRAINT "StartupRounds_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IPR_PROFESSIONAL" ADD CONSTRAINT "IPR_PROFESSIONAL_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IPRToIPR_PROFESSIONAL" ADD CONSTRAINT "_IPRToIPR_PROFESSIONAL_A_fkey" FOREIGN KEY ("A") REFERENCES "IPR"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IPRToIPR_PROFESSIONAL" ADD CONSTRAINT "_IPRToIPR_PROFESSIONAL_B_fkey" FOREIGN KEY ("B") REFERENCES "IPR_PROFESSIONAL"("id") ON DELETE CASCADE ON UPDATE CASCADE;
