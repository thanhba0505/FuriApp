const multer = require("multer");

const Post = require("../models/Post");
const Account = require("../models/Account");
const Notification = require("../models/Notification");
const { upload } = require("../config/multer");
const { uploadMultipleImages } = require("../utils/cloudinary");

const PostController = {
  addPost: (req, res, io) => {
    upload.array("images", 10)(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }

      const content = req.body.content;
      const accountId = req.account.id;
      const images = req.files;

      try {
        if (!content && (!images || images.length === 0)) {
          return res.json({
            status: 400,
            message: "Content or images must be provided",
          });
        }

        if (images.length > 10) {
          return res.json({
            status: 400,
            message: "The number of photos must be less than 10",
          });
        }

        const filePaths = images?.map((file) => file.path);
        const imageUrls = await uploadMultipleImages(filePaths);

        if (imageUrls) {
          const newPost = new Post({
            account: accountId,
            content: content,
            images: imageUrls || [],
          });

          await newPost.save();

          const account = await Account.findById(accountId);

          const friends = account.friends.map((friend) => friend.account);

          const notifications = friends.map((friendId) => ({
            user: friendId,
            type: "post",
            message: `${account.fullname} has created a new post`,
            data: {
              sender: accountId,
              post: newPost._id,
            },
          }));

          await Notification.insertMany(notifications);

          friends.forEach((friendId) => {
            io.emit("newNotification" + friendId, {
              message: `${account.fullname} has created a new post`,
            });
          });

          return res.json({ status: 201, message: "Success creating post" });
        } else {
          return res.json({ status: 500, message: "Error creating post" });
        }
      } catch (error) {
        console.log({ error });
        res.json({ status: 500, message: "Internal Server Error" });
      }
    });
  },

  getPosts: async (req, res) => {
    const limit = parseInt(req.query._limit) || 10;

    try {
      const posts = await Post.find()
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
          post.account.avatar = post.account.avatar || "";
          post.account.background = post.account.background || "";
        }
        if (post.images && Array.isArray(post.images)) {
          post.images = post.images.map((image) => image || "");
        }
        if (post.comment && Array.isArray(post.comment)) {
          post.comment = post.comment.map((comment) => {
            if (comment.account) {
              comment.account.avatar = comment.account.avatar || "";
            }
            return comment;
          });
        }
        return post;
      });

      const shuffledPosts = updatedPosts.sort(() => 0.5 - Math.random());
      const limitedPosts = shuffledPosts.slice(0, limit);

      return res.json({
        status: 200,
        message: "Get post successful",
        posts: limitedPosts,
      });
    } catch (error) {
      return res.json({ status: 500, message: "Internal Server Error" });
    }
  },

  getPostById: async (req, res) => {
    const postId = req.params.postId;

    try {
      const post = await Post.findById(postId)
        .populate({
          path: "account",
          select: "fullname avatar background",
        })
        .populate({
          path: "comment.account",
          select: "fullname avatar",
        });

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post.account) {
        post.account.avatar = post.account.avatar || "";
        post.account.background = post.account.background || "";
      }
      if (post.images && Array.isArray(post.images)) {
        post.images = post.images.map((image) => image || "");
      }
      if (post.comment && Array.isArray(post.comment)) {
        post.comment = post.comment.map((comment) => {
          if (comment.account) {
            comment.account.avatar = comment.account.avatar || "";
          }
          return comment;
        });
      }

      return res.json({
        status: 200,
        message: "Get post successful",
        post: post,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getPostByAccountId: async (req, res) => {
    const { accountId } = req.params || "";
    const limit = parseInt(req.query._limit) || 10;

    try {
      if (accountId == "") {
        return res.json({ status: 404, message: "Account not found" });
      }

      const posts = await Post.find({ account: accountId })
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
          post.account.avatar = post.account.avatar || "";
          post.account.background = post.account.background || "";
        }
        if (post.images && Array.isArray(post.images)) {
          post.images = post.images.map((image) => image || "");
        }
        if (post.comment && Array.isArray(post.comment)) {
          post.comment = post.comment.map((comment) => {
            if (comment.account) {
              comment.account.avatar = comment.account.avatar || "";
            }
            return comment;
          });
        }
        return post;
      });

      return res.json({
        status: 200,
        message: "Get posts successful",
        posts: updatedPosts,
      });
    } catch (error) {
      return res.json({ status: 500, message: "Internal Server Error" });
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

      io.emit("newComment_" + postId, { addedComment });

      if (post.account.toString() !== accountID) {
        const account = await Account.findById(accountID);

        const notification = new Notification({
          user: post.account,
          type: "comment",
          message: `${account.fullname} has commented on your post`,
          data: {
            sender: accountID,
            post: postId,
            commentContent: content,
          },
        });

        await notification.save();

        io.emit("newNotification" + post.account, {
          message: notification.message,
        });
      }

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
