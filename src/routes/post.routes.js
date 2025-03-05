const express = require("express");
const validate = require("../middlewares/validate.middleware");
const postSchema = require("../validators/post.validator");
const { uploadMemory } = require("../config/multer.config");
const CatchAsync = require("../utils/CatchAsync");
const postController = require("../controllers/post.controller");

const router = express.Router();
router.post("/post/", uploadMemory.array("images"), validate(postSchema), CatchAsync(postController.createPost));
router.get("/post/all", postController.searchPosts);//API lọc bài đăng theo tên danh mục http://localhost:4000/api/post/all?location=New%20York&min_price=100&max_price=500000
router.get("/post/newpost", postController.getNewPosts);
router.get("/post/:id", postController.getPostById);

router.get("/search-suggestions", postController.getSuggestions);
module.exports = router;
