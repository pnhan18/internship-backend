const { Op } = require("sequelize");
const Post = require("../models/Post");
const Category = require("../models/Category");
class PostService {
  static async getALLPostsByFilters( filters = {}, pagination = { page: 1, pageSize: 10 }) {
    try {
      let whereCondition = {};
  
      // Nếu có categoryName, tìm category_id
      if (filters.categoryName) {
        const category = await Category.findOne({
          where: { name: { [Op.like]: `%${filters.categoryName}%` } }
        });
  
        if (!category) {
          return { error: 'Category không tồn tại' };
        }
  
        whereCondition.category_id = category.id;
      }
  
      // Áp dụng các bộ lọc
      if (filters.product_name) {
        whereCondition.product_name = { [Op.like]: `%${filters.product_name}%` };
      }
      if (filters.location) {
        whereCondition.location = filters.location;
      }
      if (filters.minPrice) {
        whereCondition.price = { [Op.gte]: filters.minPrice };
      }
      if (filters.maxPrice) {
        whereCondition.price = { ...whereCondition.price, [Op.lte]: filters.maxPrice };
      }
      if (filters.product_status) {
        whereCondition.product_status = filters.product_status;
      }
  
      // Phân trang
      const offset = (pagination.page - 1) * pagination.pageSize;
      const limit = pagination.pageSize;
  
      // Lấy danh sách bài đăng + tổng số lượng bài đăng
      const { count, rows } = await Post.findAndCountAll({
        where: whereCondition,
        limit,
        offset
      });
  
      return {
        totalItems: count,
        totalPages: Math.ceil(count / pagination.pageSize),
        currentPage: pagination.page,
        pageSize: pagination.pageSize,
        data: rows,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Lỗi server');
    }
  }
  
}

module.exports = PostService;
