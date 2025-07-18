import { NextFunction, Request, Response } from "express"
import { createUser, getUserByEmail } from "./repositories.js"
import { throwErrorOn } from "../../utils/AppError.js";
import { generateToken } from "../../utils/auth.js";
import { sendMail } from "../../notification/services.js";
import { templatePayloads } from "../../notification/utils/payload.temp.notification.js";
import { comparePasswords, hashPassword } from "./utils.js";

export const handleRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        delete req.body.confirmPassword;

        const encryptedPassword = await hashPassword(req.body.password)

        const newUser = await createUser({ ...req.body, password: encryptedPassword });

        console.log(newUser);

        sendMail({
            to: newUser.email,
            payload: templatePayloads.registrationSuccess({ name: newUser.firstName, id: newUser.id, verificationLink: '' }),
            context: 'registrationSuccess',
            subject: 'Registration Success',
        })

        res.status(200).json({
            data: newUser,
            message: 'User created successfully',
            isSuccess: true
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

        // const isMatch = await bcrypt.compare(password, user.password);
        const isMatch = comparePasswords(password, user.password)   ;
        throwErrorOn(!isMatch, 400, 'Invalid email or password');

        const token = generateToken(
            { id: user.id, email: user.email },
            '7d',
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 3600 * 1000
        })
            .status(200).json({
                data: { user, token },
                message: 'Login successful',
                isSuccess: true,
            });
    } catch (error) {
        next(error);
    }
};