const express = require("express");
const router = express.Router();
const category= require("../controllers/category.controller");

router.get("/categories/names", category.getAllCategoryNames);

module.exports = router;
