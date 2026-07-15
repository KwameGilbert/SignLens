import { Router } from 'express';
import { 
  listQuizzes, 
  getQuiz, 
  createQuiz, 
  updateQuiz, 
  deleteQuiz,
  listOptions,
  createOption,
  deleteOption 
} from '../controller/quiz.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Quizzes endpoints
router.get('/', requireAuth, listQuizzes);
router.get('/:id', requireAuth, getQuiz);
router.post('/', requireAuth, requireAdmin, createQuiz);
router.put('/:id', requireAuth, requireAdmin, updateQuiz);
router.delete('/:id', requireAuth, requireAdmin, deleteQuiz);

// Quiz Options endpoints
router.get('/:quizId/options', requireAuth, listOptions);
router.post('/:quizId/options', requireAuth, requireAdmin, createOption);
router.delete('/options/:id', requireAuth, requireAdmin, deleteOption);

export default router;
