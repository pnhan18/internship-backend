const { DataTypes, Sequelize } = require('sequelize');
const Database = require('../database/mysql.database');
const sequelize = Database.getInstance().sequelize;

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    reviewerId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'reviewer_id'
    },
    sellerId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'seller_id'
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reviewTitle: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'review_title'
    },
    reviewContent: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'comment'
    },
    createAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        field: 'created_at'
    }
}, {
    tableName: 'reviews',
    frezeTableName: true,
    timestamps: false
});

module.exports = Review;

