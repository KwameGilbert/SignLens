import { Router } from 'express';
import { register, login, googleLogin, me, profile } from '../controller/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', requireAuth, me);
router.get('/profile', requireAuth, profile);

export default router;
