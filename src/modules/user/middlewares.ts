import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { throwErrorOn } from '../../utils/AppError.js';


export const registerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const registerSchema = Joi.object({
            name: Joi.string().min(2).max(50).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
                'any.only': 'Passwords do not match',
            }),
        });
        const { error } = registerSchema.validate(req.body, { abortEarly: false });

        throwErrorOn(Boolean(error), 400, error?.details?.[0].message || "")

        next();
    } catch (error) {
        next(error);
    }
};
