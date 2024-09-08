/*
  Warnings:

  - Added the required column `remarks` to the `MeetingRequst` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MeetingRequst" ADD COLUMN     "remarks" TEXT NOT NULL;
