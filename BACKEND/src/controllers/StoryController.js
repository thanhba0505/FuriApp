const multer = require("multer");
const { uploadStoryImage } = require("../config/uploads/multer");

const Story = require("../models/Story");

const StoryController = {
  addStory: (req, res) => {
    uploadStoryImage(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }

      const accountID = req.account.id;
      const image = req.file;

      if (!image) {
        return res.status(400).json({ message: "No photo uploaded" });
      }

      const newStory = new Story({
        account: accountID,
        image: image.filename, 
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, 
      });

      try {
        await newStory.save();
        res.status(201).json({ message: "Success creating story" });
      } catch (error) {
        res.status(500).json({ message: "Error creating story", error });
      }
    });
  },

  
};

module.exports = StoryController;
