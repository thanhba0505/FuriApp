const express = require("express");
const Account = require("../controllers/AccountController");
const middleware = require("../controllers/middlewareController");

const AccountRoutes = (io) => {
  const router = express.Router();

  router.post("/register", Account.registerAccount);
  router.post("/login", Account.loginAccount);
  router.post("/refresh", Account.requestRefreshToken);
  router.post("/logout", middleware.verifyToken, Account.logoutAccount);

  router.post("/avatar", middleware.verifyToken, Account.uploadAvatar);

  // Friends
  router.post("/friend/send", middleware.verifyToken, (req, res) =>
    Account.sendFriendRequest(req, res, io)
  );

  router.put("/friend/accept", middleware.verifyToken, (req, res) =>
    Account.acceptFriendRequest(req, res, io)
  );

  router.put("/friend/reject", middleware.verifyToken, (req, res) =>
    Account.rejectFriendRequest(req, res, io)
  );

  router.get("/friends", middleware.verifyToken, Account.getFriends);

  router.get("/nonfriends", middleware.verifyToken, Account.getNonFriends);

  router.get("/sent", middleware.verifyToken, Account.getSentFriendRequests);

  router.get(
    "/received",
    middleware.verifyToken,
    Account.getReceivedFriendRequests
  );

  return router;
};

module.exports = AccountRoutes;
