const Notification = require("../models/Notification");

const NotificationController = {
  getNotifications: async (req, res, io) => {
    const accountId = req.account.id;
    const limit = parseInt(req.query._limit) || 10;

    try {
      const notifications = await Notification.find({ user: accountId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate({
          path: "data.sender",
          select: "fullname username avatar",
        });

      return res.json({
        status: 200,
        message: "Get notification successful",
        notifications: notifications,
      });
    } catch (error) {
      console.log({ error });
      return res.json({ status: 500, message: "Internal Server Error", error });
    }
  },
};

module.exports = NotificationController;
