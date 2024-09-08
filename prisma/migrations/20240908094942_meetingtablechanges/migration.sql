/*
  Warnings:

  - A unique constraint covering the columns `[meetingRequestId]` on the table `Meeting` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `meetingRequestId` to the `Meeting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN     "meetingRequestId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "MeetingRequst" ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Meeting_meetingRequestId_key" ON "Meeting"("meetingRequestId");

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_meetingRequestId_fkey" FOREIGN KEY ("meetingRequestId") REFERENCES "MeetingRequst"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
