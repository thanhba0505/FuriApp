const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    fullName: {
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", schema);
