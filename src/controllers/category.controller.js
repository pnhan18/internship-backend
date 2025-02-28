const CategoryService = require("../services/categoryService");

const getAllCategoryNames = async (req, res) => {
  try {
    const categoryNames = await CategoryService.getAllCategoryNames();
    res.json(categoryNames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllCategoryNames };