import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { throwErrorOn } from '../../utils/AppError.js';
import { getShippingDetailsById } from './repositories.js';
import { extractErrorMessage } from '../../utils/error.js';

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
            estimatedWeight: Joi.string().allow(''),
            image: Joi.string().optional().uri().default('/placeholder.svg'),
            currency: Joi.string().default('USD'), // optional: if you’ve added this
            priceInNaira: Joi.number().default(0),
        });

        const shippingDetailsSchema = Joi.object({
            fullName: Joi.string().min(2).required(),
            phoneNumber: Joi.string().length(11).required(),
            email: Joi.string().email().required(),
            street: Joi.string().min(3).required(),
            city: Joi.string().min(2).required(),
            state: Joi.string().min(2).required(),
            postalCode: Joi.string().min(3).required(),
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




export const addShippingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const schema = Joi.object({
            fullName: Joi.string().min(2).required(),
            phoneNumber: Joi.string().pattern(/^\d+$/).required(),
            email: Joi.string().email().required(),
            street: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            postalCode: Joi.string().required(),
            saveAsDefault: Joi.boolean().default(false),
        });

        const { error } = schema.validate(req.body, { abortEarly: false });
        throwErrorOn(Boolean(error), 400, error?.details?.[0].message || 'Invalid shipping details');

        next();
    } catch (err) {
        next(err);
    }
};