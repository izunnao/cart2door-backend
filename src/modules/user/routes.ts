import { Router } from "express";
import { handleLogin, handleRegister } from "./controllers.js";
import { loginMiddleware, registerMiddleware } from "./middlewares.js";

const userRouter = Router()

userRouter.post('/register', registerMiddleware, handleRegister);
userRouter.post('/login', loginMiddleware, handleLogin);

export default userRouter