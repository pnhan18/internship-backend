const { AuthFailureError } = require("../core/error.response");
const CatchAsync = require("../utils/CatchAsync");
const Authentication = require("../utils/Authentication");
const UserService = require("../services/user.service");
require("dotenv").config();

const HEADER = {
    AUTHORIZATION: "authorization",
};

/**
 * Middleware xác thực HTTP request bằng JWT
 */
exports.authentication = CatchAsync(async (req, res, next) => {
    try {
        const authorizationHeader = req.headers[HEADER.AUTHORIZATION];
        if (!authorizationHeader) {
            throw new AuthFailureError("Missing Authorization header");
        }

        const accessToken = authorizationHeader.split(" ")[1];
        if (!accessToken) {
            throw new AuthFailureError("Invalid token format");
        }

        const decoded = Authentication.validateToken(accessToken);
        if (!decoded || !decoded.userId) {
            throw new AuthFailureError("Invalid token");
        }

        const user = await UserService.getUserById(decoded.userId);
        if (!user) {
            throw new AuthFailureError("User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new AuthFailureError("Authentication failed");
    }
});

/**
 * Middleware xác thực WebSocket bằng JWT
 */
exports.authenticateWebSocket = async (ws, req) => {
    try {
        const params = new URLSearchParams(req.url.split("?")[1]);
        const token = params.get("token");

        if (!token) {
            ws.close(4001, "Missing token");
            return;
        }

        const decoded = Authentication.validateToken(token);
        if (!decoded || !decoded.userId) {
            ws.close(4002, "Invalid token");
            return;
        }

        const user = await UserService.getUserById(decoded.userId);
        if (!user) {
            ws.close(4003, "User not found");
            return;
        }

        ws.user = user;
    } catch (error) {
        ws.close(4004, "Authentication failed");
    }
};