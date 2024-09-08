/*
  Warnings:

  - You are about to drop the column `startupName` on the `Meeting` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Meeting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "startupName",
ADD COLUMN     "duration" INTEGER NOT NULL;
