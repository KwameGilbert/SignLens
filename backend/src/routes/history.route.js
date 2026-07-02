import { Router } from 'express';
import { getHistory, createHistory, getAllHistory } from '../controller/history.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', requireAuth, getHistory);
router.post('/', requireAuth, createHistory);
router.get('/all', requireAuth, requireAdmin, getAllHistory);

export default router;
