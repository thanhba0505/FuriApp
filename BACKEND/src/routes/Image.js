const router = require("express").Router();
const ImageController = require("../controllers/ImageController");
const middlewareController = require("../controllers/middlewareController");

router.get(
  "/:folder/:filename",
  middlewareController.verifyToken,
  ImageController.getImage
);

module.exports = router;
