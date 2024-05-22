const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("RefreshToken", schema);
