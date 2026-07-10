-- AlterEnum
ALTER TYPE "AuditStatus" ADD VALUE 'BLOCKED';

-- DropForeignKey
ALTER TABLE "Audit" DROP CONSTRAINT "Audit_userId_fkey";

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
