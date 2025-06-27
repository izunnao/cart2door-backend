-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "productLink" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "referenceNumber" TEXT NOT NULL,
    "estimatedWeight" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '/placeholder.svg',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderId" TEXT,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
