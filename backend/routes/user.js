// Imports
const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")

//importation controllers content
const userCtrl = require('../controllers/users');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/accounts', userCtrl.getAllUsers);

router.get("/accounts/:id", userCtrl.getAccount);
router.put("/accounts/:id", multer, userCtrl.updateAccount);
router.delete("/accounts/:id", userCtrl.deleteAccount);
module.exports = router;