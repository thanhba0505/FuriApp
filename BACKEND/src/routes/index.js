const Account = require("./Account");
const Post = require("./Post");
const Story = require("./Story");
const Image = require("./Image");
const Conversation = require("./Conversation");
const Notification = require("./Notification");

function route(app, io) {
  app.use("/api/account", Account(io));
  app.use("/api/post", Post(io));
  app.use("/api/story", Story);
  app.use("/api/image", Image);
  app.use("/api/conversation", Conversation(io));
  app.use("/api/notify", Notification(io));
}

module.exports = route;
