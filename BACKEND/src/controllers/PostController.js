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
      const accountID = req.account.id;
      const images = req.files?.map((file) => file.filename);

      if (!content && (!images || images.length === 0)) {
        return res
          .status(400)
          .json({ message: "Content or images must be provided" });
      }

      try {
        const newPost = new Post({
          account: accountID,
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

  getPosts: async (req, res) => {
    const limit = parseInt(req.query._limit) || 10;

    try {
      const posts = await Post.find()
        .limit(limit)
        .populate({
          path: "account",
          select: "username user",
          populate: {
            select: "avatar fullName",
            path: "user",
          },
        });
      return res.status(200).json(posts);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getPostById: async (req, res) => {
    const postId = req.params.postId;

    try {
      const post = await Post.findById(postId).populate("account");
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  addInteraction: async (req, res) => {
    try {
      const postId = req.params.postId;
      const accountID = req.account.id;
      const type = req.body.type;

      if (!["like", "angry", "laugh"].includes(type)) {
        return res.status(400).json({ message: "Invalid interaction type" });
      }

      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const existingInteractionIndex = post.interact.findIndex(
        (interaction) => interaction.account.toString() === accountID
      );

      if (existingInteractionIndex !== -1) {
        if (post.interact[existingInteractionIndex].type === type) {
          post.interact.splice(existingInteractionIndex, 1);
        } else {
          post.interact[existingInteractionIndex].type = type;
        }
      } else {
        post.interact.push({ type, account: accountID });
      }

      await post.save();

      return res
        .status(200)
        .json({ message: "Interaction added successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  addComment: async (req, res) => {},
};

module.exports = PostController;
