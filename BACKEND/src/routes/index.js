const Account = require("./Account");
const Post = require("./Post");
const Story = require("./Story");

function route(app) {
  app.use("/api/account", Account);
  app.use("/api/post", Post);
  app.use("/api/story", Story);
}

module.exports = route;
