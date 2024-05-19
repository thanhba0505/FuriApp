const User = require("./User");
const Account = require("./Account");
const Image = require("./Image");

function route(app) {
  app.use("/api/user", User);
  app.use("/api/account", Account);
  app.use("/api/image", Image);
}

module.exports = route;
