/*
  Warnings:

  - Added the required column `remarks` to the `Investmentoffer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Investmentoffer" ADD COLUMN     "remarks" TEXT NOT NULL;
