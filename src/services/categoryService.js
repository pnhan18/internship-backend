const Category = require("../models/Category.model");

class CategoryService {
  async getAllCategoryNames() {
    try {
      const categories = await Category.findAll({
        attributes: ["name"], // Chỉ lấy cột 'name'
      });
      return categories.map(cat => cat.name);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new CategoryService();
