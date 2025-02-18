const express = require('express');
const appConfig = require('./config/app.config');
const Database = require('./database/mysql.database');
const AuthRoutes = require('./routes/Auth.routes');
const handleErrorsMiddeleware = require('./middlewares/error.middleware');
const cors = require("cors");
const postRoutes = require("./routes/post.routes");
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// Middleware
app.use(cors()); // Hỗ trợ CORS
app.use(express.json()); // Xử lý JSON request body
app.use(express.urlencoded({ extended: true })); // Hỗ trợ xử lý form data

Database.getInstance();

app.use(express.json());
app.use('/api', AuthRoutes);
app.use("/api/posts", postRoutes);

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
