import { Router } from 'express';
import { listLessons, getLesson, createLesson, updateLesson, deleteLesson } from '../controller/lesson.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';
import { upload } from '../services/upload.service.js';

const router = Router();

router.get('/', requireAuth, listLessons);
router.get('/:id', requireAuth, getLesson);
router.post('/', requireAuth, requireAdmin, upload.single('video'), createLesson);
router.put('/:id', requireAuth, requireAdmin, upload.single('video'), updateLesson);
router.patch('/:id', requireAuth, requireAdmin, upload.single('video'), updateLesson);
router.delete('/:id', requireAuth, requireAdmin, deleteLesson);

export default router;
