const UserService = require('../services/user.service');

class UserController {
    static async getUser(req, res) {
        try {
            const email = req.params.email;
            const userData = await UserService.getUserByEmail(email);
            res.status(200).json(userData);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async updateUser(req, res) {
        try {
            const emailUser = req.params.emailUser;
            const { email, name, address, phone, avatar_url } = req.body;
            const updatedUser = await UserService.updateUserByEmail(emailUser, email, name, address, phone, avatar_url);

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json({ message: 'User updated successfully', data: updatedUser });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
    static async getAllUsers(req, res) {
        try {
            const { role, status, email, page = 1, pageSize = 10 } = req.query;

            const pageNumber = parseInt(page) || 1;
            const limitNumber = parseInt(pageSize) || 10;
            const offset = (pageNumber - 1) * limitNumber;

            const { users, total } = await UserService.getUsers(
                { role, status, email },
                { limit: limitNumber, offset }
            );

            res.status(200).json({
                success: true,
                data: users,
                pagination: {
                    total,
                    current_page: pageNumber,
                    per_page: limitNumber,
                    total_pages: Math.ceil(total / limitNumber)
                }
            });
        } catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    }

    static async getUserDetail(req, res) {
        try {
            const { email } = req.params;
            const user = await UserService.getUserDetailByEmail(email);

            if (!user) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
            }

            res.status(200).json({ success: true, data: user });
        } catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    }

    static async adminUpdateUser(req, res) {
        try {
            const { email } = req.params;
            const { role, status,rating } = req.body;
            const updatedUser = await UserService.updateUserByEmail(email, role, status,rating);

            if (!updatedUser) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng để cập nhật' });
            }

            res.json({ message: 'Cập nhật thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server: ' + error.message });
        }
    }

    static async createUser(req, res) {
        try {
            const newUser = await UserService.createUser(req.body);
            return res.status(201).json({
                message: 'Tạo người dùng thành công!',
                data: newUser,
            });
        } catch (error) {
            return res.status(500).json({ message: 'Lỗi server: ' + error.message });
        }
    }
}

module.exports = UserController;
