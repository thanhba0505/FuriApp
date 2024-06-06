const Account = require("./Account");
const Post = require('./Post');

function route(app) {
  app.use("/api/account", Account);
  app.use("/api/post", Post);
}

module.exports = route;
