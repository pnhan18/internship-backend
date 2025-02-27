const { ConflictRequestError } = require('../core/error.response');
const Authentication = require('../utils/Authentication');
const User = require('../models/User.model');
const UserInfor = require('../models/UserInfor.model');
const sequelize = require('../database/mysql.database').getInstance().sequelize;

class AuthService {
    static signUp = async (email, phone, password) => {
        const holder = await User.findOne({
            where: {
                email
            }
        });
        if(holder !== null) {
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
}

module.exports = AuthService;