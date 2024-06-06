const multer = require("multer");
const path = require("path");

// config storagePost
const storagePost = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/uploads/postImage"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// config storageAccount
const storageAccount = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/uploads/accountImage"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// config storageStory
const storageStory = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/uploads/storyImage"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const limits = { fileSize: 10 * 1024 * 1024 }; // 10MB

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("File type not supported"));
  }
};

const uploadPostImage = multer({
  storage: storagePost,
  limits: limits,
  fileFilter: fileFilter,
}).array("images", 10); // 10 image

const uploadAccountImage = multer({
  storage: storageAccount,
  limits: limits,
  fileFilter: fileFilter,
}).single("image");

const uploadStoryImage = multer({
  storage: storageStory,
  limits: limits,
  fileFilter: fileFilter,
}).single("image");

module.exports = {
  uploadPostImage,
  uploadAccountImage,
  uploadStoryImage,
};
