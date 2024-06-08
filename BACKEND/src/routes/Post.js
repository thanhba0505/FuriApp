const router = require("express").Router();
const PostController = require("../controllers/PostController");
const middlewareController = require("../controllers/middlewareController");

router.get("/posts", middlewareController.verifyToken, PostController.getPosts);

router.post("/add", middlewareController.verifyToken, PostController.addPost);

  // delete comment
router.get(
  "/deletecomment/:postId/:commentId",
  middlewareController.verifyToken,
  PostController.deleteComment
  );

// interact
router.post(
  "/interact/:postId",
  middlewareController.verifyToken,
  PostController.addInteraction
);

router.post(
  "/addcomment/:postId",
  middlewareController.verifyToken,
  PostController.addComment
);

module.exports = router;
