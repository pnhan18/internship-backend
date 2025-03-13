const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const UserInfo = require("../models/UserInfo.model");
class UserService {
  static async getUserById(id) {
    return await User.findByPk(id);
  }
  
    static async getUserByEmail(email) {
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
    static async updateUserByEmail(emailUser,email, name, address, phone, avatar_url) {
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
    static async getUsers(filters, pagination) {
        try {
            let whereClause = {};
            if (filters.role) whereClause.role = filters.role;
            if (filters.status) whereClause.status = filters.status;
            if (filters.email) whereClause.email = { [Op.like]: `%${filters.email}%` }; // Tìm kiếm gần đúng email

            const { limit, offset } = pagination;

            const { rows: users, count: total } = await User.findAndCountAll({
                where: whereClause,
                attributes: { exclude: ["password_hash"] },
                limit,
                offset
            });
            return { users, total };
        } catch (error) {
            throw new Error('Lỗi khi lấy danh sách users');
        }
    }
    static async getUserDetailByEmail(email) {
        try {
            const user = await User.findOne({
              where: { email },
              attributes: { exclude: ["password_hash"] },
              include: [
                {
                  model: UserInfo,
                  attributes: { exclude: ["id", "userId"] }, // Loại bỏ id và user_id
                },
              ],
            });
      
            if (!user) {
              return null;
            }
      
            return user;
          } catch (error) {
            throw new Error("Lỗi khi truy vấn dữ liệu người dùng: " + error.message);
          }
    }
    // Cập nhật thông tin người dùng
    static async updateUserByEmail(emailUser, role, status,rating) {
      try {
        if (!emailUser) {
          throw new Error("Thiếu email của user!");
        }
    
        // Tìm user theo email
        const user = await User.findOne({ where: { email: emailUser } });
        if (!user) return null;
    
        // Cập nhật role & status
        await user.update({ role, status,rating });
    
        // Trả về user sau khi cập nhật
        return user;
      } catch (error) {
        throw new Error("Lỗi khi cập nhật dữ liệu người dùng: " + error.message);
      }
    }
  static async createUser(userData) {
    try {
      // 1️⃣ Mã hóa mật khẩu trước khi lưu
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // 2️⃣ Tạo user trong bảng `user`
      const user = await User.create({
        email: userData.email,
        password_hash: hashedPassword,
        role: userData.role,
      });

      // 3️⃣ Tạo thông tin chi tiết trong bảng `user_infor`
      const userInfor = await UserInfo.create({
        userId: user.id,
        name: userData.name,
        address: userData.address,
        phone: userData.phone,
        avatar_url: userData.avatar_url,
        tating:5
      });

      // 4️⃣ Trả về thông tin user (không bao gồm mật khẩu)
      return {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        userInfor: {
          name: userInfor.name,
          address: userInfor.address,
          phone: userInfor.phone,
          avatar_url: userInfor.avatar_url,
          rating: userInfor.rating,
        },
      };
    } catch (error) {
      throw new Error("Lỗi khi tạo người dùng: " + error.message);
    }
  }
}

module.exports =UserService;
