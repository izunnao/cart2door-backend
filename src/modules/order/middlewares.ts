import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
// import { throwErrorOn } from '../../../utils/throwErrorOn';
import { throwErrorOn } from '../../utils/AppError.js';
import { getOrderById } from './repositories.js';

export const addOrdersMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Step 1: Joi validation
        const itemSchema = Joi.object({
            productLink: Joi.string().uri().required(),
            productName: Joi.string().min(1).required(),
            details: Joi.string().allow(''),
            quantity: Joi.number().integer().min(1).default(1),
            price: Joi.number().min(0).required(),
            referenceNumber: Joi.string().allow(''),
            estimatedWeight: Joi.string().allow(''),
            image: Joi.string().uri().default('/placeholder.svg'),
        });

        const schema = Joi.object({
            orderId: Joi.string().uuid().required(),
            items: Joi.array().items(itemSchema).min(1).required(),
        });

        const { error, value } = schema.validate(req.body, { abortEarly: false });

        throwErrorOn(Boolean(error), 400, error?.details?.[0].message || 'Invalid order data');

        // Step 2: Check order existence & status
        const order = await getOrderById(value.orderId);

        if (!order) {
            throwErrorOn(!order, 404, 'Order not found');
        } else {
            throwErrorOn(['shipped', 'delivered'].includes(order.status), 400, `Cannot modify order with status '${order.status}'`);
        }

        // Optionally attach validated data to request
        req.body = value;

        next();
    } catch (err) {
        next(err);
    }
};
