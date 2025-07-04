import { NextFunction, Request, Response } from "express";
import { createOrderPaymentWithItems, createShippingDetail, getOrders, getUserShippingDetails, updatePayment, updatePaymentAndOrder } from "./repositories.js";
import { throwErrorOn } from "../../utils/AppError.js";
import { getPublicFXRate, getPagination, calcInternalFXRate } from "../../utils/general.js";
import { Order, OrderStatus } from "@prisma/client";
import { calculatePriceInNairaForItems } from "./services.js";
import { CONFIG_MIN_ORDER_AMOUNT } from "../../config.js";
import { extractOrderCreationShippingDetails } from "./helpers.js";
import { getInternalPaymentStatus, verifyTransaction } from "../../utils/paystack.js";

export const handleAddOrder = async (req: Request, res: Response, next: NextFunction) => {

  const { shippingDetails, items } = req.body;
  let publicFXRate: unknown;

  try {
    publicFXRate = await getPublicFXRate() as number


    console.log(publicFXRate);

    if (!publicFXRate) {
      return throwErrorOn(!publicFXRate, 400, `Couldn't get fxRate`);
    }

    const internalFXRate = calcInternalFXRate(publicFXRate as number)

    const itemsWithNairaPrice = calculatePriceInNairaForItems(items, internalFXRate);

    const total = itemsWithNairaPrice.reduce((sum, item) => sum + item.priceInNaira * item.quantity, 0);

    console.log('total price >>  ', total);

    if (total < CONFIG_MIN_ORDER_AMOUNT) {
      throwErrorOn(total < CONFIG_MIN_ORDER_AMOUNT, 400, 'Order total must be atleast ₦250,000')
    }

    const paymentInfo = await createOrderPaymentWithItems(req.user!.id, itemsWithNairaPrice, extractOrderCreationShippingDetails(shippingDetails), req.user!.email)

    res.status(200).json({
      data: paymentInfo,
      isSuccess: true,
      message: 'Order created successfully'
    })
  } catch (err) {
    next(err)
  }
}



export const handleGetOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const { status } = req.query
    const { limit, page } = getPagination(req?.query?.limit, req?.query?.page)

    const mainStatus = status as unknown as 'pending' | 'ordered' | 'shipped' | 'delivered'

    let where: Partial<Order> = { userId }

    if (status) {
      where.status = mainStatus
    }


    const orders = await getOrders({ where, limit: limit, page: page });

    res.status(200).json({
      data: orders,
      isSuccess: true,
      message: 'Orders retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};


export const handleGetOrdersForAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query
    const { limit, page } = getPagination(req?.query?.limit, req?.query?.page)

    const mainStatus = status as unknown as 'pending' | 'ordered' | 'shipped' | 'delivered'

    let where: Partial<Order> = {}

    if (status) {
      where.status = mainStatus
    }


    const orders = await getOrders({ where, limit: limit, page: page });

    res.status(200).json({
      data: orders,
      isSuccess: true,
      message: 'Orders retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};




export const handleAddShipping = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const shippingDetail = await createShippingDetail(req.user!.id, req.body);

    res.status(201).json({
      data: shippingDetail,
      isSuccess: true,
      message: 'Shipping detail created successfully',
    });
  } catch (err) {
    next(err);
  }
};



export const handleGetShipping = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const shipping = await getUserShippingDetails(userId);

    res.status(200).json({
      data: shipping,
      isSuccess: true,
      message: 'Shipping details retrieved',
    });
  } catch (err) {
    next(err);
  }
};


export const handleVerifyPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Get transaction reference from query params
    const { reference } = req.query as { reference: string };

    if (!reference) {
      return throwErrorOn(true, 400, 'Transaction reference is required')
    }

    // 2. Verify the transaction with Paystack
    const verificationResponse = await verifyTransaction(reference as string);

    // 3. Handle the verification response
    if (!verificationResponse.status) {
      throwErrorOn(true, 400, 'Payment verification failed')
    }

    const internalPaymentStatus = getInternalPaymentStatus(verificationResponse.status)

    // update payment status
    // await updatePayment(reference, { status: internalPaymentStatus, gateway_response: verificationResponse.gateway_response })

    let orderStatus: OrderStatus = 'pending';

    if (internalPaymentStatus === 'success') {
      orderStatus = 'paid'
    }

    if (internalPaymentStatus === 'pending') {
      orderStatus = 'pending'
    }

    if (internalPaymentStatus === 'failed') {
      orderStatus = 'pending'
    }

    if (internalPaymentStatus === 'abandoned') {
      orderStatus = 'pending'
    }

    updatePaymentAndOrder({ id: '', status: orderStatus }, {reference, status: internalPaymentStatus, gateway_response: verificationResponse.gateway_response})


    // 4. Return successful verification response
    res.status(200).json({
      isSuccess: true,
      message: 'Payment verified successfully',
    });

  } catch (err) {
    next(err)
  }
};