const router = require("express").Router();
const PostController = require("../controllers/PostController");
const middlewareController = require("../controllers/middlewareController");

router.get(
  "/:postId/:commentId",
  middlewareController.verifyToken,
  PostController.deleteComment
  );
router.get("/posts", middlewareController.verifyToken, PostController.getPosts);

router.post("/add", middlewareController.verifyToken, PostController.addPost);

router.post(
  "/:postId/interact",
  middlewareController.verifyToken,
  PostController.addInteraction
);

router.post(
  "/:postId/addcomment",
  middlewareController.verifyToken,
  PostController.addComment
);

module.exports = router;
