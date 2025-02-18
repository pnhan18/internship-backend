const express = require("express");
const { searchPostsByProductName } = require("../controllers/post.controller");

const router = express.Router();

router.get("/search", searchPostsByProductName);

module.exports = router;
