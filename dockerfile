# Sử dụng Node.js phiên bản 18
FROM node:22.11.0

# Đặt thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json vào container
COPY package*.json ./

# Cài đặt dependencies
RUN npm install --production

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Expose cổng (đổi 4000 nếu app của bạn dùng cổng khác)
EXPOSE 4000

# Chạy ứng dụng (đảm bảo nó trỏ vào `src/server.js`)
CMD ["node", "src/server.js"]
