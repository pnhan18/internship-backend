const { Op } = require("sequelize");
const Post = require("../models/Post");
const PostImage = require("../models/PostImage.model");
const sequelize = require('../database/mysql.database').getInstance().sequelize;
const {BadRequestError} = require("../core/error.response");
const UploadService = require("./Upload.service");

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

  static async createPost(user_id, category_id, title, product_name, description, price, product_status, location, images) {
    const transaction = await sequelize.transaction();
    try {
      const newPost = await Post.create({
        user_id,
        category_id,
        title,
        product_name,
        description,
        price: Number(price),
        product_status,
        location,
      }, { transaction });

      const imageUrls = await Promise.all(images.map(async (image) => {
        const { imageName, url } = await UploadService.uploadImageFromLocal({ file: image });
        await PostImage.create({ post_id: newPost.id, image: imageName }, { transaction });
        return url
      }));

      await transaction.commit();

      return {
        post: {
          ...newPost.dataValues,
          images: imageUrls
        }
      };
    } catch (error) {
      console.error(error);
      await transaction.rollback();
      throw new BadRequestError("Đã xảy ra lỗi khi tạo bài đăng, vui lòng thử lại.");
    }
  }

}

module.exports = PostService;
