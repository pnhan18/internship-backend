require("dotenv").config();

class MySQLConfig {
  constructor() {
    this.db = {
      host: process.env.DB_HOST || "localhost",
      username: process.env.DB_USERNAME || "root",
      password: process.env.DB_PASSWORD || "",
      port: Number(process.env.DB_PORT || 3306),
      database: process.env.DB_NAME || "default_db",
      charset: "utf8mb4",
    };
  }
}

class DevConfig extends MySQLConfig {
  constructor() {
    super();
    this.db = {
      ...this.db,
      username: process.env.DEV_DB_USERNAME || "dev_user",
      password: process.env.DEV_DB_PASSWORD || "dev_password",
      database: process.env.DEV_DB_NAME || "dev_db",
    };
  }
}

class ProConfig extends MySQLConfig {
  constructor() {
    super();
    this.db = {
      ...this.db,
      port: Number(process.env.PRO_DB_PORT || 3306),
      database: process.env.PRO_DB_NAME || "prod_db",
    };
  }
}

const dbConfig = process.env.NODE_ENV === "production" ? new ProConfig() : new DevConfig();

module.exports = dbConfig;