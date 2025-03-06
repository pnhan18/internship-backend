const MessageService = require("../services/messageService");

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("🔌 A user connected:", socket.id);

        // Người dùng tham gia phòng chat riêng theo userId
        socket.on("joinRoom", (userId) => {
            socket.join(userId.toString());
            console.log(`User ${userId} đã tham gia vào room`);
        });

        // Xử lý gửi tin nhắn qua WebSocket
        socket.on("sendMessage", async (data) => {
            try {
                const message = await MessageService.sendMessage(data);

                // Gửi tin nhắn đến người nhận
                io.to(data.receiver_id.toString()).emit("receiveMessage", message);
            } catch (error) {
                console.error("Lỗi gửi tin nhắn:", error.message);
            }
        });

        // Khi client ngắt kết nối
        socket.on("disconnect", () => {
            console.log("🔌 A user disconnected:", socket.id);
        });
    });
};
 