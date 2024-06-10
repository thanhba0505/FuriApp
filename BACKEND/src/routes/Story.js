const router = require("express").Router();
const StoryController = require("../controllers/StoryController");
const middlewareController = require("../controllers/middlewareController");

router.post("/add", middlewareController.verifyToken, StoryController.addStory);
router.get("/stories", middlewareController.verifyToken, StoryController.getStories);

module.exports = router;
