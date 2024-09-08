/*
  Warnings:

  - Added the required column `pitch` to the `GrantApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GrantApplication" ADD COLUMN     "pitch" TEXT NOT NULL;
