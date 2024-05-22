const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      maxlength: 30,
      minlength: 8,
    },

    password: {
      type: String,
      required: true,
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    admin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Account", schema);
