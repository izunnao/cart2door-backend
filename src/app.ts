import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import userRouter from './modules/user/routes.js';
import orderRoute from './modules/order/routes.js';
import { sendMail } from './notification/services.js';
import { templatePayloads } from './notification/utils/payload.temp.notification.js';

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/users', userRouter);
app.use('/api/orders', orderRoute);



// sendMail({
//     to: 'taofeekibrahimope@gmail.com',
//     payload: templatePayloads.registrationSuccess({ name: 'Ibrahim', id: '12343243', verificationLink: '' }),
//     context: 'registrationSuccess',
//     subject: 'Registration Success',
// })

// Global error handler
app.use(errorHandler);


export { app };