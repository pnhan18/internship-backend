
const User = require("../models/User.model");
const UserInfo = require("../models/UserInfo.model");
class UserService {
    async getUserByEmail(email) {
        const user = await User.findOne({
            where: { email: email },
            include: [{ model: UserInfo, attributes: ['name', 'address', 'avatar_url', 'phone', 'rating'] }],
            attributes: ['email', 'created_at']
        });
        if (!user) return null;

        return {
            email: user.email,
            created_at: user.created_at,
            name: user.UserInfo?.name || null,
            address: user.UserInfo?.address || null,
            phone: user.UserInfo?.phone ||null,
            avatar_url: user.UserInfo?.avatar_url||null,
            rating: user.UserInfo?.rating || null
        };
    }
    async updateUserByEmail(emailUser,email, name, address, phone, avatar_url) {
        // Cập nhật bảng user
        const user = await User.findOne({ where: { email: emailUser } });
        if (!user) return null;

        if (email) user.email = email;
        await user.save();

        // Cập nhật bảng user_infor
        let userInfo = await UserInfo.findOne({ where: { user_id: user.id } });
        if (!userInfo) {
            userInfo = await UserInfo.create({ user_id: user.id, name, address, phone, avatar_url });
        } else {
            if (name) userInfo.name = name;
            if (address) userInfo.address = address;
            if (phone) userInfo.phone = phone;
            if (avatar_url) userInfo.avatar_url = avatar_url;
            await userInfo.save();
        }

        return { email: user.email, name, address, phone, avatar_url };
    }
}

module.exports = new UserService();
