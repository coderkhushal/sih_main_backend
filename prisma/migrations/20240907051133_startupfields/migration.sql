/*
  Warnings:

  - Added the required column `foundedAt` to the `Startup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `industry` to the `Startup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamSize` to the `Startup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Startup" ADD COLUMN     "foundedAt" TEXT NOT NULL,
ADD COLUMN     "industry" TEXT NOT NULL,
ADD COLUMN     "teamSize" INTEGER NOT NULL,
ADD COLUMN     "website" TEXT;
