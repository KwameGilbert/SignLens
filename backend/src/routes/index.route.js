import { Router } from 'express';
import authRoutes from './auth.route.js';
import userRoutes from './user.route.js';
import historyRoutes from './history.route.js';
import predictRoutes from './predict.route.js';
import lessonCategoryRoutes from './lessonCategory.route.js';
import lessonRoutes from './lesson.route.js';
import quizRoutes from './quiz.route.js';
import badgeRoutes from './badge.route.js';
import activityLogRoutes from './activityLog.route.js';
import settingRoutes from './setting.route.js';
import dashboardRoutes from './dashboard.route.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/history', historyRoutes);
router.use('/predict', predictRoutes);
router.use('/lesson-categories', lessonCategoryRoutes);
router.use('/lessons', lessonRoutes);
router.use('/quizzes', quizRoutes);
router.use('/badges', badgeRoutes);
router.use('/activity-logs', activityLogRoutes);
router.use('/settings', settingRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
