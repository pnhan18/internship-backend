const express = require('express');
const bodyParser = require('body-parser');
const appConfig = require('./config/app.config');
const userRoutes = require('./routers/user.routes');
const Database = require('./database/mysql.database');
const handleErrorsMiddeleware = require('./middlewares/error.middleware');
// const NotFoundRequestError = require("./core/error.response");

const app = express();

const PORT = appConfig.port;
Database.getInstance();

app.use(bodyParser.json());
app.use(express.json());
app.use('/api/user', userRoutes);

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

app.use("*", (req, res, next) => {
    next();
});
app.use(handleErrorsMiddeleware);