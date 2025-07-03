
import { NextFunction, Request, Response } from 'express';
import { throwErrorOn } from '../utils/AppError.js';
import { verifyToken } from '../utils/auth.js';
import { prisma } from '../database/prisma_config.js';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    throwErrorOn(!token, 401, 'Access denied');
    return;
  }

  try {
    const jwtData = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: jwtData.id },
    });

    if (!user) {
      return throwErrorOn(!user, 401, 'User not found');
    }

    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};



export const authorize = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    throwErrorOn(
      !user || user.role !== 'admin',
      403,
      'Unauthorized: Admin access required'
    );

    next();
  } catch (err) {
    next(err);
  }
};