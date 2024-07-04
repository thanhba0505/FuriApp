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
    "/postsbyid/:accountId",
    middlewareController.verifyToken,
    PostController.getPostByAccountId
  );

  router.get(
    "/postbyid/:postId",
    middlewareController.verifyToken,
    PostController.getPostById
  );

  router.post("/add", middlewareController.verifyToken, (req, res) =>
    PostController.addPost(req, res, io)
  );

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
