import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validateRequest.js';
import { userUpdateSchema } from '../validators/userValidators.js';
import { getCurrentUser, updateCurrentUser } from '../controllers/userController.js';

const router = Router();

router.use(authenticate);
router.get('/me', getCurrentUser);
router.patch('/me', validateBody(userUpdateSchema), updateCurrentUser);

export default router;
