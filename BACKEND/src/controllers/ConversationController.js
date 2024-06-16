const Account = require("../models/Account");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const ConversationController = {
  addMessage: async (req, res, io) => {
    const pathAccount = "accountImage/";

    try {
      const senderId = req.account.id;
      const { conversationId, content } = req.body;

      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        return res.json({
          status: 404,
          message: "Conversation does not exist",
        });
      }

      if (!conversation.participants.includes(senderId)) {
        return res.json({
          status: 403,
          message: "You are not part of this conversation",
        });
      }

      const newMessage = new Message({
        conversation: conversationId,
        sender: senderId,
        content,
      });

      await newMessage.save();

      conversation.messages.push(newMessage._id);
      await conversation.save();

      const populatedMessage = await Message.findById(newMessage._id).populate(
        "sender",
        "fullname avatar"
      );

      if (populatedMessage.sender.avatar) {
        populatedMessage.sender.avatar =
          pathAccount + populatedMessage.sender.avatar;
      }

      io.to(conversationId).emit("newMessage", populatedMessage);

      return res.json({
        status: 200,
        message: "Message sent successfully",
        newMessage: populatedMessage,
      });
    } catch (error) {
      console.log(error);
      return res.json({ status: 500, message: "Internal Server Error", error });
    }
  },

  getMessages: async (req, res) => {
    const limit = parseInt(req.query._limit) || 10;
    const skip = parseInt(req.query._skip) || 0;
    const pathAccount = "accountImage/";

    try {
      const senderId = req.account.id;
      const { conversationId } = req.params;

      const conversation = await Conversation.findById(conversationId).populate(
        {
          path: "messages",
          populate: {
            path: "sender",
            select: "fullname avatar",
          },
          options: {
            sort: { createdAt: -1 },
            limit: limit,
            skip: skip,
          },
        }
      );

      if (!conversation) {
        return res.json({
          status: 404,
          message: "Conversation does not exist",
        });
      }

      if (!conversation.participants.includes(senderId)) {
        return res.json({
          status: 403,
          message: "You are not part of this conversation",
        });
      }

      if (conversation.messages) {
        conversation.messages.forEach((message) => {
          if (
            message.sender &&
            message.sender.avatar &&
            !message.sender.avatar.startsWith(pathAccount)
          ) {
            message.sender.avatar = pathAccount + message.sender.avatar;
          }
        });
      }

      return res.json({
        status: 200,
        message: "Get messages successfully",
        messages: conversation.messages,
      });
    } catch (error) {
      console.log(error);
      return res.json({ status: 500, message: "Internal Server Error", error });
    }
  },
};

module.exports = ConversationController;
