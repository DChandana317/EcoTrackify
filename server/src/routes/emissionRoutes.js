import { Router } from 'express';
import {
  createEmission,
  listEmissions,
  updateEmission,
  deleteEmission
} from '../controllers/emissionController.js';
import { authenticate } from '../middleware/auth.js';
import { validateBody, validateQuery } from '../middleware/validateRequest.js';
import {
  emissionCreateSchema,
  emissionQuerySchema,
  emissionUpdateSchema
} from '../validators/emissionValidators.js';

const router = Router();

router.use(authenticate);
router
  .route('/')
  .post(validateBody(emissionCreateSchema), createEmission)
  .get(validateQuery(emissionQuerySchema), listEmissions);

router
  .route('/:id')
  .patch(validateBody(emissionUpdateSchema), updateEmission)
  .delete(deleteEmission);

export default router;
