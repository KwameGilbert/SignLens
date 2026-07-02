import { Router } from 'express';
import { listActivityLogs, createActivityLog } from '../controller/activityLog.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', requireAuth, requireAdmin, listActivityLogs);
router.post('/', requireAuth, createActivityLog);

export default router;
