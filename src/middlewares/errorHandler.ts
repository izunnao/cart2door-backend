import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('🔴 Global Error Handler:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.log(message)

  if (statusCode === 401 || statusCode === 403) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    })
  }

  res.status(statusCode).json({
    isSuccess: false,
    message,
    error: {
      message,
    },
  });
};
