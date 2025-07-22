import { Router } from "express";
import { handleLogin, handleRegister, handleVerifyOtp } from "./controllers.js";
import { loginMiddleware, registerMiddleware, verifyOtpMiddleware } from "./middlewares.js";

const userRouter = Router()

userRouter.post('/register', registerMiddleware, handleRegister);
userRouter.put('/verify-otp', verifyOtpMiddleware, handleVerifyOtp);
userRouter.post('/login', loginMiddleware, handleLogin);

export default userRouter