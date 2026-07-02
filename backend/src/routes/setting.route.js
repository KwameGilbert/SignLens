import { Router } from 'express';
import { listSettings, getSetting, updateSetting } from '../controller/setting.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', requireAuth, requireAdmin, listSettings);
router.get('/:key', requireAuth, getSetting);
router.put('/:key', requireAuth, requireAdmin, updateSetting);

export default router;
