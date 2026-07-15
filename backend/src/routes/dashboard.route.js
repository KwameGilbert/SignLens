import { Router } from 'express';
import { getSummary } from '../controller/dashboard.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Endpoint: GET /api/dashboard/summary
router.get('/summary', requireAuth, getSummary);

export default router;
