const mongoose = require("mongoose");

const interactSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["like", "angry", "laugh"],
      required: true,
    },
    account: {
      type: mongoose.Schema.ObjectId,
      ref: "Account",
      required: true,
    },
  }
);

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    account: {
      type: mongoose.Schema.ObjectId,
      ref: "Account",
      required: true,
    }
  },
  { timestamps: true }
);

const schema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.ObjectId,
      ref: "Account",
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
