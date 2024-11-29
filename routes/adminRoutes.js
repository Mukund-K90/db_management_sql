const express = require('express');
const userController = require('../controller/userController');
const { adminLogin } = require('../controller/adminController');
const router = express.Router();

//admin route
router.post('/login', adminLogin);


module.exports = router;