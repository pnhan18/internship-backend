const AuthService = require("../services/Auth.service");
const { CREATED } = require("../core/success.response");

class AuthController {
    static signUp = async (req, res) => {
        const { email, phone, password } = req.body;
        await AuthService.signUp(email, phone, password);
        new CREATED("Successfully registerd users!").send(res);
    }

    static login = async (req, res) => {
        const { email, password } = req.body;
        new CREATED("Successfully logged in!", await AuthService.login(email, password)).send(res);
    }
}

module.exports = AuthController;