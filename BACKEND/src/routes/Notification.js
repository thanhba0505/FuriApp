const express = require("express");
const Notification = require("../controllers/NotificationController");
const middleware = require("../controllers/middlewareController");

const AccountRoutes = (io) => {
  const router = express.Router();

  router.get("/notifications", middleware.verifyToken, (req, res) =>
    Notification.getNotifications(req, res, io)
  );

  return router;
};

module.exports = AccountRoutes;
