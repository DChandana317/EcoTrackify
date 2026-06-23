import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';

export const authenticate = async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : req.cookies?.accessToken;

  if (!token) {
    return next(
      new AppError('Authentication required', StatusCodes.UNAUTHORIZED)
    );
  }

  try {
    const decoded = jwt.verify(token, env.jwt.accessSecret);
    const user = await User.findById(decoded.sub);

    if (!user) {
      throw new AppError('Account not found', StatusCodes.UNAUTHORIZED);
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(
      new AppError('Invalid or expired token', StatusCodes.UNAUTHORIZED)
    );
  }
};

export const authorizeRoles = (...roles) => (req, _res, next) => {
  const hasRole = req.user?.roles?.some((role) => roles.includes(role));
  if (!hasRole) {
    return next(new AppError('Forbidden', StatusCodes.FORBIDDEN));
  }
  return next();
};
