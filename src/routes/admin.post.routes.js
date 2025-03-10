const express = require("express");
const PostController = require("../controllers/post.controller");

const router = express.Router();

router.get("/admin/post/all", PostController.searchPosts);
router.get("/admin/post/:id", PostController.getPostById);
router.put("/admin/post/approve/:id",PostController.approvePost);
router.put("/admin/post/reject/:id",PostController.rejectPost);
router.put("/admin/post/delete/:id",PostController.deletePost);
router.get("/admin/post/get/report", PostController.getReported);
module.exports = router;