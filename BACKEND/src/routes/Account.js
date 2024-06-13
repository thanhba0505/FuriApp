const express = require("express");
const Account = require("../controllers/AccountController");
const middleware = require("../controllers/middlewareController");

const AccountRoutes = (io) => {
  const router = express.Router();

  router.post("/register", Account.registerAccount);
  router.post("/login", Account.loginAccount);
  router.post("/refresh", middleware.verifyToken, Account.requestRefreshToken);
  router.post("/logout", middleware.verifyToken, Account.logoutAccount);

  // send friend request
  router.post("/friend/send", middleware.verifyToken, (req, res) =>
    Account.sendFriendRequest(req, res, io)
  );

  // accept friend request
  router.put("/friend/accept", middleware.verifyToken, (req, res) =>
    Account.acceptFriendRequest(req, res, io)
  );

  // reject friend request
  router.put("/friend/reject", middleware.verifyToken, (req, res) =>
    Account.rejectFriendRequest(req, res, io)
  );

  // get list friend
  router.get("/friends", middleware.verifyToken, Account.getFriends);

  // get list non friend
  router.get("/nonfriends", middleware.verifyToken, Account.getNonFriends);

  return router;
};

module.exports = AccountRoutes;
