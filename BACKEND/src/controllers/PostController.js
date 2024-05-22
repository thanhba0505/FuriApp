const { uploadPostImage } = require("../config/uploads/multer");
const Post = require("../models/Post");
const multer = require("multer");

const PostController = {
  addPost: (req, res) => {
    uploadPostImage(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }

      const content = req.body.content;
      const userId = req.account.id;
      const images = req.files?.map((file) => file.filename);

      if (!content && (!images || images.length === 0)) {
        return res
          .status(400)
          .json({ message: "Content or images must be provided" });
      }

      try {
        const newPost = new Post({
          user: userId,
          content: content,
          images: images || [],
        });

        await newPost.save();
        res.status(201).json({ message: "Success creating post", newPost });
      } catch (error) {
        res.status(500).json({ message: "Error creating post", error });
      }
    });
  },
};

module.exports = PostController;
