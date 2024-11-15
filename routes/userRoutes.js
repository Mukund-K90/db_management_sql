const express = require('express');
const userController = require('../controller/userController');
const router = express.Router();

//user route
router.post('/insert', userController.insert);
router.get("/list", userController.viewData);
router.get("/view/:id", userController.viewUser);
router.post("/update/:id", userController.updateUser);
router.delete("/delete/:id", userController.deleteUser);


module.exports = router;