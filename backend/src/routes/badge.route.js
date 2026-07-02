import { Router } from 'express';
import { listBadges, getBadge, createBadge, updateBadge, deleteBadge } from '../controller/badge.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', requireAuth, listBadges);
router.get('/:id', requireAuth, getBadge);
router.post('/', requireAuth, requireAdmin, createBadge);
router.put('/:id', requireAuth, requireAdmin, updateBadge);
router.delete('/:id', requireAuth, requireAdmin, deleteBadge);

export default router;
