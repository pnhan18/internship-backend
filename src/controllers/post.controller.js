const PostService = require("../services/postService");
const { CREATED } = require("../core/success.response");

const searchPosts = async (req, res) => {
  try {
    const { categoryName, product_name, location, min_price, max_price, product_status, page, pageSize,newPost,status } = req.query;

    // Chuyển đổi giá trị số
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

    // Gọi service
    const result = await PostService.getALLPostsByFilters( filters, pagination,status);

    return res.status(200).json({ success: true, message: "Lấy bài đăng thành công", data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const getNewPosts = async (req, res) => {
  try {
    const latestPosts = await PostService.getLatestPosts();
    res.json({
      message: "Lấy 10 sản phẩm mới nhất thành công!",
      data: latestPosts,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};
const getPostById= async(req,res)=>{
  try {
    const postId = req.params.id;

    // Gọi Service để lấy dữ liệu
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

module.exports = {  searchPosts,getNewPosts,getPostById };
