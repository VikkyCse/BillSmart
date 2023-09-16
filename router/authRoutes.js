const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Import your authentication controller

// Registration route
router.post('/register', authController.register);
router.post('/login',authController.login);

module.exports = router;