/*
  Warnings:

  - You are about to drop the column `read` on the `MeetingRequst` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MeetingRequst" DROP COLUMN "read";

-- CreateTable
CREATE TABLE "Investmentoffer" (
    "id" SERIAL NOT NULL,
    "investorId" INTEGER NOT NULL,
    "startupId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "equity" DOUBLE PRECISION NOT NULL,
    "status" "IPRStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Investmentoffer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Investmentoffer" ADD CONSTRAINT "Investmentoffer_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "Investor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investmentoffer" ADD CONSTRAINT "Investmentoffer_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
