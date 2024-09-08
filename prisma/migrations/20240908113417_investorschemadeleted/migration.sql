/*
  Warnings:

  - You are about to drop the `Investor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Investment" DROP CONSTRAINT "Investment_investorId_fkey";

-- DropForeignKey
ALTER TABLE "Investmentoffer" DROP CONSTRAINT "Investmentoffer_investorId_fkey";

-- DropForeignKey
ALTER TABLE "Investor" DROP CONSTRAINT "Investor_userId_fkey";

-- DropForeignKey
ALTER TABLE "Meeting" DROP CONSTRAINT "Meeting_investorId_fkey";

-- DropForeignKey
ALTER TABLE "MeetingRequst" DROP CONSTRAINT "MeetingRequst_investorId_fkey";

-- DropTable
DROP TABLE "Investor";

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingRequst" ADD CONSTRAINT "MeetingRequst_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investmentoffer" ADD CONSTRAINT "Investmentoffer_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
