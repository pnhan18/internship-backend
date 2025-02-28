const { DataTypes, Sequelize } = require('sequelize');
const Database = require('../database/mysql.database');
const sequelize = Database.getInstance().sequelize;
const Post = require('./Post');

const PostImage = sequelize.define('PostImage', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    post_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'image_url'
    }
}, {
    tableName: 'post_images',
    frezeTableName: true,
    timestamps: false
});

Post.hasMany(PostImage, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE'
});
PostImage.belongsTo(Post, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE'
});

module.exports = PostImage;
