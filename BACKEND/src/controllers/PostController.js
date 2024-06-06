const multer = require("multer");
const { uploadPostImage } = require("../config/uploads/multer");

const Post = require("../models/Post");

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
        res.status(201).json({ message: "Success creating post" });
      } catch (error) {
        res.status(500).json({ message: "Error creating post", error });
      }
    });
  },

  getPosts: async (req, res) => {
    const limit = parseInt(req.query._limit) || 10;
    const baseUrlAccount =
      process.env.FURI_BASE_URL + "/public/uploads/accountImage/";
    const baseUrlPost =
      process.env.FURI_BASE_URL + "/public/uploads/postImage/";

    try {
      const posts = await Post.find().limit(limit).populate({
        path: "account",
        select: "fullname avatar background",
      });

      const updatedPosts = posts.map((post) => {
        if (post.account && post.account.avatar) {
          post.account.avatar = baseUrlAccount + post.account.avatar;
        }
        if (post.account && post.account.background) {
          post.account.background = baseUrlAccount + post.account.background;
        }
        if (post.images && Array.isArray(post.images)) {
          post.images = post.images.map((image) => baseUrlPost + image);
        }

        return post;
      });

      return res.status(200).json(updatedPosts);
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

  addComment: async (req, res) => {
    try {
      const postId = req.params.postId;
      const accountID = req.account.id;
      const content = req.body.content;

      if (!content || content.trim() === "") {
        return res.status(400).json({ message: "Content cannot be empty" });
      }

      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const newComment = {
        content: content,
        account: accountID,
      };

      post.comment.push(newComment);

      await post.save();

      return res.status(200).json({ message: "Add comment successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const postId = req.params.postId;
      const commentId = req.params.commentId;
      const accountID = req.account.id;

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const comment = post.comment.id(commentId);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      if (comment.account.toString() !== accountID) {
        return res.status(403).json({
          message: "You do not have permission to delete this comment",
        });
      }

      post.comment.pull(commentId);

      await post.save();

      return res.status(200).json({ message: "Delete comment successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = PostController;
