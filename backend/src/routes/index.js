import { Router } from 'express';
import authRoutes from './auth.js';
import historyRoutes from './history.js';
import predictRoutes from './predict.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/history', historyRoutes);
router.use('/predict', predictRoutes);

export default router;
