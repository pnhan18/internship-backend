const express = require("express");
const AuthController = require("../controllers/Auth.controller");
const CatchAsync = require("../utils/CatchAsync");
const validate = require("../middlewares/validate.middleware");
const { userSchema } = require("../validators/user.validator");
const { loginSchema,changePasswordSchema } = require("../validators/auth.validator");
const { authentication } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/signup", validate(userSchema),CatchAsync(AuthController.signUp));
router.post("/login", validate(loginSchema),CatchAsync(AuthController.login));
router.post("/change-password", authentication, validate(changePasswordSchema), CatchAsync(AuthController.changePassword));
module.exports = router;