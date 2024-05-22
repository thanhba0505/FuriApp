const router = require("express").Router();
const PostController = require("../controllers/PostController");
const middlewareController = require("../controllers/middlewareController");

router.post("/add", middlewareController.verifyToken, PostController.addPost);

module.exports = router;
