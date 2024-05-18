const router = require("express").Router();
const AccountController = require("../controllers/AccountController");
const middlewareController = require("../controllers/middlewareController");

router.post("/register", AccountController.registerAccount);
router.post("/login", AccountController.loginAccount);
router.post("/refresh", AccountController.requestRefreshToken);
router.post(
  "/logout",
  middlewareController.verifyToken,
  AccountController.logoutAccount
);

module.exports = router;
