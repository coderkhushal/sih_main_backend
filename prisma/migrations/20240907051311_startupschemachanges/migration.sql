/*
  Warnings:

  - Added the required column `location` to the `Startup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Startup" ADD COLUMN     "location" TEXT NOT NULL;
