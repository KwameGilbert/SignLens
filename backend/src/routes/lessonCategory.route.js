import { Router } from 'express';
import { listCategories, getCategory, createCategory, updateCategory, deleteCategory } from '../controller/lessonCategory.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', requireAuth, listCategories);
router.get('/:id', requireAuth, getCategory);
router.post('/', requireAuth, requireAdmin, createCategory);
router.put('/:id', requireAuth, requireAdmin, updateCategory);
router.delete('/:id', requireAuth, requireAdmin, deleteCategory);

export default router;
