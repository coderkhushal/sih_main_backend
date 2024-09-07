/*
  Warnings:

  - You are about to drop the `Funding` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Funding" DROP CONSTRAINT "Funding_fundingBodyId_fkey";

-- DropForeignKey
ALTER TABLE "Funding" DROP CONSTRAINT "Funding_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Funding" DROP CONSTRAINT "Funding_startupId_fkey";

-- AlterTable
ALTER TABLE "Patent" ALTER COLUMN "applicationDate" DROP DEFAULT;

-- DropTable
DROP TABLE "Funding";

-- CreateTable
CREATE TABLE "Grant" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER,
    "startupId" INTEGER,
    "fundingBodyId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "status" "IPRStatus" NOT NULL,
    "requirements" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "isAssigned" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrantApplication" (
    "id" SERIAL NOT NULL,
    "grantId" INTEGER NOT NULL,
    "startupId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "GrantApplication_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Grant" ADD CONSTRAINT "Grant_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grant" ADD CONSTRAINT "Grant_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grant" ADD CONSTRAINT "Grant_fundingBodyId_fkey" FOREIGN KEY ("fundingBodyId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrantApplication" ADD CONSTRAINT "GrantApplication_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "Grant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrantApplication" ADD CONSTRAINT "GrantApplication_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrantApplication" ADD CONSTRAINT "GrantApplication_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
