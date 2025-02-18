const { Op } = require("sequelize");
const Post = require("../models/Post");

class PostService {
  static async searchPosts(product_name, product_status) {
    try {
      if (!product_name) {
        throw new Error("Vui lòng nhập tên sản phẩm.");
      }

      // Điều kiện tìm kiếm
      let whereCondition = {
        product_name: { [Op.like]: `%${product_name}%` }, // Tìm kiếm gần đúng
      };

      // Nếu có trạng thái sản phẩm, thêm vào điều kiện lọc
      if (product_status) {
        whereCondition.product_status = product_status;
      }

      const posts = await Post.findAll({ where: whereCondition });

      return posts;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PostService;
