import { NextFunction, Request, Response } from "express"
import { createUser, getUserByEmail } from "./repositories.js"
import { throwErrorOn } from "../../utils/AppError.js";
import { generateToken } from "../../utils/auth.js";

export const handleRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        delete req.body.confirmPassword;
        const newUser = await createUser(req.body);

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
            throwErrorOn(!user, 401, 'Invalid email or password');
            return;
        }

        // const isMatch = await bcrypt.compare(password, user.password);
        const isMatch = password === user.password;
        throwErrorOn(!isMatch, 401, 'Invalid email or password');

        const token = generateToken(
            { id: user.id, email: user.email },
            '7d',
        );

        res
        .cookie('token', token, {
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