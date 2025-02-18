const handleErrorsMiddleware = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
        message: "error",
        code: statusCode,
        error: error.message || "Internal Server Error",
    });
};

module.exports = handleErrorsMiddleware;
