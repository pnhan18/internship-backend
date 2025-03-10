const express = require("express");
const UserController = require("../controllers/user.controller"); 
const router = express.Router();

router.get("/admin/users/all", UserController.getAllUsers);
router.get("/admin/users/:email", UserController.getUserDetail);
router.put("/admin/users/update/:email", UserController.adminUpdateUser);
router.post("/admin/users/create", UserController.createUser);

module.exports = router;