const router = require("express").Router();
const UserController = require("../controllers/UserController");
const middlewareController = require("../controllers/middlewareController");

router.get("/", middlewareController.verifyToken, UserController.addUser);

module.exports = router;
