const Notification = require("../models/Notification");

const NotificationController = {
  getNotifications: async (req, res, io) => {
    const accountId = req.account.id;
    const limit = parseInt(req.query.limit) || 10; // Default limit to 10 if not provided

    try {
      const notifications = await Notification.find({ userId: accountId })
        .sort({ createdAt: -1 }) // Sort by latest first
        .limit(limit);

      return res.json({ status: 200, notifications });
    } catch (error) {
      console.log({ error });
      return res.json({ status: 500, message: "Internal Server Error", error });
    }
  },
};

module.exports = NotificationController;
