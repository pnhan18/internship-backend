const PostService = require("../services/postService");

const searchPostsByProductName = async (req, res) => {
  try {
    const { product_name, product_status } = req.query;

    const posts = await PostService.searchPosts(product_name, product_status);

    if (posts.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy bài đăng nào." });
    }

    res.status(200).json({ posts });
  } catch (error) {
    res.status(400).json({ message: error.message || "Lỗi server." });
  }
};

module.exports = { searchPostsByProductName };
