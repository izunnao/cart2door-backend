import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import userRouter from './modules/user/routes.js';
import orderRoute from './modules/order/routes.js';

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

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
