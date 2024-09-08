/*
  Warnings:

  - You are about to drop the column `startupName` on the `MeetingRequst` table. All the data in the column will be lost.
  - Added the required column `duration` to the `MeetingRequst` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MeetingRequst" DROP COLUMN "startupName",
ADD COLUMN     "duration" INTEGER NOT NULL;
