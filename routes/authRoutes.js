const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.get("/login", authController.loginPage);
router.post("/login", authController.loginPost);
router.get("/logout", authController.logout);

module.exports = router;