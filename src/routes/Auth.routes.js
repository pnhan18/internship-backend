const express = require("express");
const AuthController = require("../controllers/Auth.controller");
const CatchAsync = require("../utils/CatchAsync");
const validate = require("../middlewares/validate.middleware");
const { userSchema } = require("../validators/user.validator");
const { loginSchema, forgotPasswordSchema, resetPasswordSchema } = require("../validators/auth.validator");

const router = express.Router();

router.post("/signup", validate(userSchema),CatchAsync(AuthController.signUp));
router.post("/login", validate(loginSchema),CatchAsync(AuthController.login));
router.post("/forgot-password", validate(forgotPasswordSchema), CatchAsync(AuthController.forgotPassword));
router.post("/reset-password/:token", validate(resetPasswordSchema), CatchAsync(AuthController.resetPassword));

module.exports = router;