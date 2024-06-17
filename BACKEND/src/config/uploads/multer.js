const multer = require("multer");
const path = require("path");
const fs = require("fs");

const deleteFile = (pathName) => {
  const filePath = path.join(__dirname, `../../public/uploads/${pathName}`);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file ${pathName}`);
    }
  });
};

const createStorage = (folderName) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, `../../public/uploads/${folderName}`));
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

const limits = { fileSize: 10 * 1024 * 1024 };

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|jfif|pjpeg|pjp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("File type not supported"));
  }
};

const uploadPostImage = multer({
  storage: createStorage("postImage"),
  limits: limits,
  fileFilter: fileFilter,
}).array("images", 10);

const uploadAccountImage = multer({
  storage: createStorage("accountImage"),
  limits: limits,
  fileFilter: fileFilter,
}).single("image", 1);

const uploadStoryImage = multer({
  storage: createStorage("storyImage"),
  limits: limits,
  fileFilter: fileFilter,
}).single("image", 1);

module.exports = {
  uploadPostImage,
  uploadAccountImage,
  uploadStoryImage,
  deleteFile,
};
