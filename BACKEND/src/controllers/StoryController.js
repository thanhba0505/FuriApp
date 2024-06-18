const multer = require("multer");
const { uploadStoryImage } = require("../config/uploads/multer");

const Story = require("../models/Story");

const addPathIfNeeded = (path, image) => {
  if (image && !image.startsWith(path)) {
    return path + image;
  }
  return image;
};

const StoryController = {
  addStory: (req, res) => {
    uploadStoryImage(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.json({ status: 400, message: err.message });
      } else if (err) {
        return res.json({ status: 400, message: err.message });
      }

      const accountID = req.account.id;
      const image = req.file;

      if (!image) {
        return res.json({ status: 400, message: "No photo uploaded" });
      }

      const newStory = new Story({
        account: accountID,
        image: image.filename,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      });

      try {
        await newStory.save();
        res.json({ status: 201, message: "Success creating story" });
      } catch (error) {
        res.json({ status: 500, message: "Error creating story", error });
      }
    });
  },

  getStories: async (req, res) => {
    const limit = parseInt(req.query._limit) || 4;
    const page = parseInt(req.query._page) || 1;
    const pathStory = "storyImage/";
    const pathAccount = "accountImage/";

    try {
      const stories = await Story.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({
          path: "account",
          select: "fullname avatar",
        });

      const updatedStory = stories.map((story) => {
        if (story.image) {
          story.image = addPathIfNeeded(pathStory, story.image);
        }

        if (story.account && story.account.avatar) {
          story.account.avatar = addPathIfNeeded(
            pathAccount,
            story.account.avatar
          );
        }
        return story;
      });

      return res.json({ status: 200, updatedStory });
    } catch (error) {
      return res.json({ status: 500, message: "Internal Server Error", error });
    }
  },
};

module.exports = StoryController;
