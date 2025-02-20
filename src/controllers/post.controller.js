const PostService = require("../services/postService");

const searchPosts = async (req, res) => {
  try {
    const { categoryName, product_name, location, min_price, max_price, product_status, page, pageSize } = req.query;

    // Chuyển đổi giá trị số
    const filters = {
      categoryName,
      product_name,
      location,
      minPrice: min_price ? parseFloat(min_price) : undefined,
      maxPrice: max_price ? parseFloat(max_price) : undefined,
      product_status,
    };

    const pagination = {
      page: page ? parseInt(page) : 1,
      pageSize: pageSize ? parseInt(pageSize) : 10,
    };

    // Gọi service
    const result = await PostService.getALLPostsByFilters( filters, pagination);

    return res.status(200).json({ success: true, message: "Lấy bài đăng thành công", data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {  searchPosts };
