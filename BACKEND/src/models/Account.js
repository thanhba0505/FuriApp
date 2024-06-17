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
      required: true,
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
        account: {
          type: mongoose.Schema.ObjectId,
          ref: "Account",
          required: true,
        },

        conversation: {
          type: mongoose.Schema.ObjectId,
          ref: "Conversation",
        },
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
