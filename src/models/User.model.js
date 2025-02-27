const { DataTypes, Sequelize } = require('sequelize');
const Database = require('../database/mysql.database');
const sequelize = Database.getInstance().sequelize;

const User = sequelize.define('User', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('user', 'admin', 'subscriber'),
        allowNull: false,
        defaultValue: 'user'
    },
    createAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        field: 'created_at'
    }
}, {
    tableName: 'user',
    frezeTableName: true,
    timestamps: false
});

module.exports = User;
