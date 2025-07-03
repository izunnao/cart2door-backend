import { NextFunction, Request, Response } from "express";
import { createOrderWithItems, createShippingDetail, getOrders, getUserShippingDetails } from "./repositories.js";
import { throwErrorOn } from "../../utils/AppError.js";
import { getFXRate, getPagination } from "../../utils/general.js";
import { Order } from "@prisma/client";
import { calculatePriceInNairaForItems } from "./services.js";
import { CONFIG_MIN_ORDER_AMOUNT } from "../../config.js";
import { extractOrderCreationShippingDetails } from "./helpers.js";

export const handleAddOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { shippingDetails, items } = req.body;
  let fxRate: unknown;

  try {
    fxRate = await getFXRate() as number

    if (!fxRate) {
      return throwErrorOn(!fxRate, 400, `Couldn't get fxRate`);
    }

    const itemsWithNairaPrice = calculatePriceInNairaForItems(items, fxRate as number);

    const total = itemsWithNairaPrice.reduce((sum, item) => sum + item.priceInNaira * item.quantity, 0);

    if (total < CONFIG_MIN_ORDER_AMOUNT) {
      throwErrorOn(total < CONFIG_MIN_ORDER_AMOUNT, 400, 'Order total must be atleast ₦250,000')
    }

    
    const result = await createOrderWithItems(req.user!.id, itemsWithNairaPrice, extractOrderCreationShippingDetails(shippingDetails))

    res.status(200).json({
      data: result,
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

    let where: Partial<Order> = {  }

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