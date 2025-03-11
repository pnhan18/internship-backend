const appConfig = require('./config/app.config');
const http = require('http');
const app = require('./app');
const setupWebSocket = require('./ws');

const server = http.createServer(app);
setupWebSocket(server);

// Khởi chạy server
const PORT = appConfig.port || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại ${PORT}`);
});
