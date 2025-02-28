const { Op } = require("sequelize");
const Post = require("../models/Post.model");
const Category = require("../models/Category.model");
const Post_images = require("../models/PostImage.model");
const User = require("../models/User.model");
const UserInfo = require("../models/UserInfo.model");
const Database = require('../database/mysql.database');
const UserService = require('./user.service')
const Sequelize = Database.getInstance().sequelize;

class PostService {
  static async getALLPostsByFilters( filters = {}, pagination = { page: 1, pageSize: 10 },status="active") {
    try {
      let whereCondition = {};
      let order = [];
  
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
      if (filters.newPost=="true") {
        order = [["created_at", "DESC"]];
      }
      whereCondition.status=status;
  
      // Phân trang
      const offset = (pagination.page - 1) * pagination.pageSize;
      const limit = pagination.pageSize;
  
      // Lấy danh sách bài đăng + tổng số lượng bài đăng
      const { count, rows } = await Post.findAndCountAll({
        where: whereCondition,
        limit,
        attributes: { exclude: ["product_name","description", "product_status","status","updated_at"] },
        offset,
        order,
        include: [
          {
            model: Post_images,  // Bảng chứa ảnh
            attributes: ["image_url"], // Chỉ lấy ảnh
            required: false,
            as: "images", // Không bắt buộc phải có ảnh
            where: { id: { [Op.eq]: Sequelize.literal(`(SELECT MIN(id) FROM post_images WHERE post_images.post_id = Post.id)`) } } // Chỉ lấy ảnh đầu tiên
          }
        ]
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
  static async getLatestPosts() {
    try {
      const latestPosts = await Post.findAll({
        attributes: { exclude: ["product_name","description", "product_status","status","updated_at"] },
        limit: 10, // Giới hạn 30 sản phẩm
        where: { status: "active" },
        order: [["created_at", "DESC"]], // Sắp xếp mới nhất trước
        include: [
          {
            model: Post_images,  // Bảng chứa ảnh
            attributes: ["image_url"], // Chỉ lấy ảnh
            required: false,
            as: "images", // Không bắt buộc phải có ảnh
            where: { id: { [Op.eq]: Sequelize.literal(`(SELECT MIN(id) FROM post_images WHERE post_images.post_id = Post.id)`) } } // Chỉ lấy ảnh đầu tiên
          }
        ]
      });

      return latestPosts;
    } catch (error) {
      throw new Error("Lỗi khi lấy sản phẩm mới nhất: " + error.message);
    }
  }
  static async getPostDetailById(postId) {
    try {
      const post = await Post.findOne({
        where: { id: postId },
        include: [
          {
            model: Category, // Lấy thông tin danh mục
            attributes: ["name","description"],
          },
          {
            model: Post_images, // Lấy danh sách ảnh bài đăng
            attributes: ["image_url"],
            as: "images",
          },
          {
            model: User, // Lấy thông tin người đăng bài
            attributes: ["email"],
            include: [
              {
                model: UserInfo, // Lấy thông tin chi tiết từ User_info
                attributes: ["name", "address", "phone","avatar_url","rating"],
              },
            ],
          },
        ],
      });
  
      return post; // Trả về bài đăng (hoặc null nếu không tìm thấy)
    } catch (error) {
      console.error("Lỗi lấy bài đăng:", error);
      throw new Error("Lỗi server");
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
