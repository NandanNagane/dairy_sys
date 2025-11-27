-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_userId_fkey";

-- DropForeignKey
ALTER TABLE "MilkCollection" DROP CONSTRAINT "MilkCollection_userId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT;

-- AddForeignKey
ALTER TABLE "MilkCollection" ADD CONSTRAINT "MilkCollection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
