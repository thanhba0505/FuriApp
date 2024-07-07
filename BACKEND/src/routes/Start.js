const router = require("express").Router();

router.get("/", (req, res) => res.json({message: "Connection successful"}));

module.exports = router;
