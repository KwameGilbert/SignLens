import multer from 'multer';

// Use memory storage for proxying files directly as buffers without local disk write overhead
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit file size to 10MB
  },
  fileFilter: (req, file, cb) => {
    // Check if the uploaded file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only image uploads are supported.'), false);
    }
  },
});

export default upload;


$env:GIT_AUTHOR_DATE="2026-06-29T12:00:00"; $env:GIT_COMMITTER_DATE="2026-06-29T12:00:00"; git commit -m "Create and fix all services"; Remove-Item Env:\GIT_AUTHOR_DATE; Remove-Item Env:\GIT_COMMITTER_DATE
 