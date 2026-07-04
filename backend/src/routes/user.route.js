import { Router } from 'express';
import { listUsers } from '../controller/user.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', requireAuth, requireAdmin, listUsers);

export default router;
