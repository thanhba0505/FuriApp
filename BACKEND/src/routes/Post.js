const express = require("express");
const PostController = require("../controllers/PostController");
const middlewareController = require("../controllers/middlewareController");

const PostRoutes = (io) => {
  const router = express.Router();

  router.get(
    "/posts",
    middlewareController.verifyToken,
    PostController.getPosts
  );

  router.get(
    "/account/:accountId",
    middlewareController.verifyToken,
    PostController.getPostByAccountId
  );

  router.get(
    "/:postId",
    middlewareController.verifyToken,
    PostController.getPostById
  );

  router.post("/", middlewareController.verifyToken, (req, res) =>
    PostController.addPost(req, res, io)
  );

  // delete comment
  router.delete(
    "/deletecomment/:postId/:commentId",
    middlewareController.verifyToken,
    (req, res) => PostController.deleteComment(req, res, io)
  );

  // interact
  router.post(
    "/:postId/interaction",
    middlewareController.verifyToken,
    (req, res) => PostController.addInteraction(req, res)
  );

  router.post(
    "/:postId/comment",
    middlewareController.verifyToken,
    (req, res) => PostController.addComment(req, res, io)
  );

  return router;
};

module.exports = PostRoutes;
