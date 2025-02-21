
const User = require("../models/User.model");
const UserInfor = require("../models/UserInfor.model");
class UserService {
    async getUserById(userId) {
        const user = await User.findOne({
            where: { id: userId },
            include: [{ model: UserInfor, attributes: ['name', 'address', 'avatar_url', 'phone', 'rating'] }],
            attributes: ['email', 'created_at']
        });
        if (!user) return null;

        return {
            email: user.email,
            created_at: user.created_at,
            name: user.UserInfor?.name || null,
            address: user.UserInfor?.address || null,
            phone: user.UserInfor?.name ||null,
            avatar_url: user.UserInfor?.avatar_url||null,
            rating: user.UserInfor?.rating || null
        };
    }
    async updateUserById(userId,email, name, address, phone, avatar_url) {
        // Cập nhật bảng user
        const user = await User.findByPk(userId);
        if (!user) return null;

        if (email) user.email = email;
        await user.save();

        // Cập nhật bảng user_infor
        let userInfor = await UserInfor.findOne({ where: { user_id: userId } });
        if (!userInfor) {
            userInfor = await UserInfor.create({ user_id: userId, name, address, phone, avatar_url });
        } else {
            if (name) userInfor.name = name;
            if (address) userInfor.address = address;
            if (phone) userInfor.phone = phone;
            if (avatar_url) userInfor.avatar_url = avatar_url;
            await userInfor.save();
        }

        return { email: user.email, name, address, phone, avatar_url };
    }
}

module.exports = new UserService();
