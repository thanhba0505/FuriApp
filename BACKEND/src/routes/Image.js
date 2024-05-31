const express = require("express");
const router = express.Router();
const ImageController = require("../controllers/ImageController");

router.get("/:filename", ImageController.getImage);
router.get("/imagepost/:filename", ImageController.getImagePost);

module.exports = router;
