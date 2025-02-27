const express = require('express');
const appConfig = require('./config/app.config');
const Database = require('./database/mysql.database');
const AuthRoutes = require('./routes/Auth.routes');
const handleErrorsMiddeleware = require('./middlewares/error.middleware');

const app = express();

const PORT = appConfig.port;

Database.getInstance();

app.use(express.json());
app.use('/', AuthRoutes);

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

app.use("*", (req, res, next) => {
    next(new NotFoundRequestError());
});
app.use(handleErrorsMiddeleware);