import { Router } from "express";
import { handleLogin, handleRegister, handleVerifyOtp } from "./controllers.js";
import { changePasswordMiddleware, loginMiddleware, registerMiddleware, verifyOtpMiddleware } from "./middlewares.js";
import { authenticate } from "../../middlewares/auth.js";

const userRouter = Router()

userRouter.post('/register', registerMiddleware, handleRegister);
userRouter.put('/change-password', authenticate, changePasswordMiddleware, handleRegister);
userRouter.put('/verify-otp', verifyOtpMiddleware, handleVerifyOtp);
userRouter.post('/login', loginMiddleware, handleLogin);

export default userRouter