import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { throwErrorOn } from '../../utils/AppError.js';
import { getOrderById, getShippingDetailsById } from './repositories.js';
import { extractErrorMessage } from '../../utils/error.js';
import { OrderStatus } from '@prisma/client';
import { StatusTransitions } from './utils.js';

export const addOrdersMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    console.log(req.body)

    try {
        // Step 1: Joi Validation
        const itemSchema = Joi.object({
            productLink: Joi.string().uri().required(),
            productName: Joi.string().min(1).required(),
            details: Joi.string().allow(''),
            quantity: Joi.number().integer().min(1).default(1),
            price: Joi.number().min(0).required(),
            referenceNumber: Joi.string().allow(''),
            estimatedWeight: Joi.number(),
            currency: Joi.string().default('GBP'), // optional: if you’ve added this
            priceInNaira: Joi.number().default(0),
        });

        const shippingDetailsSchema = Joi.object({
            fullName: Joi.string().min(2).required(),
            phoneNumber: Joi.string().length(11).required(),
            email: Joi.string().email().required(),
            street: Joi.string().min(3).required(),
            city: Joi.string().min(2).required(),
            state: Joi.string().valid('abuja', 'portharcourt', 'lagos').required()
                .messages({
                    'any.only': 'State must be one of: abuja, portharcourt, or lagos',
                    'string.empty': 'State is required',
                    'any.required': 'State is required'
                }),
        });

        const schema = Joi.object({
            paymentMethod: Joi.string().valid('paystack').required(),
            shippingDetails: shippingDetailsSchema.required(),
            items: Joi.array().items(itemSchema).min(1).required(),
        });

        const { error, value } = schema.validate(req.body, { abortEarly: false });

        throwErrorOn(Boolean(error), 400, error?.details?.[0].message || 'Invalid order data');

        req.body = value

        next();
    } catch (err) {
        console.log('Error add order middleware', extractErrorMessage(err));
        next(err);
    }

};



export const getOrdersMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const schema = Joi.object({
            status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered').optional(),
            limit: Joi.number().integer().min(1).max(100).default(10),
            page: Joi.number().integer().min(1).default(1),
        });

        const { error } = schema.validate(req.query);
        throwErrorOn(Boolean(error), 400, error?.details?.[0].message || 'Invalid query parameters');

        next();
    } catch (err) {
        next(err);
    }
};



export const updateOrderStatusMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const schema = Joi.object({
            status: Joi.string().valid('pending', 'paid', 'confirmed', 'ordered', 'shipped', 'delivered', 'cancelled').required(),
            orderId: Joi.string().uuid().required(),
        });

        console.log(req.body);

        const { error } = schema.validate(req.body);
        throwErrorOn(Boolean(error), 400, error?.details?.[0].message || 'Invalid query parameters');


        const { orderId, status } = req.body;

        // Get current order status
        const order = await getOrderById(orderId)

        if (!order) {
            return throwErrorOn(true, 400, 'Order not found');
        }

        if (!StatusTransitions[order.status as OrderStatus].includes(status as OrderStatus)) {
            return throwErrorOn(true, 400, `Invalid status transition: ${order.status} to ${status}`)
        }
        
        req.order = order;

        next();
    } catch (err) {
        next(err);
    }
};



export const getUserPaymentsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const schema = Joi.object({
            status: Joi.string().valid('pending', 'success', 'failed', 'abandoned').optional(),
            limit: Joi.number().integer().min(1).max(100).default(10),
            page: Joi.number().integer().min(1).default(1),
        });

        const { error } = schema.validate(req.query);
        throwErrorOn(Boolean(error), 400, error?.details?.[0].message || 'Invalid query parameters');

        next();
    } catch (err) {
        next(err);
    }
};




export const addShippingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const schema = Joi.object({
            fullName: Joi.string().min(2).required(),
            phoneNumber: Joi.string().pattern(/^\d+$/).required(),
            email: Joi.string().email().required(),
            street: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            saveAsDefault: Joi.boolean().default(false),
        });

        const { error } = schema.validate(req.body, { abortEarly: false });
        throwErrorOn(Boolean(error), 400, error?.details?.[0].message || 'Invalid shipping details');

        next();
    } catch (err) {
        next(err);
    }
};