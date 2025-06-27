import { Router } from "express";
import { handleRegister } from "./controllers.js";
import { registerMiddleware } from "./middlewares.js";

const userRouter = Router()

userRouter.post('/register', registerMiddleware, handleRegister);

export default userRouter