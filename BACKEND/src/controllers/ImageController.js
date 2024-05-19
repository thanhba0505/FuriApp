const path = require('path');
const fs = require('fs');

const ImageController = {
  uploadImage: (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      res.status(200).json({ message: 'File uploaded successfully', filename: req.file.filename });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  getImage: (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '../uploads', filename);

    fs.access(filepath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).json({ message: 'File not found' });
      }

      res.sendFile(filepath, (err) => {
        if (err) {
          res.status(500).json({ message: 'Error sending file' });
        }
      });
    });
  }
};

module.exports = ImageController;
