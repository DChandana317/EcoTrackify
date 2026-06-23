import { Router } from 'express';
import authRoutes from './authRoutes.js';
import emissionRoutes from './emissionRoutes.js';
import goalRoutes from './goalRoutes.js';
import tipRoutes from './tipRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import businessRoutes from './businessRoutes.js';
import userRoutes from './userRoutes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/emissions', emissionRoutes);
apiRouter.use('/goals', goalRoutes);
apiRouter.use('/tips', tipRoutes);
apiRouter.use('/notifications', notificationRoutes);
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/business', businessRoutes);
apiRouter.use('/users', userRoutes);
