import { NextFunction, Request, Response } from "express";
import { createOrderWithItems, createShippingDetail, getOrders, getUserShippingDetails } from "./repositories.js";
import { throwErrorOn } from "../../utils/AppError.js";
import { getPagination } from "../../utils/general.js";
import { Order } from "@prisma/client";
import { calculatePriceInNairaForItems } from "./services.js";

export const handleAddOrder = async (req: Request, res: Response, next: NextFunction) => {
    const {shippingDetails, items} = req.body;

    try {
        const itemsWithNairaPrice = calculatePriceInNairaForItems(items)

        const result = await createOrderWithItems(req.user!.id, itemsWithNairaPrice, shippingDetails)

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
    const {limit, page} = getPagination(req?.query?.limit, req?.query?.page)

    const mainStatus = status as unknown as 'pending' | 'ordered' | 'shipped' | 'delivered'

    let where: Partial<Order> = {userId}

    if(status){
        where.status = mainStatus
    }

    
    const orders = await getOrders({where, limit: limit, page: page});

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