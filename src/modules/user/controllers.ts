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

        const newUser = await createUser({ ...req.body, password: encryptedPassword, otp: regOtp });

        sendMail({
            to: newUser.email,
            payload: templatePayloads.registrationSuccess({ name: newUser.firstName, otp: regOtp }),
            context: 'registrationSuccess',
            subject: 'Registration Success',
        })

        const {password, otp, ...restUserData} = newUser // exclude password and otp from response
        res.status(200).json({
            data: restUserData,
            message: 'User created successfully, check mail for otp',
            isSuccess: true
        })
    } catch (error) {
        next(error)
    }
}



export const handleVerifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        
        updateUser(user.id, {
            ...user,
            otp: '',
            isEmailVerified: true
        })

        sendMail({
            to: user.email,
            payload: templatePayloads.verifyOtpSucess({ firstName: user.firstName }),
            context: 'verifyOtpSucess',
            subject: 'OTP Verification Success',
        })

        const token = generateToken(
            { id: user.id, email: user.email },
            '7d',
        );

        const {password, otp, ...restUserData} = user // exclude password and otp from response
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

        // const isMatch = await bcrypt.compare(password, user.password);
        const isMatch = comparePasswords(password, user.password);
        throwErrorOn(!isMatch, 400, 'Invalid email or password');

        const token = generateToken(
            { id: user.id, email: user.email },
            '7d',
        );


        const {password: userPassword, otp, ...restUserData} = user // exclude password and otp from response
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