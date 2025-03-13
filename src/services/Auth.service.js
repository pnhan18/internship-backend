const { ConflictRequestError, BadRequestError } = require('../core/error.response');
const Authentication = require('../utils/Authentication');
const User = require('../models/User.model');
const UserInfor = require('../models/UserInfo.model');
const sequelize = require('../database/mysql.database').getInstance().sequelize;

class AuthService {
    static signUp = async (email, phone, password) => {
        const holder = await User.findOne({
            where: {
                email
            }
        });
        if (holder !== null) {
            throw new ConflictRequestError('Email already exists');
        }
        const hashedPassword = await Authentication.passwordHash(password);
        try {
            const transaction = await sequelize.transaction();
            const user = await User.create({
                email,
                password_hash: hashedPassword
            }, {
                transaction
            });
            await UserInfor.create({
                userId: user.id,
                phone
            }, {
                transaction
            });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw new BadRequestError('Đã có lỗi xảy ra');
        }
     
    }

    static login = async (email, password) => {
        const holder = await User.findOne({
            where: {
                email
            }
        })
        if (!holder) {
            throw new BadRequestError('Email hoặc mật khẩu không chính xác');
        }
        const isMatch = await Authentication.passwordCompare(password, holder.password_hash);
        if (!isMatch) {
            throw new BadRequestError('Email hoặc mật khẩu không chính xác');
        }
        const refreshToken = await Authentication.generateRefreshToken(holder.email);
        const accessToken = await Authentication.generateAccessToken(holder.id, holder.role, holder.email);
        return {
            user: {
                email: holder.email,
                role: holder.role
            },
            token: {
                accessToken,
                refreshToken
            }
        }
    }
    static changePassword = async (req) => {
        const { oldPassword, newPassword } = req.body;
        const user = req.user;
    
        if (!user) {
            throw new BadRequestError('Người dùng không tồn tại');
        }
        if (!oldPassword || !newPassword) {
            throw new BadRequestError('Mật khẩu cũ và mới là bắt buộc');
        }
    
        const isMatch = await Authentication.passwordCompare(oldPassword, user.password_hash);
        if (!isMatch) {
            throw new BadRequestError('Mật khẩu cũ không chính xác');
        }
        const hashedNewPassword = await Authentication.passwordHash(newPassword);
        await User.update(
            { password_hash: hashedNewPassword },
            { where: { id: user.id } }
        );
        return { message: 'Thay đổi mật khẩu thành công' };
    };
}

module.exports = AuthService;