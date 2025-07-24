import express, { Application } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import userRouter from './modules/user/routes.js';
import orderRoute from './modules/order/routes.js';
import { CONFIG_CLIENT_BASE_URL } from './config.js';

const app: Application = express();

// Middleware
app.use(cors({
    origin: CONFIG_CLIENT_BASE_URL,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/users', userRouter);
app.use('/api/orders', orderRoute);

// Global error handler
app.use(errorHandler);


export { app };