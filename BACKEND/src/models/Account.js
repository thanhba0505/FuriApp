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

    fullname: {
      type: String,
      require: true,
      maxlength: 50,
      minlength: 4,
    },

    avatar: {
      type: String,
    },

    background: {
      type: String,
    },

    sentFriendRequests: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Account",
      },
    ],

    receivedFriendRequests: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Account",
      },
    ],

    friends: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Account",
      },
    ],

    admin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Account", schema);
