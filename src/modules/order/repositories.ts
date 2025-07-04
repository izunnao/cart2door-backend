// src/modules/order/repositories/order.repository.ts
import { Order, OrderItem, OrderStatus, Payment, PaymentStatus, ShippingDetail } from '@prisma/client';
import { prisma } from '../../database/prisma_config.js';
import AppError from '../../utils/AppError.js';
import { initializeTransaction } from '../../utils/paystack.js';
import { extractErrorMessage } from '../../utils/error.js';


export const getOrderById = async (
  orderId: string,
): Promise<Order | null> => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) return null;

    return order;
  } catch (error) {
    // TODO: log the error using logger like Winston or Sentry
    console.error(`getOrderById failed:`, error);
    throw new Error('Failed to retrieve order. Please try again.');
  }
};


interface GetOrdersOptions {
  where?: Partial<Order>;
  limit?: number;
  page?: number;    // 0-indexed
}

export const getOrders = async ({ where = {}, limit = 10, page = 1 }: GetOrdersOptions): Promise<Order[]> => {

  console.log(where, limit, page);

  try {
    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page) * limit,
      include: {
        items: true, // include order items if needed
      },
    });

    return orders;
  } catch (error) {
    throw new AppError(500, 'Failed to retrieve order(s). Please try again.');
  }
};


// Create a new Order
export const createOrder = async (
  userId: string,
  total: number,
  status: Order['status'] = 'pending'
): Promise<Order> => {
  try {
    return await prisma.order.create({
      data: {
        userId,
        total,
        status,
      },
    });
  } catch (error) {
    throw error;
  }
};


export const createOrderPaymentWithItems = async (
  userId: string,
  items: Omit<OrderItem, 'id' | 'orderId' | 'createdAt'>[],
  shippingDetails: Omit<ShippingDetail, 'id' | 'userId' | 'saveAsDefault'>,
  userEmail: string,
): Promise<{
  "authorization_url": string,
  "access_code": string,
  "reference": string
}> => {
  return await prisma.$transaction(async (tx) => {

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Step 1: Create order
    const order = await tx.order.create({
      data: {
        userId,
        total,
        status: 'pending',
        ...shippingDetails
      },
    });

    // Step 2: Create items
    await Promise.all(
      items.map((item) =>
        tx.orderItem.create({
          data: {
            ...item,
            orderId: order.id,
          },
        })
      )
    );

    const paymentInfo = await initializeTransaction(userEmail, total, order.id, 'http://localhost:8080/VerifyPayment')

    console.log('paystack info >>  ', paymentInfo)

    await tx.payment.create({
      data: {
        userId,
        amount: total,
        status: PaymentStatus.pending,
        accessCode: paymentInfo.access_code,
        orderId: order.id,
        reference: paymentInfo.reference,
        currency: 'NGN',
      },
    });

    return paymentInfo
  });
};

// Create a single OrderItem
export const createOrderItems = async (
  orderId: string,
  item: Omit<OrderItem, 'id' | 'createdAt' | 'orderId'>
): Promise<OrderItem> => {
  try {
    return await prisma.orderItem.create({
      data: {
        ...item,
        orderId,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const createShippingDetail = async (userId: string, data: any): Promise<ShippingDetail> => {
  return prisma.shippingDetail.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const getUserShippingDetails = async (userId: string): Promise<ShippingDetail[]> => {
  return prisma.shippingDetail.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};


export const getShippingDetailsById = async (id: string): Promise<ShippingDetail | null> => {
  return prisma.shippingDetail.findUnique({
    where: { id },
  });
};


export const updatePayment = async (reference: string, data: { status: PaymentStatus, gateway_response: string }) => {
  try {
    const updatedPayment = await prisma.payment.update({
      where: { reference },
      data: {
        status: data.status,
        metadata: { gateway_response: data.gateway_response }
      }
    });

    return {
      success: true,
      data: updatedPayment,
      message: 'Payment updated successfully'
    };
  } catch (error) {
    console.error('Error updating payment:', error);
  }
};

export const updatePaymentAndOrder = async (order: { id: string, status: OrderStatus }, payment: { reference: string, status: PaymentStatus, gateway_response: string }) => {
  try {
    return await prisma.$transaction(async (tx) => {

      await tx.order.update({
        where: { id: order.id },
        data: { status: order.status }
      })

      await tx.payment.update({
        where: { reference: payment.reference },
        data: {
          status: payment.status,
          metadata: { gateway_response: payment.gateway_response }
        }
      });


    })
  } catch (error) {
    console.log('Transaction error: ', extractErrorMessage(error));
  }
}
