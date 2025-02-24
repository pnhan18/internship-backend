const express = require("express");
const { searchPostsByProductName, createPost } = require("../controllers/post.controller");
const validate = require("../middlewares/validate.middleware");
const postSchema = require("../validators/post.validator");
const { uploadMemory } = require("../config/multer.config");
const CatchAsync = require("../utils/CatchAsync");

const router = express.Router();

router.get("/search", searchPostsByProductName);
router.post("/", uploadMemory.array("images"), validate(postSchema), CatchAsync(createPost));

module.exports = router;
