const express = require("express");
const cors = require("cors");
const appConfig = require("./config/app.config");
const Database = require("./database/mysql.database");
const postRoutes = require("./routers/post.routes");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

// Middleware
app.use(cors()); // Hỗ trợ CORS
app.use(express.json()); // Xử lý JSON request body
app.use(express.urlencoded({ extended: true })); // Hỗ trợ xử lý form data

// Kết nối cơ sở dữ liệu
Database.getInstance();

// Routes
app.use("/api/posts", postRoutes);

// Middleware xử lý lỗi
app.use(errorMiddleware);

// Khởi chạy server
const PORT = appConfig.port || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
