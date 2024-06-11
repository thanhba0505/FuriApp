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

  router.post("/add", middlewareController.verifyToken, PostController.addPost);

  // delete comment
  router.get(
    "/deletecomment/:postId/:commentId",
    middlewareController.verifyToken,
    (req, res) => PostController.deleteComment(req, res, io)
  );

  // interact
  router.post(
    "/interact/:postId",
    middlewareController.verifyToken,
    (req, res) => PostController.addInteraction(req, res)
  );

  router.post(
    "/addcomment/:postId",
    middlewareController.verifyToken,
    (req, res) => PostController.addComment(req, res, io)
  );

  return router;
};

module.exports = PostRoutes;
