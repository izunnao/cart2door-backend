-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "city" TEXT NOT NULL DEFAULT 'n/a',
ADD COLUMN     "email" TEXT NOT NULL DEFAULT 'n/a',
ADD COLUMN     "fullName" TEXT NOT NULL DEFAULT 'n/a',
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'paystack',
ADD COLUMN     "phoneNumber" TEXT NOT NULL DEFAULT 'n/a',
ADD COLUMN     "postalCode" TEXT NOT NULL DEFAULT 'n/a',
ADD COLUMN     "state" TEXT NOT NULL DEFAULT 'n/a',
ADD COLUMN     "street" TEXT NOT NULL DEFAULT 'n/a',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
