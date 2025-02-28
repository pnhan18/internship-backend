const express = require("express");
const cors = require("cors");
const appConfig = require("./config/app.config");
const Database = require("./database/mysql.database");
const postRoutes = require("./routers/post.routes");
const categoryRoutes = require("./routers/category.routes");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

// Middleware
app.use(cors()); // Hỗ trợ CORS
app.use(express.json()); // Xử lý JSON request body
app.use(express.urlencoded({ extended: true })); // Hỗ trợ xử lý form data

Database.getInstance();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', AuthRoutes);
app.use("/api/posts", postRoutes);

app.use(express.json());
app.use('/', AuthRoutes);

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

app.use("*", (req, res, next) => {
    next(new NotFoundRequestError());
});
app.use(handleErrorsMiddeleware);
