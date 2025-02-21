const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller"); 

router.get('/get/:id', userController.getUser);
router.put('/update/:id', userController.updateUser);
module.exports = router;