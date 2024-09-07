/*
  Warnings:

  - The values [POLICY_MAKER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('RESEARCHER', 'INNOVATOR', 'ENTREPRENEUR', 'GOVERNMENT', 'INVESTOR', 'IPR_PROFESSIONAL');
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- AlterTable
ALTER TABLE "Patent" ALTER COLUMN "applicationDate" SET DEFAULT CURRENT_TIMESTAMP;
