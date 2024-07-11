const multer = require("multer");

const Story = require("../models/Story");
const Account = require("../models/Account");
const { upload } = require("../config/multer");
const { uploadStory } = require("../utils/cloudinary");

const StoryController = {
  addStory: (req, res) => {
    upload.single("image", 1)(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.json({ status: 400, message: err.message });
      } else if (err) {
        return res.json({ status: 400, message: err.message });
      }

      try {
        const accountID = req.account.id;
        const image = req.file;

        if (!image) {
          return res.json({ status: 400, message: "No photo uploaded" });
        }

        const storyUrl = await uploadStory(image.path);

        if (storyUrl) {
          const newStory = new Story({
            account: accountID,
            image: storyUrl,
            expiresAt: Date.now() + 24 * 60 * 60 * 1000,
          });

          await newStory.save();
          return res.json({ status: 201, message: "Success creating story" });
        } else {
          return res.json({
            status: 500,
            message: "Failed to upload from cloud",
          });
        }
      } catch (error) {
        console.log({ error });
        return res.json({ status: 500, message: "Error creating story" });
      }
    });
  },

  getStories: async (req, res) => {
    const limit = parseInt(req.query._limit) || 4;

    try {
      const accountId = req.account.id;

      const account = await Account.findById(accountId).populate({
        path: "friends.account",
        select: "_id",
      });

      if (!account) {
        return res.json({ status: 404, message: "Account not found" });
      }

      const friendIds = account.friends.map((friend) => friend.account._id);

      const stories = await Story.find({
        account: { $in: [...friendIds, accountId] },
      }).populate({
        path: "account",
        select: "fullname avatar",
      });

      const shuffledStories = stories.sort(() => 0.5 - Math.random());
      const limitedStories = shuffledStories.slice(0, limit);

      return res.json({ status: 200, stories: limitedStories });
    } catch (error) {
      return res.json({ status: 500, message: "Internal Server Error", error });
    }
  },
};

module.exports = StoryController;
