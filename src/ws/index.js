const WebSocket = require("ws");
const { authenticateWebSocket } = require("../middlewares/auth.middleware");
const ChatService = require("../services/chat.service");

async function setupWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on("connection", async (ws, req) => {
        try {
            // Xác thực WebSocket
            await authenticateWebSocket(ws, req);

            // Nếu xác thực thất bại, đóng WebSocket
            if (!ws.user) {
                ws.close(4001, "Authentication failed");
                return;
            }

            console.log(`✅ Người dùng ${ws.user.id} đã kết nối WebSocket`);

            ChatService.addSocket(ws.user.id, ws);

            ws.send(JSON.stringify({ type: "system", message: "Kết nối websocket thành công" }));
            await ChatService.sendPendingMessages(ws.user.id);

            ws.on("message", (message) => {
                ChatService.handleMessage(ws.user.id, message);
                ChatService.handleSeenMessage(ws.user.id, message);
            });

            ws.on("close", () => {
                ChatService.removeSocket(ws.user.id);
                console.log(`🚪 Người dùng ${ws.user.id} đã ngắt kết nối`);
            });
        } catch (error) {
            console.error("❌ Lỗi xác thực WebSocket:", error.message);
            ws.close(4002, "Lỗi xác thực");
        }
    });
    return wss;
}

module.exports = setupWebSocket;
