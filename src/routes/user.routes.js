const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller"); 

router.get('/get/:email', userController.getUser);
router.put('/update/:emailUser', userController.updateUser);
module.exports = router;