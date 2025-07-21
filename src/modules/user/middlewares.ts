import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { throwErrorOn } from '../../utils/AppError.js';


export const registerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const registerSchema = Joi.object({
            firstName: Joi.string().min(2).max(50).required(),
            lastName: Joi.string().min(2).max(50).required(),
            email: Joi.string().email().required(),
            phone: Joi.string()
                .pattern(/^\d+$/)
                .length(11)
                .required()
                .messages({
                    'string.pattern.base': 'Phone must contain only 11 digits',
                }),
            password: Joi.string().min(6).required(),
            role: Joi.string().valid('admin', 'customer').required(),
            confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
                'any.only': 'Passwords do not match',
            }),
        });

        throwErrorOn(!req.body, 400, 'You need to pass a payload')

        const { error } = registerSchema.validate(req.body);

        throwErrorOn(Boolean(error), 400, error?.details?.[0].message || "")

        next();
    } catch (error) {
        next(error);
    }
};




export const loginMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
        });

        const { error } = loginSchema.validate(req.body, { abortEarly: false });

        throwErrorOn(Boolean(error), 400, error?.details?.[0].message || 'Invalid login credentials');

        next();
    } catch (error) {
        next(error);
    }
};