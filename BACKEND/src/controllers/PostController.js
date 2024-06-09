const multer = require("multer");
const { uploadPostImage } = require("../config/uploads/multer");

const Post = require("../models/Post");

const addPathIfNeeded = (path, image) => {
  if (image && !image.startsWith(path)) {
    return path + image;
  }
  return image;
};

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

      if (images.length > 10) {
        return res
          .status(400)
          .json({ message: "The number of photos must be less than 10" });
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
    const pathAccount = "accountImage/";
    const pathPost = "postImage/";

    const addPathIfNeeded = (path, image) => {
      if (image && !image.startsWith(path)) {
        return path + image;
      }
      return image;
    };

    try {
      const posts = await Post.find()
        .limit(limit)
        .populate({
          path: "account",
          select: "fullname avatar background",
        })
        .populate({
          path: "comment.account",
          select: "fullname avatar",
        });

      const updatedPosts = posts.map((post) => {
        if (post.account) {
          post.account.avatar = addPathIfNeeded(
            pathAccount,
            post.account.avatar
          );
          post.account.background = addPathIfNeeded(
            pathAccount,
            post.account.background
          );
        }
        if (post.images && Array.isArray(post.images)) {
          post.images = post.images.map((image) =>
            addPathIfNeeded(pathPost, image)
          );
        }
        if (post.comment && Array.isArray(post.comment)) {
          post.comment = post.comment.map((comment) => {
            if (comment.account) {
              comment.account.avatar = addPathIfNeeded(
                pathAccount,
                comment.account.avatar
              );
            }
            return comment;
          });
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
      const { type } = req.body;

      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const existingInteractionIndex = post.interact.findIndex(
        (interaction) => interaction.account.toString() === accountID
      );

      if (!type) {
        if (existingInteractionIndex !== -1) {
          return res
            .status(200)
            .json({ type: post.interact[existingInteractionIndex].type });
        } else {
          return res.status(200).json({ type: null });
        }
      }

      if (!["like", "angry", "laugh"].includes(type)) {
        return res.status(400).json({ message: "Invalid interaction type" });
      }

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

      const updatedInteraction = post.interact.find(
        (interaction) => interaction.account.toString() === accountID
      );

      return res.status(200).json({
        message: "Interaction updated successfully",
        type: updatedInteraction ? updatedInteraction.type : null,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  addComment: async (req, res, io) => {
    const pathAccount = "accountImage/";

    try {
      const postId = req.params.postId;
      const accountID = req.account.id;
      const content = req.body.content;

      if (!content || content.trim() === "") {
        return res.status(400).json({ message: "Content cannot be empty" });
      }

      const post = await Post.findById(postId).populate({
        path: "comment.account",
        select: "fullname avatar",
      });

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const newComment = {
        content: content,
        account: accountID,
      };

      post.comment.push(newComment);

      await post.save();

      const populatedComment = await post.populate({
        path: "comment.account",
        select: "fullname avatar",
        match: { _id: accountID },
      });

      const addedComment =
        populatedComment.comment[populatedComment.comment.length - 1];
      addedComment.account.avatar = addPathIfNeeded(
        pathAccount,
        addedComment.account.avatar
      );

      io.emit("newComment_" + postId, { addedComment });

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
