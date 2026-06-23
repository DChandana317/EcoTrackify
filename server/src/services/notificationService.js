import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';

export const NotificationService = {
  async list(userId) {
    return Notification.find({ userId }).sort({ createdAt: -1 }).limit(50);
  },

  async markRead(userId, notificationId) {
    const notification = await Notification.findOne({ _id: notificationId, userId });
    if (!notification) {
      throw new AppError('Notification not found', StatusCodes.NOT_FOUND);
    }
    notification.isRead = true;
    await notification.save();
    return notification;
  },

  async updatePrefs(userId, prefs) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }
    user.notificationPrefs = { ...user.notificationPrefs, ...prefs };
    await user.save();
    return user.notificationPrefs;
  },

  async create(userId, payload) {
    return Notification.create({ userId, ...payload });
  }
};
