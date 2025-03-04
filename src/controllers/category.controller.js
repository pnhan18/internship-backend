const CategoryService = require("../services/categoryService");

class CategoryController {
    static async getAllCategoryNames(req, res) {
        try {
            const categoryNames = await CategoryService.getAllCategoryNames();
            res.json(categoryNames);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = CategoryController;