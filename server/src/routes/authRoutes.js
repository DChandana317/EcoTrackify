import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail
} from '../controllers/authController.js';
import { validateBody } from '../middleware/validateRequest.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../validators/authValidators.js';

const router = Router();

router.post('/register', validateBody(registerSchema), register);
router.get('/verify', verifyEmail);
router.post('/login', validateBody(loginSchema), login);
router.post('/refresh', refreshToken);
router.post('/forgot-password', validateBody(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validateBody(resetPasswordSchema), resetPassword);

export default router;
