const Account = require("./Account");
const Post = require("./Post");
const Story = require("./Story");
const Conversation = require("./Conversation");
const Notification = require("./Notification");
const Start = require("./Start");

function route(app, io) {
  app.use("/", Start);
  app.use("/api/account", Account(io));
  app.use("/api/post", Post(io));
  app.use("/api/story", Story);
  app.use("/api/conversation", Conversation(io));
  app.use("/api/notification", Notification(io));
}

module.exports = route;
