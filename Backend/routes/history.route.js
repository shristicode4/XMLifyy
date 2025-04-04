const express = require("express");
const router = express.Router();
const { getHistory } = require("../controllers/history.controller");

router.get("/", getHistory);

module.exports = router;
