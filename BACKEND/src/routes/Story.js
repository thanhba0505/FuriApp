const router = require("express").Router();
const StoryController = require("../controllers/StoryController");
const middlewareController = require("../controllers/middlewareController");

router.post("/", middlewareController.verifyToken, StoryController.addStory);
router.get("/", middlewareController.verifyToken, StoryController.getStories);

module.exports = router;
