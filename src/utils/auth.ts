import jwt, { SignOptions } from 'jsonwebtoken';
import { CONFIG_JWT_SECRET } from '../config.js';

const TOKEN_EXPIRES_IN = '7d'; // or customize per your needs

// The shape of the payload you want to embed in the token
interface JwtPayload {
  id: string;
  email: string;
}

// Generate a JWT token
export const generateToken = (
  payload: JwtPayload,
  expiresIn: SignOptions['expiresIn'] = '1d',
  otherSignOptions: Omit<SignOptions, 'expiresIn'> = {}
): string => {
  const options: SignOptions = { expiresIn, ...otherSignOptions };
  return jwt.sign(payload, CONFIG_JWT_SECRET, options);
};

// Verify a JWT token
export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, CONFIG_JWT_SECRET) as JwtPayload;
};
