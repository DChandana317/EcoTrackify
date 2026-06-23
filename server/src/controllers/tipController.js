import { StatusCodes } from 'http-status-codes';
import { TipService } from '../services/tipService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const createTip = asyncHandler(async (req, res) => {
  const tip = await TipService.create(req.user.id, req.body);
  res.status(StatusCodes.CREATED).json({
    status: 'success',
    message: 'Tip submitted to the community',
    data: tip
  });
});

export const listTips = asyncHandler(async (req, res) => {
  const tips = await TipService.list(req.query);
  res.json({ status: 'success', data: tips });
});

export const toggleTipLike = asyncHandler(async (req, res) => {
  const tip = await TipService.toggleLike(req.params.id, req.user.id);
  res.json({ status: 'success', data: tip });
});
