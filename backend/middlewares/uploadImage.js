import multer from 'multer';

const storage = multer.memoryStorage(); // keep file in memory (buffer)

// middleware only for images
const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
  fileFilter: (req, file, cb) => {
    // Allow only image file types
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg'
    ) {
      cb(null, true); // ✅ Accept file
    } else {
      cb(new Error('Only .jpg, .jpeg, and .png files are allowed!'), false); // ❌ Reject file
    }
  },
});

export default uploadImage;
