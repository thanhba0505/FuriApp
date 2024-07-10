const multer = require("multer");
const { uploadStoryImage } = require("../config/uploads/multer");

const Story = require("../models/Story");
const Account = require("../models/Account");

const StoryController = {
  addStory: (req, res) => {
    uploadStoryImage(req, res, async (err) => {
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

        const newStory = new Story({
          account: accountID,
          image: image.filename,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        });

        await newStory.save();
        res.json({ status: 201, message: "Success creating story" });
      } catch (error) {
        res.json({ status: 500, message: "Error creating story", error });
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
