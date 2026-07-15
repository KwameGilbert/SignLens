import multer from 'multer';

// Use memory storage for proxying files directly as buffers without local disk write overhead
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
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

export default upload;


 