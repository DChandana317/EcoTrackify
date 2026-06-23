import { NotificationService } from '../services/notificationService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await NotificationService.list(req.user.id);
  res.json({ status: 'success', data: notifications });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await NotificationService.markRead(req.user.id, req.params.id);
  res.json({ status: 'success', data: notification });
});

export const updateNotificationPrefs = asyncHandler(async (req, res) => {
  const prefs = await NotificationService.updatePrefs(req.user.id, req.body);
  res.json({ status: 'success', message: 'Preferences updated', data: prefs });
});
