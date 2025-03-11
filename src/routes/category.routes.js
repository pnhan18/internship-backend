const express = require("express");
const CategoryController = require("../controllers/category.controller");
const router = express.Router();
router.get("/names", CategoryController.getAllCategoryNames);
router.get("/all", CategoryController.getAll);// Lấy danh sách danh mục
router.post("/admin/category/create", CategoryController.create);// Tạo danh mục mới
router.put("/admin/category/update/:id", CategoryController.update);// Cập nhật danh mục
router.delete("/admin/category/delete/:id", CategoryController.delete);// Xóa danh mục
module.exports = router;
