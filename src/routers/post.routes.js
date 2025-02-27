const express = require("express");
const postController = require("../controllers/post.controller");

const router = express.Router();
router.get("/api/posts/all", postController.searchPosts);//API lọc bài đăng theo tên danh mục http://localhost:4000/api/posts/all?location=New%20York&min_price=100&max_price=500000
router.get("/api/posts/newpost", postController.getNewPosts);
router.get("/api/post/:id", postController.getPostById);
module.exports = router;
