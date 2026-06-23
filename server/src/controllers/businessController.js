import { StatusCodes } from 'http-status-codes';
import { BusinessService } from '../services/businessService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const createBusinessAccount = asyncHandler(async (req, res) => {
  const business = await BusinessService.createBusiness(req.user.id, req.body);
  res.status(StatusCodes.CREATED).json({
    status: 'success',
    message: 'Business workspace created',
    data: business
  });
});

export const businessDashboard = asyncHandler(async (req, res) => {
  if (!req.user.businessId) {
    throw new AppError('You are not linked to a business workspace', StatusCodes.BAD_REQUEST);
  }
  const data = await BusinessService.getDashboard(req.user.businessId);
  res.json({ status: 'success', data });
});
