import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { validateBody } from '../middleware/validateRequest.js';
import { businessCreateSchema } from '../validators/businessValidators.js';
import {
  createBusinessAccount,
  businessDashboard
} from '../controllers/businessController.js';

const router = Router();

router.post('/', authenticate, validateBody(businessCreateSchema), createBusinessAccount);
router.get(
  '/dashboard',
  authenticate,
  authorizeRoles('business_admin'),
  businessDashboard
);

export default router;
