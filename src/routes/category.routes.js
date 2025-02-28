const express = require("express");
const router = express.Router();
const { getAllCategoryNames } = require("../controllers/category.controller");

router.get("/names", getAllCategoryNames);

module.exports = router;
