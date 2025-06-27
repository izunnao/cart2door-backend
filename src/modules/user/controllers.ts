import { NextFunction, Request, Response } from "express"
import { createUser } from "./repositories.js"

export const handleRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newUser = await createUser(req.body.email, req.body.password);
        
        res.status(200).json({
            data: newUser,
            message: 'User created successfully',
            isSuccess: true
        })
    } catch (error) {
        next(error)
    }
}