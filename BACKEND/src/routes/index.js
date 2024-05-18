const User = require("./User");
const Account = require("./Account");

function route(app) {
  app.use("/api/user", User);
  app.use("/api/account", Account);
}

module.exports = route;
