const fs = require("fs");
const path = require("path");

const ImageController = {
  uploadImage: (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    return res
      .status(200)
      .json({ message: "File uploaded successfully", file: req.file });
  },

  getImage: (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, "../public/uploads", filename);
    const returnType = req.query.type; 

    fs.access(filepath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).json({ message: "File not found" });
      }

      if (returnType === "info") {
        fs.stat(filepath, (err, stats) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Error retrieving file info" });
          }

          const fileInfo = {
            filename: filename,
            filepath: process.env.FURI_BASE_URL + "/api/image/" + filename,
            size: stats.size,
            birthtime: stats.birthtime,
            mtime: stats.mtime,
            isFile: stats.isFile(),
            isDirectory: stats.isDirectory(),
          };

          return res.status(200).json(fileInfo);
        });
      } else {
        res.sendFile(filepath, (err) => {
          if (err) {
            res.status(500).json({ message: "Error sending file" });
          }
        });
      }
    });
  },
};

module.exports = ImageController;
