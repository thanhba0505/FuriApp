const fs = require("fs");
const path = require("path");

const ImageController = {
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

  getImagePost: (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "../public/uploads/postImage", filename);

    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).json({ message: "File not found" });
      }
    });
  },
};

module.exports = ImageController;
