const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller"); 

router.get('/user/get/:email', userController.getUser);
router.put('/user/update/:emailUser', userController.updateUser);
module.exports = router;