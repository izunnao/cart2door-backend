
import { NextFunction, Request, Response } from 'express';
import { throwErrorOn } from '../utils/AppError.js';
import { verifyToken } from '../utils/auth.js';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    throwErrorOn(!token, 401, 'Access denied');
    return 
  }

  try {
    const user = verifyToken(token);

    req['user'] = user

    next();
  } catch (err) {
    next(err)
  }
};