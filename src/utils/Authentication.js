const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class Authentication {
    static checkEnvVariables() {
        const requiredVariables = ['JWT_SECRET_KEY', 'JWT_ACCESS_EXPIRES_IN', 'JWT_ACCESS_FORGOT_PASSWORD_EXPIRES_IN', 'JWT_REFRESH_EXPIRES_IN'];
        
        for (const variable of requiredVariables) {
            if (!process.env[variable]) {
                throw new Error(`Missing required environment variable: ${variable}`);
            }
        }
    }

    constructor() {
        Authentication.checkEnvVariables();
    }

    static async passwordHash(password) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    static async passwordCompare(text, encryptedText) {
        return await bcrypt.compare(text, encryptedText);
    }

    static generateAccessToken(id, role, email) {
        const secretKey = process.env.JWT_SECRET_KEY || 'my-secret-key';
        const payload = {
            userId: id,
            role: role,
            email: email,
        };
        const optionAccess = { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN };
        return jwt.sign(payload, secretKey, optionAccess);
    }

    static generateRefreshToken(email) {
        const secretKey = process.env.JWT_SECRET_KEY || 'my-secret-key';
        const payload = {
            email: email,
        };
        const optionRefresh = { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN };
        return jwt.sign(payload, secretKey, optionRefresh);
    }

    static validateToken(token) {
        try {
            const secretKey = process.env.JWT_SECRET_KEY || 'my-secret-key';
            return jwt.verify(token, secretKey);
        } catch (err) {
            return null;
        }
    }
}

module.exports = Authentication;
