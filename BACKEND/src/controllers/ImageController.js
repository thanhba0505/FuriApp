const path = require("path");
const fs = require("fs");

const ImageController = {
  getImage: async (req, res) => {
    const { folder, filename } = req.params;
    const imagePath = path.join(
      __dirname,
      "../public/uploads",
      folder,
      filename
    );

    fs.access(imagePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).json({ message: "Image not found" });
      }

      res.sendFile(imagePath);
    });
  },
};

module.exports = ImageController;
