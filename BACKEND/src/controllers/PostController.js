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

  addInteraction: async (req, res) => {
    const postId = req.params.postId;
    const userId = req.account.id;
    const { type } = req.body;

    if (!["like", "angry", "laugh"].includes(type)) {
      return res.status(400).json({ message: "Invalid interaction type" });
    }
    try {
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const existingInteractionIndex = post.interact.findIndex(
        (interaction) => interaction.user.toString() === userId
      );

      if (existingInteractionIndex !== -1) {
        if (post.interact[existingInteractionIndex].type === type) {
          post.interact.splice(existingInteractionIndex, 1);
        } else {
          post.interact[existingInteractionIndex].type = type;
        }
      } else {
        post.interact.push({ type, user: userId });
      }

      await post.save();
      return res
        .status(200)
        .json({ message: "Interaction added successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal Server Error" });
    }
  },
};

module.exports = PostController;
