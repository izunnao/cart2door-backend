// src/modules/order/repositories/order.repository.ts
import { Order,  } from '@prisma/client';
import { prisma } from '../../database/prisma_config.js';
import { OrderItemI } from './types.js';


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

// Create a single OrderItem
export const createOrderItem = async (
  orderId: string,
  item: Omit<OrderItemI, 'id' | 'createdAt' | 'orderId'>
): Promise<OrderItemI> => {
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
