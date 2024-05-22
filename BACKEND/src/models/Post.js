const mongoose = require("mongoose");

const interactSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["like", "angry", "laugh"],
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    }
  },
  { timestamps: true }
);

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
    },

    images: {
      type: [String],
    },

    interact: {
      type: [interactSchema],
    },

    comment: {
      type: [commentSchema],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", schema);
