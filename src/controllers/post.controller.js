const PostService = require("../services/postService");
const { CREATED } = require("../core/success.response");

class postController {
  static async searchPosts(req, res) {
    try {
      const { categoryName, product_name, location, min_price, max_price, product_status, page, pageSize, newPost, status } = req.query;

      const filters = {
        categoryName,
        product_name,
        location,
        minPrice: min_price ? parseFloat(min_price) : undefined,
        maxPrice: max_price ? parseFloat(max_price) : undefined,
        product_status,
        newPost
      };

      const pagination = {
        page: page ? parseInt(page) : 1,
        pageSize: pageSize ? parseInt(pageSize) : 10,
      };

      const result = await PostService.getALLPostsByFilters(filters, pagination, status);

      return res.status(200).json({ success: true, message: "Lấy bài đăng thành công", data: result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getNewPosts(req, res) {
    try {
      const latestPosts = await PostService.getLatestPosts();
      res.json({
        message: "Lấy 10 sản phẩm mới nhất thành công!",
        data: latestPosts,
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server: " + error.message });
    }
  }

  static async getPostById(req, res) {
    try {
      const postId = req.params.id;
      const post = await PostService.getPostDetailById(postId);

      if (!post) {
        return res.status(404).json({ error: "Bài đăng không tồn tại hoặc đã bị xóa" });
      }

      return res.json({ success: true, data: post });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Lỗi server" });
    }
  }

  static async createPost(req, res) {
    const { user_id, category_id, title, product_name, description, price, product_status, location } = req.body;
    const images = req.files;
    const newPost = await PostService.createPost(user_id, category_id, title, product_name, description, price, product_status, location, images);
    new CREATED("Tạo bài đăng thành công", newPost).send(res);
  }

  static async approvePost(req, res) {
    try {
        const { id } = req.params;
        const post = await PostService.approvePostById(id);
        res.json({ message: "Bài đăng đã được duyệt", post });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
  }
  static async rejectPost(req, res) {
    try {
        const { id } = req.params;
        const post = await PostService.rejectPostById(id);
        res.json({ message: "Bài đăng đã bị từ chối", post });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
  }
  static async deletePost(req, res) {
    try {
        const { id } = req.params;
        const post = await PostService.deletePostById(id);
        res.json({ message: "Bài đăng đã được xóa", post });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
  }
  static async getReported(req, res) {
    try {
      const result = await PostService.getReportedPost();
      if (!result.success) {
        return res.status(404).json(result);
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: "Bài đăng đã được xóa" });
    }
    
  }
  static async getPostsByUserEmail(req, res) {
    const { email } = req.params;
    const { status } = req.query; // Lấy trạng thái từ query parameter

    const result = await PostService.getPostsByUserEmail(email, status);

    if (!result) {
      return res.status(404).json({ message: "Không có bài đăng nào" });
    }

    res.json(result.data);
  }
  static async updatePost(req, res) {
    const { postId } = req.params;
    const {...updateData } = req.body; // Lấy email và dữ liệu cập nhật từ body

    const result = await PostService.updatePost(postId, updateData);

    if (!result.success) {
        return res.status(400).json({ message: result.message });
    }

    res.json(result);
  }
  static async addFavorite(req, res) {
    try {
        const { email, postId } = req.body;

        if (!email || !postId) {
            return res.status(400).json({ success: false, message: "Email và postId là bắt buộc." });
        }

        const result = await PostService.addFavorite(email, postId);

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(201).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Lỗi server." });
    }
  }
  static async removeFavorite(req, res) {
    try {
        const { email, post_id } = req.body;
        if (!email || !post_id) {
            return res.status(400).json({ message: "Email và post_id là bắt buộc." });
        }

        const result = await PostService.removeFavorite(email, post_id);
        if (result) {
            return res.json({ message: "Bài đăng yêu thích đã được xóa." });
        } else {
            return res.status(404).json({ message: "Không tìm thấy bài đăng yêu thích." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server!" });
    }
  }
  static async getFavoriteList(req, res) {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ message: "Email là bắt buộc." });
        }

        const favorites = await PostService.getFavoriteList(email);
        return res.json({ data: favorites });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server!" });
    }
  }
  static async Suggestions(req, res) {
    try {
      const { query } = req.query;
      const suggestions = await PostService.getSuggestions(query);
      return res.json(suggestions.map(s => s.product_name));
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = postController;
