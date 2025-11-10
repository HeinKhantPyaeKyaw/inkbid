import multer from 'multer';

const storage = multer.memoryStorage();

const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg'
    ) {
      cb(null, true); 
    } else {
      cb(new Error('Only .jpg, .jpeg, and .png files are allowed!'), false); 
    }
  },
});

export default uploadImage;
