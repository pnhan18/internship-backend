const PostService = require("../services/postService");
const { CREATED } = require("../core/success.response");

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

const createPost = async (req, res) => {
  const { user_id, category_id, title, product_name, description, price, product_status, location} = req.body;
  const images = req.files;
  const newPost = await PostService.createPost(user_id, category_id, title, product_name, description, price, product_status, location, images);
  new CREATED("Tạo bài đăng thành công", newPost).send(res);
}

module.exports = { searchPostsByProductName, createPost };
