const Account = require("../models/Account");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const ConversationController = {
  addMessage: async (req, res, io) => {
    try {
      const senderId = req.account.id;
      const { conversationId, content } = req.body;

      const conversation = await Conversation.findById(conversationId).populate(
        {
          path: "participants",
          select: "fullname",
        }
      );

      if (!conversation) {
        return res.json({
          status: 404,
          message: "Conversation does not exist",
        });
      }

      if (
        !conversation.participants.some((participant) =>
          participant._id.equals(senderId)
        )
      ) {
        return res.json({
          status: 403,
          message: "You are not part of this conversation",
        });
      }

      if (!content || content.trim() === "") {
        return res.json({
          status: 400,
          message: "Message content cannot be empty",
        });
      }

      const newMessage = new Message({
        conversation: conversationId,
        sender: senderId,
        content,
      });

      await newMessage.save();

      conversation.messages.push(newMessage._id);

      conversation.read = [senderId];

      await conversation.save();

      const participants = conversation.participants || [];

      participants.forEach((participant) => {
        io.emit("newMess" + participant._id, {
          sender: senderId,
          conversation: conversationId,
          fullname: participant.fullname,
        });
      });

      return res.json({
        status: 200,
        message: "Message sent successfully",
      });
    } catch (error) {
      console.log(error);
      return res.json({ status: 500, message: "Internal Server Error", error });
    }
  },

  getMessages: async (req, res, io) => {
    const limit = parseInt(req.query._limit) || 10;
    const skip = parseInt(req.query._skip) || 0;

    try {
      const accountId = req.account.id;
      const { conversationId } = req.params;

      const conversation = await Conversation.findById(conversationId)
        .populate({
          path: "messages",
          select: "_id sender content updatedAt",
          populate: {
            path: "sender",
            select: "fullname avatar",
          },
          options: {
            sort: { updatedAt: -1 },
            limit: limit,
            skip: skip,
          },
        })
        .populate({
          path: "participants",
          select: "_id username fullname avatar",
        });

      if (!conversation) {
        return res.json({
          status: 404,
          message: "Conversation does not exist",
        });
      }

      const exists = conversation.participants.some(
        (account) => account._id.toString() === accountId
      );

      if (!exists) {
        return res.json({
          status: 403,
          message: "You are not part of this conversation",
        });
      }

      if (!conversation.read.includes(accountId)) {
        conversation.read.push(accountId);
        await conversation.save();
      }

      if (conversation.participants) {
        conversation.participants.sort((a, b) => {
          if (a._id.toString() === accountId) return -1;
          if (b._id.toString() === accountId) return 1;
          return 0;
        });
      }

      io.emit("seenMess" + accountId);

      return res.json({
        status: 200,
        message: "Get messages successfully",
        conversation: conversation,
      });
    } catch (error) {
      console.log(error);
      return res.json({ status: 500, message: "Internal Server Error" });
    }
  },

  readMessage: async (req, res, io) => {
    try {
      const accountId = req.account.id;
      const { conversationId } = req.body;

      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        return res.json({
          status: 404,
          message: "Conversation does not exist",
        });
      }

      const isParticipant = conversation.participants.includes(accountId);
      if (!isParticipant) {
        return res.json({
          status: 403,
          message: "You are not part of this conversation",
        });
      }

      if (!conversation.read.includes(accountId)) {
        conversation.read.push(accountId);
      }

      await conversation.save();

      io.emit("newMess" + conversationId + accountId, { read: true });

      return res.json({
        status: 200,
        message: "Message marked as read",
      });
    } catch (error) {
      console.log(error);
      return res.json({ status: 500, message: "Internal Server Error", error });
    }
  },
};

module.exports = ConversationController;
