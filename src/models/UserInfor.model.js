const { DataTypes } = require('sequelize');
const Database = require('../database/mysql.database');
const sequelize = Database.getInstance().sequelize;

const UserInfor = sequelize.define('UserInfor', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'user_id',
    },
    name: {
        type: DataTypes.STRING(255),
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    avatar: {
        type: DataTypes.TEXT,
    },
    rating: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
    }
}, {
    tableName: 'user_infor',
    frezeTableName: true,
    timestamps: false,
});

const User = require('./User.model');
User.hasOne(UserInfor, { foreignKey: 'userId' });
UserInfor.belongsTo(User, { foreignKey: 'userId' });

module.exports = UserInfor;
