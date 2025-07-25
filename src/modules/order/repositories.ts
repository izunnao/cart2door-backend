import { Order, OrderItem, OrderStatus, Payment, PaymentStatus, Prisma, ShippingDetail, User } from '@prisma/client';
import { prisma } from '../../database/prisma_config.js';
import AppError, { throwErrorOn } from '../../utils/AppError.js';
import { initializeTransaction } from '../../utils/paystack.js';
import { extractErrorMessage } from '../../utils/error.js';
import { calcOrderSummary } from '../../utils/pricing.js';
import { calcResponsePagination } from '../../utils/general.js';
import { PaginationI } from '../../types/general.types.js';


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

export const getOrders = async ({ where = {}, limit = 10, page = 0 }: GetOrdersOptions): Promise<{ orders: Order[], pagination: PaginationI }> => {
  try {
    const skip = (page) * limit
    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
      include: {
        items: true, // include order items if needed
      },
    });

    const totalOrders = await prisma.order.count({
      where
    });


    return {
      orders,
      pagination: calcResponsePagination(totalOrders, limit, page)
    }
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
  { user, userId, userEmail, items, shippingDetails, internalFXRate }
    :
    {
      user: User,
      userId: string,
      userEmail: string,
      items: Omit<OrderItem, 'id' | 'orderId' | 'createdAt'>[],
      shippingDetails: Omit<ShippingDetail, 'id' | 'userId' | 'saveAsDefault'>,
      internalFXRate: number
    },
): Promise<{
  paymentInfo: {
    "authorization_url": string,
    "access_code": string,
    "reference": string
  },
  order: Order,
  items: Omit<OrderItem, 'id' | 'orderId' | 'createdAt'>[]
}> => {
  return await prisma.$transaction(async (tx) => {

    const subTotalGBP = items.reduce((sum, item) => sum + item.price * item.quantity, 0); // total in GBP

    const { totalNGN, subtotalNGN, vat, customsDuty, deliveryFeeNGN, handlingFeeNGN } = calcOrderSummary(subTotalGBP, internalFXRate, shippingDetails.state);

    const {createdAt, updatedAt, ...otherShippingDetails} = shippingDetails;


    console.log('this shipping info >> ', shippingDetails);

    const userLatestOrderNumber = user.lastOrderNumber + 1;
    // Step 1: Create order
    const order = await tx.order.create({
      data: {
        userId: user.id,
        userEmail: user.email,
        total: subTotalGBP,
        totalNaira: totalNGN,
        subTotalNaira: subtotalNGN,
        subTotal: subTotalGBP,
        handlingFee: handlingFeeNGN,
        deliveryFee: deliveryFeeNGN,
        customFee: customsDuty,
        orderNumber: userLatestOrderNumber,
        vat: vat,
        status: 'pending',
        ...otherShippingDetails
      },
    });

    await tx.user.update({ where: { id: user.id }, data: { lastOrderNumber: userLatestOrderNumber } })


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


    console.log('totalPayable  :: ', totalNGN, '      total GBP :: ', subTotalGBP, '      internal fx rate :: ', internalFXRate)


    const paymentInfo = await initializeTransaction(userEmail, totalNGN, 'http://localhost:8080/verify-payment', order.id) // order id is collected and used from metadata in transaction verification

    await tx.payment.create({
      data: {
        userId,
        userEmail,
        amount: totalNGN,
        amountInGBP: subTotalGBP,
        status: PaymentStatus.pending,
        accessCode: paymentInfo.access_code,
        orderId: order.id,
        reference: paymentInfo.reference,
        currency: 'NGN',
        orderNumber: userLatestOrderNumber
      },
    });
    console.log('paystack info >>  ', paymentInfo)


    return { order, items, paymentInfo }
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


export const updateOrder = async (where: Prisma.OrderWhereUniqueInput, data: Partial<Order>): Promise<Order | undefined> => {
  try {
    const updatedOrder = await prisma.order.update({
      where: where, // the type issue is here
      data,
    })

    return updatedOrder
  } catch (error) {
    throwErrorOn(true, 500, extractErrorMessage(error))
  }
}


interface GetUserPaymentsParams {
  userId: string;
  options?: {
    limit?: number;
    page?: number;
    orderBy?: 'asc' | 'desc';
    status?: PaymentStatus;
  };
}

export const getUserPayments = async ({ userId, options }: GetUserPaymentsParams): Promise<{ payments: Payment[], pagination: PaginationI }> => {
  try {
    const { limit = 10, page = 0, orderBy = 'desc', status } = options || {};

    const payments = await prisma.payment.findMany({
      where: {
        userId,
        ...(status && { status }),
      },
      take: limit,
      skip: (page) * limit,
      orderBy: {
        createdAt: orderBy,
      }
    });

    const totalPayments = await prisma.payment.count({
      where: {
        userId,
        ...(status && { status }),
      },
    });

    return {
      payments,
      pagination: calcResponsePagination(totalPayments, limit, page)
    };
  } catch (error) {
    throw error
  }
};



export const getPayments = async (options: GetUserPaymentsParams['options'], userId?: string): Promise<{ payments: Payment[], pagination: PaginationI }> => {
  try {
    const { limit = 10, page = 0, orderBy = 'desc', status } = options || {};

    const payments = await prisma.payment.findMany({
      where: {
        ...(status && { status }),
      },
      include: {
        ...(userId && { user: true })
      },
      take: limit,
      skip: (page) * limit,
      orderBy: {
        createdAt: orderBy,
      },
    });

    const totalPayments = await prisma.payment.count({
      where: {
        ...(status && { status }),
      },
    });

    return {
      payments,
      pagination: calcResponsePagination(totalPayments, limit, page)
    };
  } catch (error) {
    throw error
  }
};