/*
  Warnings:

  - Added the required column `expenses` to the `Metrics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profit` to the `Metrics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `revenue` to the `Metrics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valuation` to the `Metrics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Metrics" ADD COLUMN     "churnRate" DOUBLE PRECISION,
ADD COLUMN     "customers" INTEGER,
ADD COLUMN     "employees" INTEGER,
ADD COLUMN     "expenses" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "profit" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "revenue" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "valuation" DOUBLE PRECISION NOT NULL;
