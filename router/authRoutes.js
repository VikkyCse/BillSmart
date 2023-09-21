const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Import your authentication controller

// Registration route
router.post('/register', authController.register);
router.post('/login',authController.login);
router.post('/loginRfid',authController.loginwithRfid);
router.post('/logoutRfid',authController.logoutwithRfid);

module.exports = router;