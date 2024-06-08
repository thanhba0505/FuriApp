const Account = require("./Account");
const Post = require("./Post");
const Story = require("./Story");
const Image = require("./Image");

function route(app, io) {
  app.use("/api/account", Account);
  app.use("/api/post", Post(io));
  app.use("/api/story", Story);
  app.use("/api/image", Image);
}

module.exports = route;
