const express = require('express');
const appConfig = require('./config/app.config');
const Database = require('./database/mysql.database');

const app = express();

const PORT = appConfig.port;

Database.getInstance();             

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});