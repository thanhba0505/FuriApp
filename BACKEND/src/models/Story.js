const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.ObjectId,
      ref: "Account",
      required: true,
    },

    image: {
      type: String,
    },

    expiresAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: { expires: "24h" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", schema);
