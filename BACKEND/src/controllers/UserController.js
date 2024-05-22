const User = require("../models/User");

const UserController = {
  addUser: async (req, res) => {
    return res.json(req.account);
  },
};

module.exports = UserController;
