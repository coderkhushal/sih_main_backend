-- DropForeignKey
ALTER TABLE "GrantApplication" DROP CONSTRAINT "GrantApplication_projectId_fkey";

-- DropForeignKey
ALTER TABLE "GrantApplication" DROP CONSTRAINT "GrantApplication_startupId_fkey";

-- AlterTable
ALTER TABLE "GrantApplication" ALTER COLUMN "startupId" DROP NOT NULL,
ALTER COLUMN "projectId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "GrantApplication" ADD CONSTRAINT "GrantApplication_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrantApplication" ADD CONSTRAINT "GrantApplication_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
