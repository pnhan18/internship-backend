const { Op } = require("sequelize");
const Post = require("../models/Post.model");
const Category = require("../models/Category.model");
const Post_images = require("../models/PostImage.model");
const User = require("../models/User.model");
const Report = require("../models/Report.model");
const Favorite = require("../models/Favorite.model");
const UserInfo = require("../models/UserInfo.model");
const Database = require('../database/mysql.database');
const PostImage = require("../models/PostImage.model");
const { BadRequestError } = require("../core/error.response");
const UserService = require('./user.service')
const Sequelize = Database.getInstance().sequelize;
const UploadService = require('./Upload.service');

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
        whereCondition.location = { [Op.like]: `%${filters.location}%` };
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
    const transaction = await Sequelize.transaction();
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
        const url = await UploadService.uploadImageFromLocal({ file: image });
        await Post_images.create({ post_id: newPost.id, image: url }, { transaction });
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
  static async approvePostById(postId) {
    try {
      const post = await Post.findByPk(postId);
      if (!post) {
        throw new Error("Bài đăng không tồn tại");
      }
  
      post.status = "active";
      const updatedPost = await post.save();
  
      if (!updatedPost) {
        throw new Error("Không thể cập nhật trạng thái bài đăng");
      }
  
      return updatedPost;
    } catch (error) {
      console.error("Lỗi duyệt bài đăng:", error.message);
      throw new Error("Đã xảy ra lỗi khi duyệt bài đăng. Vui lòng thử lại!");
    }
  }
  
  static async rejectPostById(postId) {
    console.log("tooi da ow day");
    const post = await Post.findByPk(postId);
    if (!post) throw new Error("Bài đăng không tồn tại");
    post.status = "rejected";
    await post.save();
    return post;
  }

  static async deletePostById(postId) {
    const post = await Post.findByPk(postId);
    if (!post) throw new Error("Bài đăng không tồn tại");

    post.status = "deleted";
    await post.save();
    return post;
  }
  static async getReportedPost() {
    try {
      const reports = await Report.findAll({
        include: [
          {
            model: Post,
            attributes: ["id", "title", "product_name", "description", "price"],
            required: false, // Lấy cả báo cáo của bài đăng đã bị xóa
          },
          {
            model: User,
            attributes: ["id", "email"],
          },
        ],
      });

      return reports;
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách báo cáo:", error);
      throw new Error("Không thể lấy danh sách báo cáo");
    }
  }
  static async getPostsByUserEmail(email, status) {
    try {
      // Tìm user theo email
      const user = await User.findOne({ where: { email } });
      if (!user) {
          return { success: false, message: 'Người dùng không tồn tại' };
      }

      // Điều kiện lọc
      const whereCondition = { user_id: user.id };
      if (status) {
          whereCondition.status = status; // Lọc theo trạng thái nếu có
      }

      // Lấy danh sách bài đăng với điều kiện lọc
      const posts = await Post.findAll({ 
        where: whereCondition,
        order: [["created_at", "DESC"]],
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

      return { success: true, data: posts };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Lỗi server' };
    }
  }
  static async updatePost(postId, updateData) {
    try {
        // Tìm bài đăng và kiểm tra quyền sở hữu
        const post = await Post.findOne({ where: { id: postId } });
        if (!post) {
            return { success: false, message: 'Bài đăng không tồn tại ' };
        }

        // Cập nhật bài đăng
        await post.update(updateData);

        return { success: true, message: 'Cập nhật bài đăng thành công', data: post };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Lỗi server' };
    }
  }
  static async addFavorite(email, postId) {
    try {
        // Kiểm tra người dùng tồn tại
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return { success: false, message: "Người dùng không tồn tại." };
        }

        // Kiểm tra bài đăng tồn tại
        const post = await Post.findByPk(postId);
        if (!post) {
            return { success: false, message: "Bài đăng không tồn tại." };
        }

        // Kiểm tra xem bài đăng đã được thêm vào yêu thích chưa
        const existingFavorite = await Favorite.findOne({
            where: { user_id: user.id, post_id: postId }
        });

        if (existingFavorite) {
            return { success: false, message: "Bài đăng đã có trong danh sách yêu thích." };
        }

        // Thêm bài đăng vào danh sách yêu thích
        await Favorite.create({
            user_id: user.id,
            post_id: postId,
            status: 'saved'
        });

        return { success: true, message: "Đã thêm vào danh sách yêu thích." };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Lỗi server." };
    }
  }
  static async removeFavorite(email, post_id) {
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return false;
        }

        const deleted = await Favorite.destroy({ 
            where: { user_id: user.id, post_id } 
        });

        return deleted > 0; 
    } catch (error) {
        console.error("Lỗi khi xóa bài đăng yêu thích:", error);
        throw error;
    }
  }
  static async getFavoriteList(email) {
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
          return { success: false, message: "Không tìm thấy người dùng." };
        }

        const favorites = await Favorite.findAll({
            where: { user_id: user.id },
            include: [
                {
                    model: Post,
                    attributes: ['id', 'title', 'product_name', 'description', 'price', 'location', 'status'],
                    include: [
                      {
                        model: Post_images,  // Bảng chứa ảnh
                        attributes: ["image_url"], // Chỉ lấy ảnh
                        required: false,
                        as: "images", // Không bắt buộc phải có ảnh
                        where: { id: { [Op.eq]: Sequelize.literal(`(SELECT MIN(id) FROM post_images WHERE post_images.post_id = Post.id)`) } } // Chỉ lấy ảnh đầu tiên
                      }
                    ]
                }
                
            ]
        });

        return favorites.map(fav => fav.Post);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách yêu thích:", error);
        throw error;
    }
  }
  static async getSuggestions(query) {
    if (!query) return [];
    return await Post.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('product_name')), 'product_name']], // Lấy giá trị duy nhất
      where: {
        product_name: { [Op.regexp]: `(^| )${query}` }
      },
      order: [["product_name", "ASC"]],
      limit: 5
    });
  }
}

module.exports = PostService;
