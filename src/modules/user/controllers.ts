import { NextFunction, Request, Response } from "express"
import { createUser, getUserByEmail, updateUser } from "./repositories.js"
import { throwErrorOn } from "../../utils/AppError.js";
import { generateToken } from "../../utils/auth.js";
import { sendMail } from "../../notification/services.js";
import { templatePayloads } from "../../notification/utils/payload.temp.notification.js";
import { comparePasswords, hashPassword } from "./utils.js";
import { generateOtp } from "../../utils/general.js";

export const handleRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        delete req.body.confirmPassword;

        const encryptedPassword = await hashPassword(req.body.password)

        const regOtp = generateOtp();

        const newUser = await createUser({
            ...req.body,
            password: encryptedPassword,
            otp: regOtp,
            otpExpireAt: new Date(Date.now() + 10 * 60 * 1000) // 10 mins from now
        });

        const { password, otp, ...restUserData } = newUser // exclude password and otp from response
        res.status(200).json({
            data: restUserData,
            message: 'User created successfully, check mail for otp',
            isSuccess: true
        })

        sendMail({
            to: newUser.email,
            payload: templatePayloads.registrationSuccess({ name: newUser.firstName, otp: regOtp }),
            context: 'registrationSuccess',
            subject: 'Registration Success',
        })
    } catch (error) {
        next(error)
    }
}



export const handleVerifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;

        if (user?.otp !== req.body.otp) {
            return throwErrorOn(true, 409, 'OTP is invalid');
        }

        if (!user.otpExpireAt || new Date() > new Date(user.otpExpireAt!)) {
            return throwErrorOn(true, 409, 'OTP has expired');
        }

        await updateUser(user.id, {
            ...user,
            otp: '',
            otpExpireAt: null,
            isEmailVerified: true
        })

        const token = generateToken(
            { id: user.id, email: user.email },
            '7d',
        );

        const { password, otp, ...restUserData } = user // exclude password and otp from response
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        }).status(200).json({
            data: restUserData,
            message: 'OTP Verified successfully',
            isSuccess: true,
        });

        await sendMail({
            to: user.email,
            payload: templatePayloads.verifyOtpSucess({ firstName: user.firstName }),
            context: 'verifyOtpSucess',
            subject: 'OTP Verification Success',
        })
    } catch (error) {
        next(error)
    }
}



export const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        console.log(email, password);

        const user = await getUserByEmail(email);

        if (!user) {
            throwErrorOn(!user, 400, 'Invalid email or password');
            return;
        }

        const isMatch = comparePasswords(password, user.password);
        throwErrorOn(!isMatch, 400, 'Invalid email or password');

        if (!user.isEmailVerified) {
            const otp = generateOtp()

            await updateUser(user.id, {
                ...user,
                otp,
                otpExpireAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins from now,
            })

            await sendMail({
                to: user.email,
                context: 'otpVerification',
                payload: templatePayloads.otpVerification({ firstName: user.firstName, otp: otp }),
                subject: 'OTP Verification Code'
            })

            return throwErrorOn(true, 400, 'Email not verified, check mail for verification code');
        }

        const token = generateToken(
            { id: user.id, email: user.email },
            '7d',
        );


        const { password: userPassword, otp, ...restUserData } = user // exclude password and otp from response
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        })
            .status(200).json({
                data: restUserData,
                message: 'Login successful',
                isSuccess: true,
            });
    } catch (error) {
        next(error);
    }
};