// src/modules/order/repositories/order.repository.ts
import { Order, OrderItem, ShippingDetail } from '@prisma/client';
import { prisma } from '../../database/prisma_config.js';
import AppError from '../../utils/AppError.js';


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


export const createOrderWithItems = async (
  userId: string,
  items: Omit<OrderItem, 'id' | 'orderId' | 'createdAt'>[],
  shippingDetails: Omit<ShippingDetail, 'userId' | 'saveAsDefault'>
): Promise<{ order: Order, items: OrderItem[] }> => {
  return await prisma.$transaction(async (tx) => {
    // Step 1: Create order
    const order = await tx.order.create({
      data: {
        userId,
        total: 0, // will be updated later
        status: 'pending',
        ...shippingDetails
      },
    });

    // Step 2: Create items
    const orderItems = await Promise.all(
      items.map((item) =>
        tx.orderItem.create({
          data: {
            ...item,
            orderId: order.id,
          },
        })
      )
    );

    // Step 3: Update total
    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const updatedOrder = await tx.order.update({
      where: { id: order.id },
      data: { total },
    });

    return {
      order: updatedOrder,
      items: orderItems,
    };
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