const express = require("express");
const Notification = require("../controllers/NotificationController");
const middleware = require("../controllers/middlewareController");

const NotificationRouters = (io) => {
  const router = express.Router();

  router.get("/", middleware.verifyToken, (req, res) =>
    Notification.getNotifications(req, res, io)
  );

  return router;
};

module.exports = NotificationRouters;
