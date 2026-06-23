import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';

export const UserService = {
  async getMe(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }
    return user;
  },

  async updateMe(userId, payload) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }
    if (payload.name) {
      user.name = payload.name;
    }
    if (payload.profile) {
      user.profile = { ...user.profile, ...payload.profile };
    }
    await user.save();
    return user;
  }
};
