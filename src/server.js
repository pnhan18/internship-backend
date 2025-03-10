const express = require('express');
const appConfig = require('./config/app.config');
const Database = require('./database/mysql.database');
const AuthRoutes = require('./routes/Auth.routes');
const handleErrorsMiddeleware = require('./middlewares/error.middleware');
const cors = require("cors");
const postRoutes = require("./routes/post.routes");
const userRoutes = require("./routes/user.routes");
const categories = require("./routes/category.routes");
const adminUserRoutes= require("./routes/admin.user.routes");
const adminPostRoutes = require("./routes/admin.post.routes");
const reportRoutes = require("./routes/report.routes");
const errorMiddleware = require('./middlewares/error.middleware');
const { NotFoundRequestError } = require('./core/error.response');
const reviewRoutes = require('./routes/Review.routes');

const app = express();

// Middleware
app.use(cors({
  origin: '*', 
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
})); // Hỗ trợ CORS
app.use(express.json()); // Xử lý JSON request body
app.use(express.urlencoded({ extended: true })); // Hỗ trợ xử lý form data

Database.getInstance();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', AuthRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);
app.use("/api/categories",categories );
app.use("/api/reviews", reviewRoutes);
app.use("/api", reportRoutes);
app.use("/api", adminUserRoutes);
app.use("/api", adminPostRoutes);
app.use("*", (req, res, next) => {
    next(new NotFoundRequestError());
});
app.use(handleErrorsMiddeleware);

// Middleware xử lý lỗi
app.use(errorMiddleware);

// Khởi chạy server
const PORT = appConfig.port || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
