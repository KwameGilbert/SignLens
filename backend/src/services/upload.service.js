import multer from 'multer';

import fs from 'fs';
import path from 'path';

// Use memory storage for proxying files directly as buffers without local disk write overhead
const memoryStorage = multer.memoryStorage();

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Local disk storage for persistent uploads (like lesson videos)
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

export const upload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit file size to 10MB
  },
  fileFilter: (req, file, cb) => {
    // Check if the uploaded file is an image, video, or generic stream
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/') ||
      file.mimetype === 'application/octet-stream'
    ) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type (${file.mimetype}). Only image and video uploads are supported.`), false);
    }
  },
});

export const uploadLocal = multer({
  storage: diskStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // Limit video size to 100MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type (${file.mimetype}). Only video uploads are supported.`), false);
    }
  },
});

export default upload;