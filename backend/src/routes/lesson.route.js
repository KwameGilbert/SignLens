import { Router } from 'express';
import { listLessons, getLesson, createLesson, updateLesson, deleteLesson } from '../controller/lesson.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';
import { uploadLocal } from '../services/upload.service.js';

const router = Router();

router.get('/', requireAuth, listLessons);
router.get('/:id', requireAuth, getLesson);
router.post('/', requireAuth, requireAdmin, uploadLocal.single('videoFile'), createLesson);
router.put('/:id', requireAuth, requireAdmin, uploadLocal.single('videoFile'), updateLesson);
router.delete('/:id', requireAuth, requireAdmin, deleteLesson);

export default router;
