const express = require("express");
const AuthController = require("../controllers/Auth.controller");
const CatchAsync = require("../utils/CatchAsync");
const validate = require("../middlewares/validate.middleware");
const { userSchema } = require("../validators/user.validator");

const router = express.Router();

router.post("/signup", validate(userSchema),CatchAsync(AuthController.signUp));

module.exports = router;