const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["friend_request", "friend_accept", "post", "comment"],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    read: {
      type: Boolean,
      default: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    data: {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },

      commentContent: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", schema);
