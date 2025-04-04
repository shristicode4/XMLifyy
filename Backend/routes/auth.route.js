const express = require("express");
const {
  login,
  logout,
  signup,
  checkAuth,
} = require("../controllers/auth.controller.js");
const { protectRoute } = require("../middleware/auth.middleware.js");

const router = express.Router();
router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/check", checkAuth);

module.exports = router;
