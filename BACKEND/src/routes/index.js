const User = require("./User");
const Account = require("./Account");
const Image = require("./Image");
const Post = require('./Post');

function route(app) {
  app.use("/api/user", User);
  app.use("/api/account", Account);
  app.use("/api/image", Image);
  app.use("/api/post", Post);
}

module.exports = route;
