import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validateRequest.js';
import {
  goalCreateSchema,
  goalUpdateSchema
} from '../validators/goalValidators.js';
import {
  createGoal,
  listGoals,
  updateGoal
} from '../controllers/goalController.js';

const router = Router();

router.use(authenticate);
router
  .route('/')
  .post(validateBody(goalCreateSchema), createGoal)
  .get(listGoals);

router.route('/:id').patch(validateBody(goalUpdateSchema), updateGoal);

export default router;
