const Category = require("../models/Category.model");

class CategoryService {
  static async getAllCategories() {
    return await Category.findAll();
  }

  static async getCategoryById(id) {
    return await Category.findByPk(id);
  }

  static async createCategory(data) {
    return await Category.create(data);
  }

  static async updateCategory(id, data) {
    const category = await Category.findByPk(id);
    if (!category) return null;

    await category.update(data);
    return category;
  }

  static async deleteCategory(id) {
    const category = await Category.findByPk(id);
    if (!category) return false;

    await category.destroy();
    return true;
  }
}

module.exports = CategoryService;
