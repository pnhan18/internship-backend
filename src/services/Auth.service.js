const { ConflictRequestError, BadRequestError } = require('../core/error.response');
const Authentication = require('../utils/Authentication');
const User = require('../models/User.model');
const UserInfor = require('../models/UserInfor.model');
const sequelize = require('../database/mysql.database').getInstance().sequelize;
const nodemailer = require('nodemailer');
const { Sequelize } = require('sequelize');

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
    static forgotPassword = async (email) => {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new BadRequestError('Email không tồn tại');
        }

        const resetToken = Authentication.generateResetToken(email);
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 giờ

        await User.update(
            { reset_token: resetToken, reset_token_expiry: resetTokenExpiry },
            { where: { email } }
        );

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const resetUrl = `http://localhost:9999/reset-password/${resetToken}`; // Sửa URL

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email, 
            subject: 'Reset Password Request',
            text: `click vào đây để reset pass: http://localhost:9999/reset-password/${resetToken}`
        };

        await transporter.sendMail(mailOptions);
    }

    static resetPassword = async (token, password) => {
        const decoded = Authentication.validateToken(token);
        if (!decoded || decoded.type !== 'reset') {
            throw new BadRequestError('Token không hợp lệ hoặc đã hết hạn');
        }

        const user = await User.findOne({
            where: {
                email: decoded.email,
                reset_token: token,
                reset_token_expiry: { [Sequelize.Op.gt]: new Date() }
            }
        });

        if (!user) {
            throw new BadRequestError('Token không hợp lệ hoặc đã hết hạn');
        }

        const hashedPassword = await Authentication.passwordHash(password);
        await User.update(
            { password_hash: hashedPassword, reset_token: null, reset_token_expiry: null },
            { where: { email: decoded.email } }
        );
    }
}

module.exports = AuthService;