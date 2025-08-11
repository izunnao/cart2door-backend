import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { throwErrorOn } from '../../utils/AppError.js';
import { getUserByEmail, getUserByOtpAndEmail } from './repositories.js';
import { comparePasswords } from './utils.js';


export const registerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
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
            role: Joi.string().valid('customer').required(),
            confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
                'any.only': 'Passwords do not match',
            }),
        });

        throwErrorOn(!req.body, 400, 'You need to pass a payload')

        const { error } = registerSchema.validate(req.body);

        throwErrorOn(Boolean(error), 400, error?.details?.[0].message || "")


        // check if user not exist with email with prisma, use the throwErrorOn util function
        const existingUser = await getUserByEmail(req.body.email)

        throwErrorOn(Boolean(existingUser), 409, 'User already exists with this email');

        next();
    } catch (error) {
        next(error);
    }
};


export const changePasswordMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;

        const registerSchema = Joi.object({
            currentPassword: Joi.string().min(6).required(),
            newPassword: Joi.string().min(6).required(),
            confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
                'any.only': 'Passwords do not match',
            }),
        });

        throwErrorOn(!req.body, 400, 'You need to pass a payload')

        const { error } = registerSchema.validate(req.body);

        throwErrorOn(Boolean(error), 400, error?.details?.[0].message || "")

        const isMatch = await comparePasswords(req.body.currentPassword, user.password);
        throwErrorOn(!isMatch, 400, 'Current password is incorrect');

        next();
    } catch (error) {
        next(error);
    }
};


export const verifyOtpMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    try {

        console.log('email', req.body.email, 'pass', req.body.otp);

        const otpSchema = Joi.object({
            email: Joi.string().email().required(),
            otp: Joi.string()
                .length(4)
                .pattern(/^\d+$/)
                .required()
                .messages({
                    'string.length': 'OTP must be exactly 4 digits',
                    'string.pattern.base': 'OTP must contain only digits',
                })
        })

        throwErrorOn(!req.body, 400, 'You need to pass a payload')

        const { error } = otpSchema.validate(req.body);

        throwErrorOn(Boolean(error), 400, error?.details?.[0].message || "")


        const existingUser = await getUserByEmail(req.body.email)

        throwErrorOn(!Boolean(existingUser), 409, 'User with this email does not exist');

        req.user = existingUser;

        console.log(existingUser);

        next()
    } catch (error) {
        next(error)
    }
}




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


export const googleSignInMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {

        const { credential } = req.body; // frontend sends Google ID token

        if (!credential) {
            throwErrorOn(true, 400, 'Invalid google ID token');
        }

        next();
    } catch (error) {
        next(error);
    }
};