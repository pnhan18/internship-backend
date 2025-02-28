const express = require("express");
const router = express.Router();
const { getAllCategoryNames } = require("../controllers/category.controller");

router.get("/api/categories/names", getAllCategoryNames);

module.exports = router;
