import { Router } from 'express';
import { register, login, googleLogin, me, listUsers } from '../controller/auth.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', requireAuth, me);
router.get('/users', requireAuth, requireAdmin, listUsers);

export default router;
