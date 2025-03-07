const Sequelize = require('sequelize');
const dbConfig = require('../config/db.config');

class Database {
    sequelize;
    constructor() {
        this.connect();
    }

    async connect() {

        this.sequelize = new Sequelize(
            dbConfig.db.database,
            dbConfig.db.username,
            dbConfig.db.password,
            {
                host: dbConfig.db.host,
                port: dbConfig.db.port || 3306,
                dialect: 'mysql',
                logging: false,
                dialectOptions: {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false 
                    }
                }
            }
        );

        try {
            await this.sequelize.authenticate();
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