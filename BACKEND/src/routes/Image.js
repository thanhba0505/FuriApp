const express = require('express');
const router = express.Router();
const ImageController = require('../controllers/ImageController');
const multer = require('multer');
const path = require('path');

// Cấu hình lưu trữ Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn kích thước tệp tải lên là 10MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('File type not supported'));
    }
  },
});

router.post('/upload', upload.single('image'), ImageController.uploadImage);
router.get('/:filename', ImageController.getImage);

module.exports = router;
