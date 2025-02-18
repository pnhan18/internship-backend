const Sequelize = require('sequelize');
const dbConfig = require('../config/db.config');

class Database {
    constructor() {
        this.connect();
    }

    async connect() {
        const sequelize = new Sequelize(dbConfig.db.database, dbConfig.db.username, dbConfig.db.password, {
            host: dbConfig.db.host,
            dialect: 'mysql'
        });
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

module.exports = Database;
