const express = require('express');
const http = require("http");
const { Server } = require("socket.io");
const appConfig = require('./config/app.config');
const Database = require('./database/mysql.database');
const AuthRoutes = require('./routes/Auth.routes');
const handleErrorsMiddeleware = require('./middlewares/error.middleware');
const cors = require("cors");
const postRoutes = require("./routes/post.routes");
const userRoutes = require("./routes/user.routes");
const categories = require("./routes/category.routes");
const adminPostRoutes = require("./routes/admin.post.routes");
const messageRoutes = require("./routes/message.routes");
const messageSocket = require("./sockets/messageSocket");
const errorMiddleware = require('./middlewares/error.middleware');
const { NotFoundRequestError } = require('./core/error.response');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
messageSocket(io);
// Middleware
app.use(cors()); // Hỗ trợ CORS
app.use(express.json()); // Xử lý JSON request body
app.use(express.urlencoded({ extended: true })); // Hỗ trợ xử lý form data

Database.getInstance();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', AuthRoutes);
app.use("/api", postRoutes);
app.use("/api", userRoutes);
app.use("/api", categories );
app.use("/api", messageRoutes);
app.use("/api", adminPostRoutes);

app.use("*", (req, res, next) => {
    next(new NotFoundRequestError());
});
app.use(handleErrorsMiddeleware);



// Middleware xử lý lỗi
app.use(errorMiddleware);


// Khởi chạy server
const PORT = appConfig.port || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
