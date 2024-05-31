const router = require("express").Router();
const PostController = require("../controllers/PostController");
const middlewareController = require("../controllers/middlewareController");

router.post("/add", middlewareController.verifyToken, PostController.addPost);
router.get("/posts", middlewareController.verifyToken, PostController.getPosts);

router.post(
  "/:postId/interact",
  middlewareController.verifyToken,
  PostController.addInteraction
);

router.get(
  "/:postId",
  middlewareController.verifyToken,
  PostController.getPostById
);

module.exports = router;
