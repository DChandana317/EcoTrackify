import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { UserService } from '../services/userService.js';

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await UserService.getMe(req.user.id);
  res.json({ status: 'success', data: user });
});

export const updateCurrentUser = asyncHandler(async (req, res) => {
  const user = await UserService.updateMe(req.user.id, req.body);
  res.status(StatusCodes.OK).json({ status: 'success', message: 'Profile updated', data: user });
});
