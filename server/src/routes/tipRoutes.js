import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validateBody, validateQuery } from '../middleware/validateRequest.js';
import { tipCreateSchema, tipQuerySchema } from '../validators/tipValidators.js';
import {
  createTip,
  listTips,
  toggleTipLike
} from '../controllers/tipController.js';

const router = Router();

router.get('/', validateQuery(tipQuerySchema), listTips);
router.post('/', authenticate, validateBody(tipCreateSchema), createTip);
router.post('/:id/like', authenticate, toggleTipLike);

export default router;
