import { Router } from 'express';
import { predictImage } from '../controller/predict.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import upload from '../services/upload.service.js';

const router = Router();

// Handle single image file upload using multer memory storage and require JWT authentication
router.post('/', requireAuth, upload.single('file'), predictImage);

export default router;
