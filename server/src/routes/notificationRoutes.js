import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validateRequest.js';
import { notificationPrefsSchema } from '../validators/notificationValidators.js';
import {
  listNotifications,
  markNotificationRead,
  updateNotificationPrefs
} from '../controllers/notificationController.js';

const router = Router();

router.use(authenticate);
router.get('/', listNotifications);
router.patch('/prefs', validateBody(notificationPrefsSchema), updateNotificationPrefs);
router.patch('/:id/read', markNotificationRead);

export default router;
