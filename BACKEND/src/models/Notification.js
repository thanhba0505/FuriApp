const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
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
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true,
      },

      post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },

      commentContent: {
        type: String,
      },
    },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      index: { expires: "7d" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", schema);
