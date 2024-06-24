const express = require("express");
const Conversation = require("../controllers/ConversationController");
const middleware = require("../controllers/middlewareController");

const ConversationRoutes = (io) => {
  const router = express.Router();

  // add message
  router.post("/message", middleware.verifyToken, (req, res) =>
    Conversation.addMessage(req, res, io)
  );

  // get message
  router.get("/messages/:conversationId", middleware.verifyToken, (req, res) =>
    Conversation.getMessages(req, res, io)
  );

  // read message
  router.put("/message/read", middleware.verifyToken, (req, res) =>
    Conversation.readMessage(req, res, io)
  );

  return router;
};

module.exports = ConversationRoutes;
