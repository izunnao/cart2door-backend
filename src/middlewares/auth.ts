
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { JWT_SECRET_CONF } from '../config.js';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Access denied');

  try {
    const verified = jwt.verify(token, JWT_SECRET_CONF);
    

    next();
  } catch (err) {
    next(err)
  }
};