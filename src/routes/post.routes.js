const express = require("express");
const validate = require("../middlewares/validate.middleware");
const postSchema = require("../validators/post.validator");
const { uploadMemory } = require("../config/multer.config");
const CatchAsync = require("../utils/CatchAsync");
const postController = require("../controllers/post.controller");

const router = express.Router();

router.get("/all", postController.searchPosts);//API lọc bài đăng theo tên danh mục http://localhost:4000/api/post/all?location=New%20York&min_price=100&max_price=500000
router.get("/newpost", postController.getNewPosts);
router.get("/search-suggestions", postController.Suggestions);
router.get("/detail/:id", postController.getPostById);
router.put('/update/:postId', postController.updatePost);
router.post('/addfavorite',postController.addFavorite);
router.get("/:email", postController.getPostsByUserEmail);
router.delete('/removefavorite', postController.removeFavorite);
router.get('/getfavorite', postController.getFavoriteList);
router.post("/", uploadMemory.array("images"), validate(postSchema), CatchAsync(postController.createPost));

module.exports = router;
