const categoryService = require("../services/categoryService");
class CategoryController {
  static async getAll(req, res) {
    try {
      const categories = await categoryService.getAllCategories();
      res.status(200).json({ success: true, data: categories });
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách danh mục:", error);
      res.status(500).json({ success: false, message: "Lỗi server!" });
    }
  }

  static async getCategory(req, res) {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      if (!category) return res.status(404).json({ success: false, message: "Danh mục không tồn tại!" });

      res.status(200).json({ success: true, data: category });
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh mục:", error);
      res.status(500).json({ success: false, message: "Lỗi server!" });
    }
  }

  static async create(req, res) {
    try {
      const newCategory = await categoryService.createCategory(req.body);
      res.status(201).json({ success: true, data: newCategory });
    } catch (error) {
      console.error("❌ Lỗi khi tạo danh mục:", error);
      res.status(500).json({ success: false, message: "Lỗi server!" });
    }
  }

  static async update(req, res) {
    try {
      const updatedCategory = await categoryService.updateCategory(req.params.id, req.body);
      if (!updatedCategory) return res.status(404).json({ success: false, message: "Danh mục không tồn tại!" });

      res.status(200).json({ success: true, data: updatedCategory });
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật danh mục:", error);
      res.status(500).json({ success: false, message: "Lỗi server!" });
    }
  }

  static async delete(req, res) {
    try {
      const isDeleted = await categoryService.deleteCategory(req.params.id);
      if (!isDeleted) return res.status(404).json({ success: false, message: "Danh mục không tồn tại!" });
      res.status(200).json({ success: true, message: "Xóa danh mục thành công!" });
    } catch (error) {
      console.error("❌ Lỗi khi xóa danh mục:", error);
      res.status(500).json({ success: false, message: "Lỗi server!" });
    }
  }
  static async getAllCategoryNames(req, res) {
    try {
        const categoryNames = await categoryService.getAllCategories();
          res.json(categoryNames);
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  }
}
module.exports = CategoryController;