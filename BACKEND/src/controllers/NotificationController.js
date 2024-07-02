const Notification = require("../models/Notification");

const NotificationController = {
  getNotifications: async (req, res, io) => {
    const accountId = req.account.id;
    const limit = parseInt(req.query._limit) || 10;
    const pathAccount = "accountImage/";

    try {
      const notifications = await Notification.find({ user: accountId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate({
          path: "data.sender",
          select: "fullname username avatar",
        });

      const updatedNotifications = notifications.map((notification) => {
        if (notification.data.sender && notification.data.sender.avatar) {
          notification.data.sender.avatar =
            pathAccount + notification.data.sender.avatar;
        }
        return notification;
      });

      return res.json({
        status: 200,
        message: "Get notification successful",
        notifications: updatedNotifications,
      });
    } catch (error) {
      console.log({ error });
      return res.json({ status: 500, message: "Internal Server Error", error });
    }
  },
};

module.exports = NotificationController;
