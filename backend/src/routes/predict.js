import { Router } from 'express';
import { predictImage } from '../controller/predict.js';
import { requireAuth } from '../middleware/auth.js';
import upload from '../services/upload.js';

const router = Router();

// Handle single image file upload using multer memory storage and require JWT authentication
router.post('/', requireAuth, upload.single('file'), predictImage);

export default router;
