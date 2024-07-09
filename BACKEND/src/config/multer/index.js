const multer = require("multer");
const path = require("path");
const fs = require("fs");

const unlink = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log({ message: `Error unlink file`, err });
    }
  });
};

const storage = () =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, `../../public/uploads`));
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

const upload = multer({
  storage: storage(),
  limits: limits,
  fileFilter: fileFilter,
});

module.exports = { upload, unlink };
