const { where, Op } = require('sequelize');
const Message = require('../models/Message.model');
const User = require('../models/User.model');
const { validateMessage } = require('../validators/message.validator');
let user = new Map();

class ChatService {
    static addSocket(userID, socket) {
        user.set(userID, socket);
        console.log('🚀 Đã thêm socket:', userID);
    }

    static removeSocket(userID) {
        user.delete(userID);
        console.log('🚪 Đã xóa socket:', userID);
    }

    static async handleMessage(fromUserID, message) {
        try {
            const data = JSON.parse(message.toString());
            if (data.type === 'chat') {
                const { error, value } = validateMessage(data);
                const senderSocket = user.get(fromUserID);
                if (error) {
                    const errorMessage = JSON.stringify({
                        type: "messageError",
                        errors: error.details.map(e => e.message)
                    });
                    senderSocket.send(errorMessage);
                    return;
                }
                const { receiverId, content, postId } = data;

                const sender = await User.findByPk(fromUserID);
                const receiver = await User.findByPk(receiverId);

                if (!sender) {
                    console.error(`❌ Người gửi ${fromUserID} không tồn tại.`);
                    return;
                }
                if (!receiver) {
                    console.error(`❌ Người nhận ${receiverId} không tồn tại.`);
                    return;
                }

                const recipientSocket = user.get(receiverId);
                const messageID = await this.saveMessage(fromUserID, receiverId, postId, content);

                if (recipientSocket && recipientSocket.readyState === WebSocket.OPEN) {
                    const response = JSON.stringify({
                        type: 'chat',
                        fromUserID,
                        postId,
                        content,
                        timestamp: new Date().toISOString()
                    });
                    recipientSocket.send(response);
                    await this.updateMessageStatus(messageID, "received");
                    if (senderSocket && senderSocket.readyState === WebSocket.OPEN) {
                        const sentResponse = JSON.stringify({
                            type: 'chat_status',
                            status: 'received',
                            messageID
                        });
                        senderSocket.send(sentResponse);
                    }
                }
            }
        } catch (error) {
            console.error('❌ Lỗi xử lý tin nhắn:', error);
        }
    }

    static async handleSeenMessage(receiverId, message) {
        try {
            const data = JSON.parse(message.toString());
            if (data.type === 'chat_status') {
                const { senderId } = data;
                const receiver = await User.findByPk(receiverId);
                const sender = await User.findByPk(senderId);

                if (!receiver || !sender) {
                    return;
                }


                await Message.update(
                    { status: "seen" },
                    {
                        where: {
                            receiverId: receiverId,
                            senderId: senderId,
                            status: {
                                [Op.ne]: 'seen'
                            }
                        }
                    }
                );

                const senderSocket = user.get(senderId);
                if (senderSocket && senderSocket.readyState === WebSocket.OPEN) {
                    const seenResponse = JSON.stringify({
                        type: 'chat_status',
                        status: 'seen',
                    });
                    senderSocket.send(seenResponse);
                }
            }
        } catch (err) {
            console.error('❌ Lỗi xử lý tin nhắn:', err);
        }
    }

    static async saveMessage(senderId, receiverId, postId, content) {
        return (await Message.create({
            senderId,
            receiverId,
            postId,
            content
        })).id;
    }

    static async updateMessageStatus(messageID, status) {
        try {
            await Message.update(
                { status },
                { where: { id: messageID } }
            );
        } catch (err) {
            console.error(`❌ Lỗi cập nhật trạng thái tin nhắn ${messageID} thành '${status}':`, err);
        }
    }
}

module.exports = ChatService;