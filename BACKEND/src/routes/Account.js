const express = require("express");
const AccountController = require("../controllers/AccountController");
const middlewareController = require("../controllers/middlewareController");

const StoryRoutes = (io) => {
  const router = express.Router();

  router.post("/register", AccountController.registerAccount);
  router.post("/login", AccountController.loginAccount);
  router.post("/refresh", AccountController.requestRefreshToken);
  router.post(
    "/logout",
    middlewareController.verifyToken,
    AccountController.logoutAccount
  );

  // send friend request
  router.post("/friend/send", middlewareController.verifyToken, (req, res) =>
    AccountController.sendFriendRequest(req, res, io)
  );

  // accept friend request
  router.post("/friend/accept", middlewareController.verifyToken, (req, res) =>
    AccountController.acceptFriendRequest(req, res, io)
  );

  // reject friend request
  router.post("/friend/reject", middlewareController.verifyToken, (req, res) =>
    AccountController.rejectFriendRequest(req, res, io)
  );

  return router;
};

module.exports = StoryRoutes;
