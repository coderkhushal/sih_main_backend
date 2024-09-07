/*
  Warnings:

  - You are about to drop the column `profit` on the `Metrics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Metrics" DROP COLUMN "profit",
ADD COLUMN     "conversion_rate" DOUBLE PRECISION,
ADD COLUMN     "employees_equity" INTEGER,
ADD COLUMN     "founders_equity" INTEGER,
ADD COLUMN     "gross_margin" DOUBLE PRECISION,
ADD COLUMN     "gross_profit" DOUBLE PRECISION,
ADD COLUMN     "investors_equity" INTEGER,
ADD COLUMN     "itv_cac_ratio" DOUBLE PRECISION,
ADD COLUMN     "mrr_growth" DOUBLE PRECISION,
ADD COLUMN     "net_profit" DOUBLE PRECISION,
ADD COLUMN     "nps_score" DOUBLE PRECISION,
ADD COLUMN     "retention_rate" DOUBLE PRECISION,
ALTER COLUMN "expenses" DROP NOT NULL,
ALTER COLUMN "revenue" DROP NOT NULL,
ALTER COLUMN "valuation" DROP NOT NULL;
